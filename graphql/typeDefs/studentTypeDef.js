const { gql } = require('apollo-server-express');

// Construct a schema using GraphQL schema language
const typeDefs = gql`
  type Student {
    _id: ID,
    email: String,
    firstname: String,
    lastname: String,
    fullname: String,
    phone: String,
    username: String,
    device: Device,

    enrollments: [Enrollment]
    advices: [Advice]
    messages: [Message]

  },

  type LoginResponse {
    token: String
    student: Student
  }

  input LoginInput {
    username: String!
    password: String!
    tokenDevice: String!
    nameDevice: String!
  }

  input StudentInput {
    _id: ID,
    email: String,
    firstname: String,
    lastname: String,
    phone: String,
    username: String,
  },

  extend type Query {
    students: [Student],
    studentByID(_id: ID!): Student
  },
  extend type Mutation {
    createStudent(input: StudentInput!): Student,
    deleteStudent(_id: ID!): Student
    updateStudentName(_id: ID!, name: String!): Student
    loginStudent(loginInput: LoginInput!): LoginResponse!
  }
`;

module.exports = typeDefs;
