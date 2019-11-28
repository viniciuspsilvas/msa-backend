global.base_dir = __dirname;
global.abs_path = function(path) {
  return base_dir + path;
}
global.include = function(file) {
  return require(abs_path('/' + file));
}

const mongoose = require('mongoose');
const { ApolloServer, AuthenticationError } = require('apollo-server');
const jwt = require('jsonwebtoken');

const typeDefs = require('./graphql/typeDefs/');
const resolvers = require('./graphql/resolvers/');


const { SECRET_TOKEN, MONGO_USER, MONGO_PASSWORD, MONGO_DB, SERVER_URL, SERVER_PORT } = process.env;

// Create Apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,

  context: ({ req }) => {

    try {
      token = jwt.verify(req.headers.authorization.replace('Bearer ', ''), SECRET_TOKEN);
    } catch (e) {
      token = null;
    }

    // add the user to the context
    return { token };
  },
});

const DB_URI =
  `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0-g4zvp.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`;

mongoose.set('useFindAndModify', false);
mongoose.connect(DB_URI, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {

    server.listen({
      host: SERVER_URL,
      port: SERVER_PORT,
      exclusive: true
    }).then(({ url }) => {
      console.log(`🚀 Running a GraphQL API server at ${url}graphql`);
    });

  })
  .catch(err => {
    console.log(err)
  })

