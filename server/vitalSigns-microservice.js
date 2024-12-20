// server/product-microservice.js
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const userSchema = require('./userSchema');
require('dotenv').config();
//
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// MongoDB connection setup
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
//user model
const User = model('User', userSchema);

// Initialize express and configure middleware
const app = express();
app.use(cors({
origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003', 'https://studio.apollographql.com'],
credentials: true,

}));
app.use(cookieParser());



// Vital signs schema definition
const vitalSignSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    heartRate: Number,
    bloodPressure: String,
    temperature: Number,
    createdAt: { type: Date, default: Date.now },
});

const vitalSign = model('VitalSign', vitalSignSchema);

// GraphQL schema
const typeDefs = gql `
    type VitalSign {
        id: ID
        userId: ID
        heartRate: Int
        bloodPressure: Int
        temperature: Float
        createdAt: String
    }

    type Query {
        getVitalSigns(userId:ID, username: String): [VitalSign]
    }

    type Mutation {
        addVitalSign(username: String!, heartRate: Int!, bloodPressure: Int!, temperature: Float!): VitalSign
        updateVitalSign(id: ID!, heartRate: Int, bloodPressure: Int, temperature: Float): VitalSign
    }
`;

// Middleware
app.use(bodyParser.json());


//Get vital signs by username function
const getVitalSignsByUsername = async(username) => {
    try {
        const vitalSigns = await vitalSign.aggregate([{
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $match: {
                    'user.username': { $regex: username, $options: 'i' }
                }
            },
            {
                $addFields: {
                    id: '$_id'
                }
            },
            {
                $project: {
                    _id: 0,
                    id: 1,
                    userId: 1,
                    heartRate: 1,
                    bloodPressure: 1,
                    temperature: 1,
                    createdAt: 1
                }
            }
        ]);
        return vitalSigns;
    } catch (error) {
        throw new Error("Error fetching vital signs for this username: " + error.message);
    }
}

//Get userId by username
const getUserIdByUsername = async(username) => {
    const user = await User.findOne({ username });
    return user._id;
};

// GraphQL resolvers
const resolvers = {
    Query: {
        getVitalSigns: async(_, { userId, username }) => {
            if (userId) {
                try {
                    const vitalSigns = await vitalSign.find({ userId: userId });
                    return vitalSigns;
                } catch (error) {
                    throw new Error("Error fetching vital signs: " + error.message);
                }
            } else if (username) {
                return getVitalSignsByUsername(username);
            } else {
                throw new Error("Invalid username or userId");
            }
        }
    },
    Mutation: {
        addVitalSign: async(_, { username, heartRate, bloodPressure, temperature }) => {
            const userId = await getUserIdByUsername(username);
            console.log(userId);
            try {
                const newVitalSign = new vitalSign({ userId, heartRate, bloodPressure, temperature });
                return await newVitalSign.save();
            } catch (error) {
                throw new Error("Error adding vital sign: " + error.message);
            }
        },

        updateVitalSign: async(_, { id, heartRate, bloodPressure, temperature }) => {
            try {

                const updatedVitalSign = await vitalSign.findByIdAndUpdate(
                    id, { heartRate, bloodPressure, temperature }, { new: true }
                );
                if (!updatedVitalSign) throw new Error("Vital sign not found");
                return updatedVitalSign;
            } catch (error) {
                throw new Error("Error updating vital sign: " + error.message);
            }
        }
    }
};



// Create and start Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.cookies['token'];
    console.log("token in vital signs:",token);
    if (token) {
      try {
        const user = jwt.verify(token, process.env.JWT_SECRET); // Replace 'your_secret_key' with your actual secret key
        return { user };
      } catch (e) {
        throw new Error('Your session expired. Sign in again.');
      }
    }
  },
});
//
server.start().then(() => {
  server.applyMiddleware({ app, cors: false });
  app.listen({ port: 4002 }, () => 
    console.log(`🚀 Vital Signs Server ready at http://localhost:4002${server.graphqlPath}`));
});

