const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const userSchema = require('./userSchema');
require('dotenv').config();

const mongoose = require('mongoose');
const { Schema, model } = mongoose;

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
const User = model('User', userSchema);


const app = express();
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002','http://localhost:3003', 'https://studio.apollographql.com'],
    credentials: true,
}));
app.use(cookieParser());

const motivationalTipsSchema = new Schema({ 
    nurseUsername: String,
    patientUsername: String,
    tip: String,
    nurseName: String,
});

const motivationalTip = model('MotivationalTip', motivationalTipsSchema);

const typeDefs = gql`
    type MotivationalTip {
        id: ID,
        nurseUsername: String,
        patientUsername: String,
        tip: String, 
        nurseName: String,
    }

    type Query {
        getMotivationalTips: [MotivationalTip]
        getPatientMotivationalTips(patientUsername: String): [MotivationalTip]
    }


    type Mutation{
        addMotivationalTip(nurseUsername: String!, patientUsername: String, tip: String!): MotivationalTip
        deleteMotivationalTip(id: ID!): Boolean
        updateMotivationalTip(id: ID!, nurseUsername: String, patientUsername: String, tip: String, nurseName: String): MotivationalTip
    }
`;

app.use(bodyParser.json());

const getNameByUsername = async (username) => {
    const user = await User.findOne({ username });
    return user.firstName + " " + user.lastName;
}

const resolvers = {
    Query: {
        getMotivationalTips: async () => {
            try {
                return await motivationalTip.find({});
            } catch (error) {
                throw new Error("Error fetching motivational tips: " + error.message);
            }
        },
        getPatientMotivationalTips: async (_, { patientUsername }) => { 
            try {
                return await motivationalTip.find({ patientUsername });
            } catch (error) {
                throw new Error("Error fetching motivational tips for patient: " + error.message);
            }
        }
    },
    Mutation: {
        addMotivationalTip: async (_, { nurseUsername, patientUsername, tip }) => {
            console.log("Adding tip in backend: ", tip, nurseUsername, patientUsername);
            try {
                const nurse = await User.findOne({ username: nurseUsername });
                const patient = await User.findOne({ username: patientUsername });
                if (nurse && patient) {
                    const nurseName = await getNameByUsername(nurseUsername);
                    const newTip = new motivationalTip({ nurseUsername, patientUsername, tip, nurseName });
                    await newTip.save();
                    console.log("tip saved", newTip);
                    return newTip;
                } else {
                    throw new Error("Nurse or patient not found.");
                }
            } catch (error) {
                throw new Error("Error adding motivational tip: " + error.message);
            }
        },
        deleteMotivationalTip: async (_, { id }) => {
            try {
                await motivationalTip.findByIdAndDelete(id);
                return true;
            } catch (error) {
                throw new Error("Error deleting motivational tip: " + error.message);
            }
        },
        updateMotivationalTip: async (_, { id, nurseUsername, patientUsername, tip }) => {
            try {
                const updatedTip = await motivationalTip.findByIdAndUpdate(id, {  nurseUsername, patientUsername, tip }, { new: true });
                return updatedTip;
            } catch (error) {
                throw new Error("Error updating motivational tip: " + error.message);
            }
        }
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        const token = req.cookies['token'];
        console.log("token in tips:",token);
        if (token) {
            try {
                const user = jwt.verify(token, process.env.JWT_SECRET);
                return { user };
            } catch (e) {
                throw new Error('Your session expired. Sign in again.');
            }
        }
    },
});

server.start().then(() => {
    server.applyMiddleware({ app, cors: false });
    app.listen({ port: 4003 }, () =>
        console.log(`��� Server ready at http://localhost:4003${server.graphqlPath}`)
    );
 });
