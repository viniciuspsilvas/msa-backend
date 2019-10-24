const User = require('../models/user');

// Provide resolver functions for the GraphQL schema
const resolvers = {
  /**
   * A GraphQL Query for users that uses a User model to query MongoDB
   * and get all User documents.
   */
  Query: {
    users: () => User.find({})
  },
  /**
   * A GraphQL Mutation that provides functionality for adding user to
   * the users list and return user after successfully adding to list
   */
  Mutation: {
    createCourse: (root, args, context, info) => {

      const  user = args.input;
      const newCourse = new User({ email: user.email, password: user.password });
      return newCourse.save();
    },

    deleteCourse: async (parent, _id) => {
      return await User.findByIdAndDelete(_id);
    },
   
  }
};

module.exports = resolvers;