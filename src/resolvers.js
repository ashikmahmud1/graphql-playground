const { createUserId } = require("./utils");

const newUserId = createUserId();

const { users } = require("./data/users");

const { todos } = require("./data/todos");

const resolvers = {
  Query: {
    helloworld: () => "hello world! what a day!",
    users: (parent, args, context, info) => {
      console.log(context);
      // if(args.text){
      //     return users.filter((elem) => elem.firstName.toLowerCase().includes(args.text.toLowerCase()));
      // }
      // return users;

      return context.prisma.user.findMany();
    },
    user: (parent, args, context, info) => {
      return context.prisma.user.findUnique({
        where: {
          id: parseInt(args.userId)
        }
      });
    },
    todos: (parent, args, context, info) => {
      return context.prisma.todo.findMany();
    },
  },
  Mutation: {
    createUser: (parent, args, context, info) => {
      const newUser = context.prisma.user.create({
        data: {
          firstName: args.firstName,
          email: args.email,
          age: args.age,
        },
      });

      return newUser;
      // const newUser = {
      //     id: newUserId(),
      //     firstName: args.firstName,
      //     email: args.email,
      //     age: args.age
      // }
      // const userAlreadyExist = users.some((elem) => {
      //     return elem.email == args.email
      // })
      // if(userAlreadyExist){
      //     throw new Error("User already exists")
      // } else{
      //     users.push(newUser);
      //     return newUser;
      // }
    },
    deleteUser: (parent, args, context, info) => {
      // let user;

      // users.findIndex((elem) => {
      //     if(elem.id == args.userId){
      //         user = elem;
      //         return true;
      //     }
      //     return false; // passes test so stays in array.
      // })

      // return user;

      return context.prisma.user.delete({
        where: {
          id: parseInt(args.userId),
        },
      });
    },
    updateUser: (parent, args, context, info) => {
      // const user = users.find((elem) => {
      //     if(elem.id == args.userId){
      //         elem.firstName = args.firstName ? args.firstName : elem.firstName;
      //         elem.email = args.email ? args.email : elem.email;
      //         elem.age = args.age ? args.age : elem.age;
      //         return elem;
      //     }
      // })
      // const userIndex = users.findIndex((elem) =>  elem.id == args.userId);
      // users[userIndex] = {...users[userIndex],...args.input}
      // return users[userIndex];

      return context.prisma.user.update({
        where: {
          id: parseInt(args.userId),
        },
        data: {
          firstName: args.input.firstName,
          email: args.input.email,
          age: args.input.age,
        },
      });
    },
    createTodo: (parent, args, context, info) => {
      return context.prisma.todo.create({
        data: {
          name: args.name,
          isComplete: args.isComplete,
          user: {connect: {id: parseInt(args.userId)}},
        },
      });
    },
    updateTodo: (parent, args, context, info) => {
      return context.prisma.todo.update({
        where: {
          id: parseInt(args.todoId),
        },
        data: {
          name: args.name,
          isComplete: args.isComplete,
        },
      });
    },
    resetTodos: (parent, args, context, info) => {
      let todosToReset = args.todoIds.map((id) => {
        return parseInt(id);
      });
      return context.prisma.todo.updateMany({
        where: {
          id: {
            in: todosToReset,
          },
        },
        data: {
          isComplete: false,
        },
      });
    },
    deleteTodo: (parent, args, context, info) => {
      return context.prisma.todo.delete({
        where: {
          id: parseInt(args.todoId),
        },
      });
    },
    deleteTodos: (parent, args, context, info) => {
      let newIds = args.todoIds.map((id) => {
        return parseInt(id);
      });
      return context.prisma.todo.deleteMany({
        where: {
          id: {
            in: newIds,
          },
        },
      });
    },
  },
  User: {
    id: (parent) => parent.id,
    firstName: (parent) => {
      console.log("what is the parent: ", parent);
      return parent.firstName;
    },
    email: (parent) => parent.email,
    age: (parent) => {
      console.log("age is: ", parent.age);
      // generate random number between 1-4
      //   const randomNum = Math.floor(Math.random() * 4) + 1;
      // multiply random number with the age
      // finally return the age
      return parent.age;
    },
    todos: (parent, args,context, info) => {
      return context.prisma.todo.findMany({
        where: {
          userId: parent.id
        }
      });
    },
  },
  Todo: {
    user: (parent, args, context, info) => {
      return context.prisma.user.findUnique({
        where: {
          id: parseInt(parent.userId)
        }
      })
    }
  },
};

module.exports = {
  resolvers,
};
