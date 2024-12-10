const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true, // Ensures username is unique
    required: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true, // Ensures email is unique
    required: true
  },
  accountType: {
    type: String,
    required: true
  }
}, { timestamps: true });
//
const User = mongoose.model('User', userSchema);
//
const typeDefs = gql`
  type User {
    username: String!
  }

  type Query {
    currentUser: User
  }
  type Mutation {
    login(username: String!, password: String!): Boolean
    register(username: String!, password: String!, firstName: String!, lastName: String!, email: String!, accountType: String): Boolean
    logout: Boolean
  }
`;

module.exports = userSchema;