require('dotenv').config();
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const cors = require('cors');
const mongoose = require('mongoose');
const userSchema = require('./schemas/userSchema');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// GraphQL Endpoint
app.use(
    '/graphql',
    graphqlHTTP({
        schema: userSchema,
        graphiql: true, // Enable GraphiQL for testing
    })
);

// Server Start
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Patient Portal API running on http://localhost:${PORT}/graphql`);
});