const { gql } = require('apollo-server-express');

// Construct a schema using GraphQL schema language
const typeDefs = gql`
  type User {
    _id: ID,
    email: String,
    password: String,

  },

  input UserInput {
    _id: ID,
    name: String,
    description: String,
  },

  extend type Query {
    users: [User]
  },
  extend type Mutation {
    createUser(input: UserInput!): User,
    deleteUser(_id: ID!): User
  }
`;

module.exports = typeDefs;
