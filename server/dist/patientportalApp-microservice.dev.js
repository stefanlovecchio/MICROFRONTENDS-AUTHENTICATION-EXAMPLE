"use strict";

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  type EmergencyAlert {\n    id: ID!\n    patientName: String!\n    type: String!\n    description: String\n    timestamp: String!\n  }\n\n  type Query {\n    emergencyAlerts: [EmergencyAlert]\n  }\n\n  type Mutation {\n    addEmergencyAlert(patientName: String!, type: String!, description: String): EmergencyAlert\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

require('dotenv').config();

var express = require('express');

var _require = require('apollo-server-express'),
    ApolloServer = _require.ApolloServer,
    gql = _require.gql;

var mongoose = require('mongoose'); // MongoDB connection


mongoose.connect(process.env.MONGODB_URI).then(function () {
  return console.log('MongoDB connected');
})["catch"](function (err) {
  return console.error('MongoDB connection error:', err);
}); // Define Mongoose schema and model

var emergencyAlertSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  timestamp: {
    type: Date,
    "default": Date.now
  }
});
var EmergencyAlert = mongoose.model('EmergencyAlert', emergencyAlertSchema); // GraphQL schema

var typeDefs = gql(_templateObject()); // GraphQL resolvers

var resolvers = {
  Query: {
    emergencyAlerts: function emergencyAlerts() {
      return regeneratorRuntime.async(function emergencyAlerts$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return regeneratorRuntime.awrap(EmergencyAlert.find().sort({
                timestamp: -1
              }));

            case 3:
              return _context.abrupt("return", _context.sent);

            case 6:
              _context.prev = 6;
              _context.t0 = _context["catch"](0);
              console.error('Error fetching emergency alerts:', _context.t0);
              throw new Error('Could not fetch emergency alerts');

            case 10:
            case "end":
              return _context.stop();
          }
        }
      }, null, null, [[0, 6]]);
    }
  },
  Mutation: {
    addEmergencyAlert: function addEmergencyAlert(_, _ref) {
      var patientName, type, description, newAlert;
      return regeneratorRuntime.async(function addEmergencyAlert$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              patientName = _ref.patientName, type = _ref.type, description = _ref.description;
              _context2.prev = 1;
              newAlert = new EmergencyAlert({
                patientName: patientName,
                type: type,
                description: description
              });
              _context2.next = 5;
              return regeneratorRuntime.awrap(newAlert.save());

            case 5:
              return _context2.abrupt("return", newAlert);

            case 8:
              _context2.prev = 8;
              _context2.t0 = _context2["catch"](1);
              console.error('Error adding emergency alert:', _context2.t0);
              throw new Error('Could not add emergency alert');

            case 12:
            case "end":
              return _context2.stop();
          }
        }
      }, null, null, [[1, 8]]);
    }
  }
}; // Initialize Apollo Server

var app = express();
var server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
  introspection: true // Enable GraphiQL for testing

});
server.start().then(function () {
  server.applyMiddleware({
    app: app
  }); // Start Express server

  var PORT = process.env.PORT || 4004;
  app.listen(PORT, function () {
    console.log("\uD83D\uDE80 Emergency Alert Service running at http://localhost:".concat(PORT).concat(server.graphqlPath));
  });
});
//# sourceMappingURL=patientportalApp-microservice.dev.js.map
