var express = require('express');
const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server-express');

const typeDefs = require('./graphql/typeDefs/');
const resolvers = require('./graphql/resolvers/');

// Create Apollo server
const server = new ApolloServer({ typeDefs, resolvers });
var app = express();

// Use Express app as middleware in Apollo Server instance
server.applyMiddleware({ app });

const DB_URI =
  `mongodb+srv://${
  process.env.MONGO_USER}:${
  process.env.MONGO_PASSWORD
  }@cluster0-g4zvp.mongodb.net/${
  process.env.MONGO_DB
  }?retryWrites=true&w=majority`;


mongoose.set('useFindAndModify', false);
mongoose.connect(DB_URI, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    app.listen(process.env.SERVER_PORT);
    console.log(`🚀 Running a GraphQL API server at ${process.env.SERVER_URL}:${process.env.SERVER_PORT}/graphql`);
  })
  .catch(err => {
    console.log(err)
  })

