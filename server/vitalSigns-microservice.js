// server/product-microservice.js

const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');
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

// Product schema definition
const vitalSignSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  heartRate: Number,
  bloodPressure: String,
  temperature: Number,
  createdAt: { type: Date, default: Date.now },  
});

const VitalSign = model('VitalSign', vitalSignSchema);
// GraphQL schema
const typeDefs = gql`
    type VitalSign {
        id: ID
        userId: ID
        heartRate: Int
        bloodPressure: Int
        temperature: Float
        createdAt: String
    }

    type Query {
        getVitalSigns(userId: ID, username: String): [VitalSign]
    }

    type Mutation {
        addVitalSign(userId: ID!, heartRate: Int!, bloodPressure: Int!, temperature: Float!): VitalSign
        updateVitalSign(id: ID!, heartRate: Int, bloodPressure: Int, temperature: Float): VitalSign
    }
`;

// GraphQL resolvers
const resolvers = {
  Query: {
      getVitalSigns: async (_, { userId, username }) => {
          if (userId) {                             
              try {
                  const vitalSigns = await vitalSign.find({ userId: userId });                    
                  return vitalSigns;
              } catch (error) {
                  throw new Error("Error fetching vital signs: " + error.message);
              }
          }
          else if (username) {
              const vitalSigns = await vitalSign.aggregate([
              {
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
                  $project: {
                      userId: 1,
                      heartRate: 1,
                      bloodPressure: 1,
                      temperature: 1,
                      createdAt: 1
                  }
              }
          ]);
          return vitalSigns;
      } else {
          throw new Error("Invalid username or userId");
      }
  }
},
Mutation: {
        addVitalSign: async (_, { userId, heartRate, bloodPressure, temperature }) => {
            try {
              const newVitalSign = new vitalSign({ userId, heartRate, bloodPressure, temperature });
              return await newVitalSign.save();
            } catch (error) {
              throw new Error("Error adding vital sign: " + error.message);
            }
          },
          
        updateVitalSign: async (_, { id, heartRate, bloodPressure, temperature }) => {
            try {
                const updatedVitalSign = await vitalSign.findByIdAndUpdate(
                    id,
                    { heartRate, bloodPressure, temperature }, 
                    { new: true }
                );
                if (!updatedVitalSign) throw new Error("Vital sign not found"); 
                return updatedVitalSign;
            } catch (error) {
                throw new Error("Error updating vital sign: " + error.message);
            }
        }
    }
};

// Initialize express and configure middleware
const app = express();
app.use(cors({
origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'https://studio.apollographql.com'],
credentials: true,
}));
app.use(cookieParser());

// Create and start Apollo Server
const server = new ApolloServer({
typeDefs,
resolvers,
context: ({ req }) => {
  const token = req.cookies['token'];
  if (token) {
    try {
      const user = jwt.verify(token, 'your_secret_key'); // Replace 'your_secret_key' with your actual secret key
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
app.listen({ port: 4002 }, () => console.log(`🚀 Server ready at http://localhost:4002${server.graphqlPath}`));
});

