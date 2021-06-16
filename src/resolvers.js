const {createUserId} = require("./utils");

const newUserId = createUserId();

const {users} = require("./usersData");

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
        },
        deleteUser: (parent, args, context, info) => {
            let user;

            users.findIndex((elem) => {
                if(elem.id == args.userId){
                    user = elem;
                    return true;
                }
                return false; // passes test so stays in array.
            })

            return user;
        },
        updateUser: (parent, args, context, info) => {
            const user = users.find((elem) => {
                if(elem.id == args.userId){
                    elem.firstName = args.firstName ? args.firstName : elem.firstName;
                    elem.email = args.email ? args.email : elem.email;
                    elem.age = args.age ? args.age : elem.age;
                    return elem;
                }
            })
            return user;
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

module.exports = {
    resolvers,
}