const { gql } = require('apollo-server-express');

// Construct a schema using GraphQL schema language
const typeDefs = gql`
  type User {
    _id: ID!,
    username: String!,
    password: String!,

    isActive: Boolean!,
    isAdmin: Boolean!,
  },

  input UserInput {
    username: String!,
    password: String!,
  },

  type LoginUserResponse {
    token: String
    user: User
  }

  input LoginUserInput {
    username: String!
    password: String!
  }

  extend type Query {
    users: [User]
  },

  extend type Mutation {
    createUser(userInput: UserInput!): User,
    deleteUser(_id: ID!): User
    toggleActiveUser(_id: ID!, isActive: Boolean!): User
    toggleAdminUser(_id: ID!, isAdmin: Boolean!): User
    loginUser(loginUserInput: LoginUserInput!): LoginUserResponse!
  }
`;

module.exports = typeDefs;
