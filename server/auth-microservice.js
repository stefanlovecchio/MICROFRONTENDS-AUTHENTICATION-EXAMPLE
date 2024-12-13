// server/auth-microservice.js
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();
//
const app = express();
//
// Add cors middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001',
        'http://localhost:3002', 'http://localhost:3003', 'http://localhost:3004', 'https://studio.apollographql.com'
    ], // Adjust the origin according to your micro frontends' host
    credentials: true, // Allow cookies to be sent
}));
app.use(cookieParser());
//
// MongoDB connection setup
mongoose.connect(
        import.meta.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));
//
// User schema definition
const userSchema = require('./userSchema');
//
const User = mongoose.model('User', userSchema);
//
const typeDefs = gql `
  type User {
    username: String!
    password: String!
    firstName: String!
    lastName: String!
    email: String!
    accountType: String!
  }

  type Query {
    currentUser: User
    currentUserType: User
  }
  type Mutation {
    login(username: String!, password: String!): Boolean
    register(username: String!, password: String!, firstName: String!, lastName: String!, email: String!, accountType: String): Boolean
    logout: Boolean
  }
`;

module.exports = userSchema;

const resolvers = {
    Query: {
        currentUser: (_, __, { req }) => {
            // Assuming the JWT token is sent via an HTTP-only cookie named 'token'
            const token = req.cookies['token'];
            if (!token) {
                return null; // No user is logged in
            }

            try {
                // Verify and decode the JWT. Note: Make sure to handle errors appropriately in a real app
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                return { username: decoded.username };
            } catch (error) {
                // Token verification failed
                return null;
            }
        },

        currentUserType: (_, __, { req }) => {
            // Assuming the JWT token is sent via an HTTP-only cookie named 'token'
            const token = req.cookies['token'];
            if (!token) {
                return null; // No user is logged in
            }

            try {
                // Verify and decode the JWT. Note: Make sure to handle errors appropriately in a real app
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                console.log("decoded jwt token: " + decoded.accountType);
                return { accountType: decoded.accountType };
            } catch (error) {
                // Token verification failed
                return null;
            }
        },
    },
    Mutation: {
        login: async(_, { username, password }, { res }) => {
            // In a real app, validate username and password against a database
            const user = await User.findOne({ username });
            if (!user) {
                throw new Error('User not found');
            }
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                throw new Error('Invalid password');
            }
            //
            const token = jwt.sign({ username: user.username, accountType: user.accountType }, process.env.JWT_SECRET, { expiresIn: '1d' });
            res.cookie('token', token, {
                httpOnly: true,
                //sameSite: 'None',
                // secure: true, // Set to true if your site is served over HTTPS
                maxAge: 24 * 60 * 60 * 1000, // 1 day
            });
            return true;
        },
        register: async(_, { username, password, firstName, lastName, email, accountType }) => {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                throw new Error('Username is already taken');
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({ username, password: hashedPassword, firstName, lastName, email, accountType });
            await newUser.save();
            return true;
        },
        logout: (_, __, { res }) => {
            res.clearCookie('token');
            return true;
        }
    },
};
//
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ req, res }),
});
server.start().then(() => {
    server.applyMiddleware({ app, cors: false });
    //
    app.listen({ port: 4001 }, () =>
        console.log(`🚀 Auth Server ready at http://localhost:4001${server.graphqlPath}`)
    );
});