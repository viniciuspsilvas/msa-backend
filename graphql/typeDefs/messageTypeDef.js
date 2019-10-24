const { gql } = require('apollo-server-express');

// Construct a schema using GraphQL schema language
const typeDefs = gql`
  type Message {
    _id: ID,

    title: String,
    body: String,
    createdAt: String,
    sentAt: String,
    scheduledFor: String,
    isRead: Boolean,
    isDownloaded: Boolean,
    isArchived: Boolean,

    student: Student,
  },

  extend type Query {
    messages: [Message]
  },
  
  extend type Mutation {
    
    deleteMessage(id: String!): Message,
    sendMessageBatch(input: MessageInput!): Message
  }

  input MessageInput {
    title: String,
    body: String,
    scheduledFor: String,

    students: [StudentInput!]!
  }
`;

module.exports = typeDefs;
