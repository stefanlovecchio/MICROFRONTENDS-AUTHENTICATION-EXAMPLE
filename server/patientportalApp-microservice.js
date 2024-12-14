require('dotenv').config();
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const mongoose = require('mongoose');

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Define Mongoose schema and model
const emergencyAlertSchema = new mongoose.Schema({
    patientName: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String },
    timestamp: { type: Date, default: Date.now },
});

const EmergencyAlert = mongoose.model('EmergencyAlert', emergencyAlertSchema);

// GraphQL schema
const typeDefs = gql `
  type EmergencyAlert {
    id: ID!
    patientName: String!
    type: String!
    description: String
    timestamp: String!
  }

  type Query {
    emergencyAlerts: [EmergencyAlert]
  }

  type Mutation {
    addEmergencyAlert(patientName: String!, type: String!, description: String): EmergencyAlert
  }
`;

// GraphQL resolvers
const resolvers = {
    Query: {
        emergencyAlerts: async() => {
            try {
                return await EmergencyAlert.find().sort({ timestamp: -1 });
            } catch (err) {
                console.error('Error fetching emergency alerts:', err);
                throw new Error('Could not fetch emergency alerts');
            }
        },
    },
    Mutation: {
        addEmergencyAlert: async(_, { patientName, type, description }) => {
            try {
                const newAlert = new EmergencyAlert({ patientName, type, description });
                await newAlert.save();
                return newAlert;
            } catch (err) {
                console.error('Error adding emergency alert:', err);
                throw new Error('Could not add emergency alert');
            }
        },
    },
};

// Initialize Apollo Server
const app = express();
const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true, // Enable GraphiQL for testing
});

server.start().then(() => {
    server.applyMiddleware({ app });

    // Start Express server
    const PORT = process.env.PORT || 4004;
    app.listen(PORT, () => {
        console.log(`🚀 Emergency Alert Service running at http://localhost:${PORT}${server.graphqlPath}`);
    });
});