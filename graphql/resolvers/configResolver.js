var pjson = require('../../package.json');

// Provide resolver functions for the GraphQL schema
const resolvers = {
  /**
   * A GraphQL Query for courses that uses a Course model to query MongoDB
   * and get all Course documents.
   */
  Query: {
    version: () => pjson.version
  },
};

module.exports = resolvers;