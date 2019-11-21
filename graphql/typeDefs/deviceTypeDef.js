const { gql } = require('apollo-server-express');

// Construct a schema using GraphQL schema language
const typeDefs = gql`
  type Device {
    _id: ID,
    description: String,
    token: String,
    isActive: Boolean,
    student: Student,
  },

  extend type Query {
    devices: [Device]
  },
  
  extend type Mutation {
    createDevice(input: DeviceInput!): Device,
    deleteDevice(id: String!): Device
  }

  input DeviceInput {
    description: String! ,
    token: String! ,
    isActive: Boolean,
    student: StudentInput!
  }
`;

module.exports = typeDefs;
