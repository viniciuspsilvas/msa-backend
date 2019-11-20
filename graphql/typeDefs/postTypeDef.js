const { gql } = require('apollo-server-express');

// Construct a schema using GraphQL schema language
const typeDefs = gql`
  type Post {
    _id: ID,
    title: String,
    content: String,
  },
  extend type Query {
    posts: [Post]
  },

  extend type Mutation {
    createPost(title: String!, content: String!): Post,
    deletePost(_id: ID!): Post
    updatePostTitle(_id: ID!, title: String!): Post
  }
`;

module.exports = typeDefs;