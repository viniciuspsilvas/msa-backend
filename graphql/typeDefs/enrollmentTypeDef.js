const { gql } = require('apollo-server-express');

// Construct a schema using GraphQL schema language
const typeDefs = gql`
  type Enrollment {
    _id: ID,
    student: Student,
    course: Course,
  },

  extend type Query {
    enrollments: [Enrollment]
  },
  
  extend type Mutation {
    createEnrollment(input: EnrollmentInput!): Enrollment,
    deleteEnrollment(id: String!): Enrollment
  }

  input EnrollmentInput {
    student: StudentInput!
    course: CourseInput!
  }
`;

module.exports = typeDefs;
