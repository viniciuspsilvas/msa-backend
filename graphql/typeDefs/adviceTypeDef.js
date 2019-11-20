const { gql } = require('apollo-server-express');

// Construct a schema using GraphQL schema language
const typeDefs = gql`
  type Advice {
    _id: ID,
    description: String,
    token: String,
    isActive: Boolean,
    student: Student,
  },

  extend type Query {
    advices: [Advice]
  },
  
  extend type Mutation {
    createAdvice(input: AdviceInput!): Advice,
    deleteAdvice(id: String!): Advice
  }

  input AdviceInput {
    description: String! ,
    token: String! ,
    isActive: Boolean,
    student: StudentInput!
  }
`;

module.exports = typeDefs;
