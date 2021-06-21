const { gql } =  require('apollo-server-express');

module.exports = gql `type Query {
    helloworld: String!,
    users(text: String): [User!]!
    user(userId: ID!): User
    todos: [Todo!]!
    me: User
}

type Mutation {
    signup(firstName: String!, email: String!,password: String!, age: Int): User!
    login(email: String!, password: String!): User
    deleteUser(userId: ID!): User
    updateUser(userId: ID!,input: UserInput): User
    createTodo(name: String!, isComplete:Boolean!,userId: Int!): Todo!
    updateTodo(todoId:ID!, name: String, isComplete:Boolean): Todo
    resetTodos(todoIds: [ID!]!): BatchPayload!
    deleteTodo(todoId: ID!): Todo
    deleteTodos(todoIds: [ID!]!): BatchPayload!
}


type BatchPayload{
    count: Int!
}
input UserInput {
    firstName: String
    email: String
    age: Int
}

type User {
    id: ID!
    firstName: String!
    email: String!
    age: Int
    todos: [Todo!]!
}

type Todo {
    id: ID!
    name: String!
    isComplete: Boolean!
    user: User!
    userId: Int!
}`