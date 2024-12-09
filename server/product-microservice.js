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
const productSchema = new Schema({
  productName: String,
  productDescription: String,
});

const Product = model('Product', productSchema);
// GraphQL schema
const typeDefs = gql`
  type Product {
    id: ID!
    productName: String!
    productDescription: String!
  }

  type Query {
    products: [Product]
  }

  type Mutation {
    addProduct(productName: String!, productDescription: String!): Product
  }
`;

// GraphQL resolvers
const resolvers = {
  Query: {
    products: async (_, __, { user }) => {
      if (!user) throw new Error('You must be logged in');
      return await Product.find({});
    },
},
Mutation: {
  addProduct: async (_, { productName, productDescription }, { user }) => {
    if (!user) throw new Error('You must be logged in');
    const newProduct = new Product({ productName, productDescription });
    await newProduct.save();
    return newProduct;
  },
},
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

