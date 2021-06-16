const {GraphQLServer} = require('graphql-yoga');


const typeDefs = `
type Query {
    helloworld: String!,
    users: [User!]!
    user(userId: ID!): User
}

type User {
    id: ID!
    firstName: String!
    email: String!
    age: Int!
}
`;

let users = [
    {
        id:"123",
        firstName: "Cindy",
        email: "cindy@cindy.com",
        age: 27
    },
    {
        id:"456",
        firstName: "Todd",
        email: "todd@todd.com",
        age: 31
    },
]

const resolvers = {
    Query: {
        helloworld: () => 'hello world! what a day!',
        users: (parent, args, context, info) => {
            return users;
        },
        user: (parent, args, context, info) => {
            console.log(args);
            return users.find((user) => {
                if(user.id == args.userId){
                    return user;
                }
            })
        }
    },
    User: {
        id: (parent) => parent.id,
        firstName: (parent) => {
            console.log('what is the parent: ', parent)
            return parent.firstName;
        },
        email: (parent) => parent.email,
        age: (parent) => {
            console.log("age is: ", parent.age);
            // generate random number between 1-4
            const randomNum = Math.floor(Math.random() * 4) + 1;
            // multiply random number with the age
            // finally return the age
            return parent.age * randomNum;
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