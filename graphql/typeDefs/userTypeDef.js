const { gql } = require('apollo-server-express');

// Construct a schema using GraphQL schema language
const typeDefs = gql`
  type User {
    _id: ID!,
    password: String!,
    email: String!,
    firstname: String,
    lastname: String,

    isActive: Boolean!,
    isAdmin: Boolean!,
  },

  input UserInput {
    _id: ID,
    password: String,
    email: String,
    firstname: String,
    lastname: String,

    isActive: Boolean,
    isAdmin: Boolean,
  },

  type LoginUserResponse {
    token: String
    user: User
  }

  input LoginUserInput {
    email: String!
    password: String!
  }

  extend type Query {
    users: [User]
    loginUser(loginUserInput: LoginUserInput!): LoginUserResponse!
  },

  extend type Mutation {
    saveUser(userInput: UserInput!): User,
    deleteUser(_id: ID!): User
    toggleActiveUser(_id: ID!, isActive: Boolean!): User
    toggleAdminUser(_id: ID!, isAdmin: Boolean!): User
  }
`;

module.exports = typeDefs;
