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
    isActive: Boolean

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
    isActive: Boolean
  },

  extend type Query {
    students(filter: StudentInput): [Student],
    studentByID(_id: ID!): Student
  },
  extend type Mutation {
    createStudent(input: StudentInput!): Student,
    deleteStudent(_id: ID!): Student
    activeStudent(_ids: [ID!]!, isActive: Boolean!): Int
    loginStudent(loginInput: LoginInput!): LoginResponse!
  }
`;

module.exports = typeDefs;
