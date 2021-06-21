// const {GraphQLServer} = require('graphql-yoga');
const { ApolloServer } = require("apollo-server-express");
const { resolvers } = require("./resolvers");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const typeDefs = require("./typedefs");

const express = require("express");

const PORT = 4000;

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    prisma,
  },
});

const path = "/graphql";
server.applyMiddleware({ app, path });

app.listen({ port: PORT }, () => {
  console.log(`server is running at http://localhost:${PORT}`);
});
