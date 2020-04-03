const { gql } = require('apollo-server-express');

// Construct a schema using GraphQL schema language
const typeDefs = gql`
  type Course {
    _id: ID,
    name: String,
    description: String,
    active: Boolean,

    enrollments: [Enrollment]
  },

  input CourseInput {
    _id: ID,
    name: String,
    description: String,
    active: Boolean,
  },

  extend type Query {
    courses: [Course]
  },
  extend type Mutation {
    createCourse(input: CourseInput!): Course,
    deleteCourse(_id: ID!): Course
    updateCourse(input: CourseInput!): Course
  }
`;

module.exports = typeDefs;
