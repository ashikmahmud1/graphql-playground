const {GraphQLServer} = require('graphql-yoga');


const typeDefs = `
type Query {
    helloworld: String!
}
`;


const resolvers = {
    Query: {
        helloworld: () => 'hello world! what a day!'
    }
}
const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(() => {
    console.log("server is running at http://localhost:4000")
})