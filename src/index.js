const {GraphQLServer} = require('graphql-yoga');


const typeDefs = `
type Query {
    helloworld: String!,
    users(text: String): [User!]!
    user(userId: ID!): User
}

type Mutation {
    createUser(firstName: String!, email: String!, age: Int): User!
}

type User {
    id: ID!
    firstName: String!
    email: String!
    age: Int
}
`;

function createUserId() {
    let id = 0;
    function incrementId(){
        id++;
        return id;
    }
    return incrementId;
}

const newUserId = createUserId();

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
            if(args.text){
                return users.filter((elem) => elem.firstName.toLowerCase().includes(args.text.toLowerCase()));
            }
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
    Mutation: {
        createUser: (parent, args, context, info) => {
            const newUser = {
                id: newUserId(),
                firstName: args.firstName,
                email: args.email,
                age: args.age
            }
            const userAlreadyExist = users.some((elem) => {
                return elem.email == args.email
            })
            if(userAlreadyExist){
                throw new Error("User already exists")
            } else{
                users.push(newUser);
                return newUser;
            }
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