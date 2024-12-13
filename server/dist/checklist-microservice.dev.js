"use strict";

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  type Checklist {\n    id: ID\n    userId: String\n    symptoms: [String]\n    submittedAt: String\n  }\n\n  type Query {\n    getChecklists(userId: String!): [Checklist]\n  }\n\n  type Mutation {\n    submitChecklist(userId: String!, symptoms: [String]!): Checklist\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var express = require('express');

var mongoose = require('mongoose');

var _require = require('apollo-server-express'),
    ApolloServer = _require.ApolloServer,
    gql = _require.gql;

var bodyParser = require('body-parser');

require('dotenv').config();

var app = express();
app.use(bodyParser.json()); // MongoDB Connection

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:')); // Checklist Schema

var checklistSchema = new mongoose.Schema({
  userId: String,
  symptoms: [String],
  submittedAt: {
    type: Date,
    "default": Date.now
  }
});
var Checklist = mongoose.model('Checklist', checklistSchema); // GraphQL Schema

var typeDefs = gql(_templateObject()); // GraphQL Resolvers

var resolvers = {
  Query: {
    getChecklists: function getChecklists(_, _ref) {
      var userId;
      return regeneratorRuntime.async(function getChecklists$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              userId = _ref.userId;
              _context.next = 3;
              return regeneratorRuntime.awrap(Checklist.find({
                userId: userId
              }));

            case 3:
              return _context.abrupt("return", _context.sent);

            case 4:
            case "end":
              return _context.stop();
          }
        }
      });
    }
  },
  Mutation: {
    submitChecklist: function submitChecklist(_, _ref2) {
      var userId, symptoms, checklist;
      return regeneratorRuntime.async(function submitChecklist$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              userId = _ref2.userId, symptoms = _ref2.symptoms;
              checklist = new Checklist({
                userId: userId,
                symptoms: symptoms
              });
              _context2.next = 4;
              return regeneratorRuntime.awrap(checklist.save());

            case 4:
              return _context2.abrupt("return", _context2.sent);

            case 5:
            case "end":
              return _context2.stop();
          }
        }
      });
    }
  }
}; // Apollo Server

var server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers
});
server.start().then(function () {
  server.applyMiddleware({
    app: app
  });
  app.listen({
    port: 4004
  }, function () {
    return console.log("Checklist service ready at http://localhost:4004".concat(server.graphqlPath));
  });
});
//# sourceMappingURL=checklist-microservice.dev.js.map
