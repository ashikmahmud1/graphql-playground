const {GraphQLServer} = require('graphql-yoga');


const typeDefs = `
type Query {
    helloworld: String!,
    users: [User!]!
}

type User {
    id: ID!
    firstName: String!
    email: String!
}
`;

let users = [
    {
        id:"123",
        firstName: "Cindy",
        email: "cindy@cindy.com"
    },
    {
        id:"456",
        firstName: "Todd",
        email: "todd@todd.com"
    },
]

const resolvers = {
    Query: {
        helloworld: () => 'hello world! what a day!',
        users: (parent, args, context, info) => {
            return users;
        }
    }
}
const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(() => {
    console.log("server is running at http://localhost:4000")
})