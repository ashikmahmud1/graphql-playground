const {GraphQLServer} = require('graphql-yoga');
const {resolvers} = require("./resolvers");


const server = new GraphQLServer({
    typeDefs:"./src/schema.graphql",
    resolvers
})

server.start(() => {
    console.log("server is running at http://localhost:4000")
})