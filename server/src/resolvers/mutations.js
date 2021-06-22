const bcrypt = require("bcryptjs");

const Mutation =  {
    signup: async (parent, args, context, info) => {

      // bcrypt the password before pushing it to the database.
      const password = await bcrypt.hash(args.password, 10);

      await context.prisma.user.create({
        data: {
          firstName: args.firstName,
          email: args.email,
          age: args.age,
          password
        },
      });

      const {user} = await context.authenticate("graphql-local", {
        email: args.email,
        password,
      })

      context.login(user);

      return user;
      // return newUser;
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
    login: async (parent, {email, password}, context, info) => {
      console.log("login one");

      const {user} = await context.authenticate("graphql-local", {
        email,
        password,
      })

      console.log("in resolver",user);
      context.login(user);

      return user;
    },
    logout: (parent, args, context, info) => {
      context.logout();
    },
    deleteUser: async (parent, args, context, info) => {
      // let user;

      // users.findIndex((elem) => {
      //     if(elem.id == args.userId){
      //         user = elem;
      //         return true;
      //     }
      //     return false; // passes test so stays in array.
      // })

      // return user;

      // first delete all the todos by this user

      await context.prisma.todo.deleteMany({
        where: {
          userId: parseInt(args.userId)
        }
      })

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
  }

  module.exports = {Mutation};