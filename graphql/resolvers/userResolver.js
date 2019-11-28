const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { requiresLogin } = include('server/security/authorizer'); 

const SALT_HASH = 4;

// Provide resolver functions for the GraphQL schema
const resolvers = {
  /**
   * A GraphQL Query for users that uses a User model to query MongoDB
   * and get all User documents.
   */
  Query: {
    users: requiresLogin((parent, args, context) => {
      // In this case, we'll pretend there is no data when
      // we're not logged in. Another option would be to
      // throw an error.
      /*   if (!context.token) return null; */

      return User.find({})
    }),

    /*********************************/
    /** loginUser implementation  */
    /*********************************/
    loginUser: async (parent, { loginUserInput }, context) => {

      const { username, password } = loginUserInput;
      const user = await User.findOne({ username });

      if (!user) throw new Error('Incorrect username or password.');
      const isMatch = bcryptjs.compareSync(password, user.password);
      if (!isMatch) throw new Error('Incorrect username or password.');

      const { SECRET_TOKEN, TOKEN_EXPIRES_IN } = process.env;
      const token = jwt.sign({ user }, SECRET_TOKEN, { expiresIn: TOKEN_EXPIRES_IN })

      user.password = "";
      return { token, user }
    }
  },
  /**
   * A GraphQL Mutation that provides functionality for adding user to
   * the users list and return user after successfully adding to list
   */
  Mutation: {
    createUser: requiresLogin(async (root, { userInput }, context, info) => {

      const { username, password } = userInput;
      const isActive = true;
      const isAdmin = false;

      const user = await new User({ username, password: bcryptjs.hashSync(password, SALT_HASH), isActive, isAdmin }).save();
      user.password = "";

      return user;
    }),

    deleteUser: requiresLogin(async (parent, _id) => {
      return await User.findByIdAndDelete(_id);
    }),

    toggleActiveUser: requiresLogin(async (root, { _id, isActive }, context, info) => {
      return await User.findByIdAndUpdate(_id, { isActive }, { new: true });
    }),

    toggleAdminUser: requiresLogin(async (root, { _id, isAdmin }, context, info) => {
      return await User.findByIdAndUpdate(_id, { isAdmin }, { new: true });
    }),

  }
};

module.exports = resolvers;