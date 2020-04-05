const { gql } = require('apollo-server-express');

// Construct a schema using GraphQL schema language
const typeDefs = gql`

  scalar DateTime

  type Message {
    _id: ID,

    title: String,
    body: String,
    createdAt: DateTime,
    sentAt: DateTime,
    scheduledFor: DateTime,
    isRead: Boolean,
    isDownloaded: Boolean,
    isArchived: Boolean,

    student: Student,
  },

  extend type Query {
    messages: [Message]
    messagesSentByStudent(student: StudentInput!): [Message]
  },
  
  extend type Mutation {
    
    setMessageAsRead(_id: ID!): Message,
    deleteMessage(_id: ID!): Message,
    deleteMessages(_ids: [ID!]): Int,
    sendMessageBatch(message: MessageInput!): [Message]
  }

  input MessageInput {
    title: String,
    body: String,
    scheduledFor: DateTime,
    students: [StudentInput!]!
  }
`;

module.exports = typeDefs;
