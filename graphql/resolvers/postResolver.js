const Post = require('../models/post');

// Provide resolver functions for the GraphQL schema
const resolvers = {
  /**
   * A GraphQL Query for posts that uses a Post model to query MongoDB
   * and get all Post documents.
   */
  Query: {
    posts: () => Post.find({})
  },
  /**
   * A GraphQL Mutation that provides functionality for adding post to
   * the posts list and return post after successfully adding to list
   */
  Mutation: {
    createPost: (parent, post) => {
      const newPost = new Post({ title: post.title, content: post.content });
      return newPost.save();
    },

    deletePost: async (parent, _id) => {
      return await Post.findByIdAndDelete(_id);
    },

    updatePostTitle: async (parent, { _id, title }) => {
      return await Post.findOneAndUpdate(_id, { title: title }, { new: true });
    }
  }
};

module.exports = resolvers;