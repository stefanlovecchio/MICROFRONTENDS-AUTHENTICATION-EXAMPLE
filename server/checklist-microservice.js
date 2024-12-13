const express = require('express');
const mongoose = require('mongoose');
const { ApolloServer, gql } = require('apollo-server-express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(
    import.meta.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Checklist Schema
const checklistSchema = new mongoose.Schema({
    userId: String,
    symptoms: [String],
    submittedAt: { type: Date, default: Date.now },
});
const Checklist = mongoose.model('Checklist', checklistSchema);

// GraphQL Schema
const typeDefs = gql `
  type Checklist {
    id: ID
    userId: String
    symptoms: [String]
    submittedAt: String
  }

  type Query {
    getChecklists(userId: String!): [Checklist]
  }

  type Mutation {
    submitChecklist(userId: String!, symptoms: [String]!): Checklist
  }
`;

// GraphQL Resolvers
const resolvers = {
    Query: {
        getChecklists: async(_, { userId }) => {
            return await Checklist.find({ userId });
        },
    },
    Mutation: {
        submitChecklist: async(_, { userId, symptoms }) => {
            const checklist = new Checklist({ userId, symptoms });
            return await checklist.save();
        },
    },
};

// Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });
server.start().then(() => {
    server.applyMiddleware({ app });
    app.listen({ port: 4004 }, () =>
        console.log(`Checklist service ready at http://localhost:4004${server.graphqlPath}`)
    );
});