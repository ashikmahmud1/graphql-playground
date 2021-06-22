const Query = {
    helloworld: () => "hello world! what a day!",
    users: (parent, args, context, info) => {
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
    me: (parent, args, context, info) => {
      if(context.getUser){
        return context.getUser()
      }
    },
  }

  module.exports = {Query};