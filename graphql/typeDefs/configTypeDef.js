const { gql } = require('apollo-server-express');

// Construct a schema using GraphQL schema language
const typeDefs = gql`

  extend type Query {
    version: String
  }
`;

module.exports = typeDefs;
