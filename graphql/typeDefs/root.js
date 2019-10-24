const { gql } = require('apollo-server-express');

// Construct a schema using GraphQL schema language
const typeDefs = gql`
  type Query {
    root: String
  },
  type Mutation {
    root: String
  }
`;

module.exports = typeDefs;
