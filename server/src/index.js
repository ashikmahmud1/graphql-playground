// const {GraphQLServer} = require('graphql-yoga');
const { ApolloServer } = require("apollo-server-express");
const { resolvers } = require("./resolvers");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const typeDefs = require("./typedefs");

const express = require("express");

const passport = require("passport");
const bcrypt = require("bcryptjs");
const { GraphQLLocalStrategy, buildContext } = require("graphql-passport");
const session = require("express-session");
const {v4: uuid4} = require("uuid");
const SESSION_SECRET = "1234567utyhgdfs";

const PORT = 4000;

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
    const user = prisma.user.findUnique({
        where: {
            id
        }
    });
    done(null, user);
})
passport.use(
  new GraphQLLocalStrategy(async (email, password, done) => {
    console.log("login two");
    const matchingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    let error = matchingUser ? "" : new Error("User not found!");

    if (matchingUser) {
      const valid = bcrypt.compare(password, matchingUser.password);
      error = valid ? "" : new Error("Invalid password");
    }
    console.log("login three");
    done(error, matchingUser);
  })
);

const app = express();

app.use(session({
    genid: (req) => uuid4(),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

const corsOptions = { credentials: true, origin: "http://localhost:3000" };

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => {
    return buildContext({ req, prisma }); // this is for authentication
  },
});

const path = "/graphql";
server.applyMiddleware({ app, path, cors: corsOptions });

app.listen({ port: PORT }, () => {
  console.log(`server is running at http://localhost:${PORT}`);
});
