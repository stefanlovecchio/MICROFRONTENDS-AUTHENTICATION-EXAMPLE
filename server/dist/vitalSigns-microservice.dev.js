"use strict";

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n    type VitalSign {\n        id: ID\n        userId: ID\n        heartRate: Int\n        bloodPressure: Int\n        temperature: Float\n        createdAt: String\n    }\n\n    type Query {\n        getVitalSigns(userId:ID, username: String): [VitalSign]\n    }\n\n    type Mutation {\n        addVitalSign(username: String!, heartRate: Int!, bloodPressure: Int!, temperature: Float!): VitalSign\n        updateVitalSign(id: ID!, heartRate: Int, bloodPressure: Int, temperature: Float): VitalSign\n    }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

// server/product-microservice.js
var express = require('express');

var _require = require('apollo-server-express'),
    ApolloServer = _require.ApolloServer,
    gql = _require.gql;

var jwt = require('jsonwebtoken');

var cors = require('cors');

var cookieParser = require('cookie-parser');

var bodyParser = require('body-parser');

var userSchema = require('./userSchema');

require('dotenv').config(); //


var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    model = mongoose.model; // MongoDB connection setup

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:')); //user model

var User = model('User', userSchema); // Initialize express and configure middleware

var app = express();
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'https://studio.apollographql.com'],
  credentials: true
}));
app.use(cookieParser()); // Vital signs schema definition

var vitalSignSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  heartRate: Number,
  bloodPressure: String,
  temperature: Number,
  createdAt: {
    type: Date,
    "default": Date.now
  }
});
var vitalSign = model('VitalSign', vitalSignSchema); // GraphQL schema

var typeDefs = gql(_templateObject()); // Middleware

app.use(bodyParser.json()); //Get vital signs by username function

var getVitalSignsByUsername = function getVitalSignsByUsername(username) {
  var vitalSigns;
  return regeneratorRuntime.async(function getVitalSignsByUsername$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(vitalSign.aggregate([{
            $lookup: {
              from: 'users',
              localField: 'userId',
              foreignField: '_id',
              as: 'user'
            }
          }, {
            $match: {
              'user.username': {
                $regex: username,
                $options: 'i'
              }
            }
          }, {
            $addFields: {
              id: '$_id'
            }
          }, {
            $project: {
              _id: 0,
              id: 1,
              userId: 1,
              heartRate: 1,
              bloodPressure: 1,
              temperature: 1,
              createdAt: 1
            }
          }]));

        case 3:
          vitalSigns = _context.sent;
          return _context.abrupt("return", vitalSigns);

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          throw new Error("Error fetching vital signs for this username: " + _context.t0.message);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; //Get userId by username


var getUserIdByUsername = function getUserIdByUsername(username) {
  var user;
  return regeneratorRuntime.async(function getUserIdByUsername$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(User.findOne({
            username: username
          }));

        case 2:
          user = _context2.sent;
          return _context2.abrupt("return", user._id);

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
}; // GraphQL resolvers


var resolvers = {
  Query: {
    getVitalSigns: function getVitalSigns(_, _ref) {
      var userId, username, vitalSigns;
      return regeneratorRuntime.async(function getVitalSigns$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              userId = _ref.userId, username = _ref.username;

              if (!userId) {
                _context3.next = 14;
                break;
              }

              _context3.prev = 2;
              _context3.next = 5;
              return regeneratorRuntime.awrap(vitalSign.find({
                userId: userId
              }));

            case 5:
              vitalSigns = _context3.sent;
              return _context3.abrupt("return", vitalSigns);

            case 9:
              _context3.prev = 9;
              _context3.t0 = _context3["catch"](2);
              throw new Error("Error fetching vital signs: " + _context3.t0.message);

            case 12:
              _context3.next = 19;
              break;

            case 14:
              if (!username) {
                _context3.next = 18;
                break;
              }

              return _context3.abrupt("return", getVitalSignsByUsername(username));

            case 18:
              throw new Error("Invalid username or userId");

            case 19:
            case "end":
              return _context3.stop();
          }
        }
      }, null, null, [[2, 9]]);
    }
  },
  Mutation: {
    addVitalSign: function addVitalSign(_, _ref2) {
      var username, heartRate, bloodPressure, temperature, userId, newVitalSign;
      return regeneratorRuntime.async(function addVitalSign$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              username = _ref2.username, heartRate = _ref2.heartRate, bloodPressure = _ref2.bloodPressure, temperature = _ref2.temperature;
              _context4.next = 3;
              return regeneratorRuntime.awrap(getUserIdByUsername(username));

            case 3:
              userId = _context4.sent;
              console.log(userId);
              _context4.prev = 5;
              newVitalSign = new vitalSign({
                userId: userId,
                heartRate: heartRate,
                bloodPressure: bloodPressure,
                temperature: temperature
              });
              _context4.next = 9;
              return regeneratorRuntime.awrap(newVitalSign.save());

            case 9:
              return _context4.abrupt("return", _context4.sent);

            case 12:
              _context4.prev = 12;
              _context4.t0 = _context4["catch"](5);
              throw new Error("Error adding vital sign: " + _context4.t0.message);

            case 15:
            case "end":
              return _context4.stop();
          }
        }
      }, null, null, [[5, 12]]);
    },
    updateVitalSign: function updateVitalSign(_, _ref3) {
      var id, heartRate, bloodPressure, temperature, updatedVitalSign;
      return regeneratorRuntime.async(function updateVitalSign$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              id = _ref3.id, heartRate = _ref3.heartRate, bloodPressure = _ref3.bloodPressure, temperature = _ref3.temperature;
              _context5.prev = 1;
              _context5.next = 4;
              return regeneratorRuntime.awrap(vitalSign.findByIdAndUpdate(id, {
                heartRate: heartRate,
                bloodPressure: bloodPressure,
                temperature: temperature
              }, {
                "new": true
              }));

            case 4:
              updatedVitalSign = _context5.sent;

              if (updatedVitalSign) {
                _context5.next = 7;
                break;
              }

              throw new Error("Vital sign not found");

            case 7:
              return _context5.abrupt("return", updatedVitalSign);

            case 10:
              _context5.prev = 10;
              _context5.t0 = _context5["catch"](1);
              throw new Error("Error updating vital sign: " + _context5.t0.message);

            case 13:
            case "end":
              return _context5.stop();
          }
        }
      }, null, null, [[1, 10]]);
    }
  }
}; // Create and start Apollo Server

var server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
  context: function context(_ref4) {
    var req = _ref4.req;
    var token = req.cookies['token'];

    if (token) {
      try {
        var user = jwt.verify(token, 'your_secret_key'); // Replace 'your_secret_key' with your actual secret key

        return {
          user: user
        };
      } catch (e) {
        throw new Error('Your session expired. Sign in again.');
      }
    }
  }
}); //

server.start().then(function () {
  server.applyMiddleware({
    app: app,
    cors: false
  });
  app.listen({
    port: 4002
  }, function () {
    return console.log("\uD83D\uDE80 Server ready at http://localhost:4002".concat(server.graphqlPath));
  });
});
//# sourceMappingURL=vitalSigns-microservice.dev.js.map
