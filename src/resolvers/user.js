const User =  {
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
  }

  module.exports = {User};