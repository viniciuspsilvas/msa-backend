const { gql } = require('apollo-server-express');

// Construct a schema using GraphQL schema language
const typeDefs = gql`
  type Student {
    _id: ID,
    name: String,
    email: String,
    firstname: String,
    lastname: String,
    fullname: String,
    phone: String,
    username: String,
    password: String,

    enrollments: [Enrollment]
    advices: [Advice]
    messages: [Message]

  },

  input StudentInput {
    _id: ID,
    name: String,
    email: String,
    firstname: String,
    lastname: String,
    fullname: String,
    phone: String,
    username: String,
    password: String,
  },

  extend type Query {
    students: [Student]
  },
  extend type Mutation {
    createStudent(input: StudentInput!): Student,
    deleteStudent(_id: ID!): Student
    updateStudentName(_id: ID!, name: String!): Student
  }
`;

module.exports = typeDefs;
