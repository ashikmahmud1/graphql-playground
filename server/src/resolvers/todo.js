const Todo =  {
    user: (parent, args, context, info) => {
      return context.prisma.user.findUnique({
        where: {
          id: parseInt(parent.userId)
        }
      })
    }
  }

  module.exports = {Todo};