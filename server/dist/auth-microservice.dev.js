"use strict";

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  type User {\n    username: String!\n    password: String!\n    firstName: String!\n    lastName: String!\n    email: String!\n    accountType: String!\n  }\n\n  type Query {\n    currentUser: User\n    currentUserType: User\n  }\n  type Mutation {\n    login(username: String!, password: String!): Boolean\n    register(username: String!, password: String!, firstName: String!, lastName: String!, email: String!, accountType: String): Boolean\n    logout: Boolean\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

// server/auth-microservice.js
var express = require('express');

var _require = require('apollo-server-express'),
    ApolloServer = _require.ApolloServer,
    gql = _require.gql;

var jwt = require('jsonwebtoken');

var cookieParser = require('cookie-parser');

var cors = require('cors');

var mongoose = require('mongoose');

var bcrypt = require('bcrypt');

require('dotenv').config(); //


var app = express(); //
// Add cors middleware

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003', 'http://localhost:3004', 'https://studio.apollographql.com'],
  // Adjust the origin according to your micro frontends' host
  credentials: true // Allow cookies to be sent

}));
app.use(cookieParser()); //
// MongoDB connection setup

mongoose.connect(process.env.MONGODB_URI).then(function () {
  return console.log("MongoDB connected");
})["catch"](function (err) {
  return console.error("MongoDB connection error:", err);
}); //
// User schema definition

var userSchema = require('./userSchema'); //


var User = mongoose.model('User', userSchema); //

var typeDefs = gql(_templateObject());
module.exports = userSchema;
var resolvers = {
  Query: {
    currentUser: function currentUser(_, __, _ref) {
      var req = _ref.req;
      // Assuming the JWT token is sent via an HTTP-only cookie named 'token'
      var token = req.cookies['token'];

      if (!token) {
        return null; // No user is logged in
      }

      try {
        // Verify and decode the JWT. Note: Make sure to handle errors appropriately in a real app
        var decoded = jwt.verify(token, process.env.JWT_SECRET);
        return {
          username: decoded.username
        };
      } catch (error) {
        // Token verification failed
        return null;
      }
    },
    currentUserType: function currentUserType(_, __, _ref2) {
      var req = _ref2.req;
      // Assuming the JWT token is sent via an HTTP-only cookie named 'token'
      var token = req.cookies['token'];

      if (!token) {
        return null; // No user is logged in
      }

      try {
        // Verify and decode the JWT. Note: Make sure to handle errors appropriately in a real app
        var decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("decoded jwt token: " + decoded.accountType);
        return {
          accountType: decoded.accountType
        };
      } catch (error) {
        // Token verification failed
        return null;
      }
    }
  },
  Mutation: {
    login: function login(_, _ref3, _ref4) {
      var username, password, res, user, match, token;
      return regeneratorRuntime.async(function login$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              username = _ref3.username, password = _ref3.password;
              res = _ref4.res;
              _context.next = 4;
              return regeneratorRuntime.awrap(User.findOne({
                username: username
              }));

            case 4:
              user = _context.sent;

              if (user) {
                _context.next = 7;
                break;
              }

              throw new Error('User not found');

            case 7:
              _context.next = 9;
              return regeneratorRuntime.awrap(bcrypt.compare(password, user.password));

            case 9:
              match = _context.sent;

              if (match) {
                _context.next = 12;
                break;
              }

              throw new Error('Invalid password');

            case 12:
              //
              token = jwt.sign({
                username: user.username,
                accountType: user.accountType
              }, process.env.JWT_SECRET, {
                expiresIn: '1d'
              });
              res.cookie('token', token, {
                httpOnly: true,
                //sameSite: 'None',
                // secure: true, // Set to true if your site is served over HTTPS
                maxAge: 24 * 60 * 60 * 1000 // 1 day

              });
              return _context.abrupt("return", true);

            case 15:
            case "end":
              return _context.stop();
          }
        }
      });
    },
    register: function register(_, _ref5) {
      var username, password, firstName, lastName, email, accountType, existingUser, hashedPassword, newUser;
      return regeneratorRuntime.async(function register$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              username = _ref5.username, password = _ref5.password, firstName = _ref5.firstName, lastName = _ref5.lastName, email = _ref5.email, accountType = _ref5.accountType;
              _context2.next = 3;
              return regeneratorRuntime.awrap(User.findOne({
                username: username
              }));

            case 3:
              existingUser = _context2.sent;

              if (!existingUser) {
                _context2.next = 6;
                break;
              }

              throw new Error('Username is already taken');

            case 6:
              _context2.next = 8;
              return regeneratorRuntime.awrap(bcrypt.hash(password, 10));

            case 8:
              hashedPassword = _context2.sent;
              newUser = new User({
                username: username,
                password: hashedPassword,
                firstName: firstName,
                lastName: lastName,
                email: email,
                accountType: accountType
              });
              _context2.next = 12;
              return regeneratorRuntime.awrap(newUser.save());

            case 12:
              return _context2.abrupt("return", true);

            case 13:
            case "end":
              return _context2.stop();
          }
        }
      });
    },
    logout: function logout(_, __, _ref6) {
      var res = _ref6.res;
      res.clearCookie('token');
      return true;
    }
  }
}; //

var server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
  context: function context(_ref7) {
    var req = _ref7.req,
        res = _ref7.res;
    return {
      req: req,
      res: res
    };
  }
});
server.start().then(function () {
  server.applyMiddleware({
    app: app,
    cors: false
  }); //

  app.listen({
    port: 4001
  }, function () {
    return console.log("\uD83D\uDE80 Auth Server ready at http://localhost:4001".concat(server.graphqlPath));
  });
});
//# sourceMappingURL=auth-microservice.dev.js.map
