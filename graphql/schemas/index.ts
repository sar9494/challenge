import { gql } from "graphql-tag";

export const typeDefs = gql`
  type Query {
    getFinishedTasksLists: [Task!]!
    getAllTasks: [Task!]!
  }

  type Mutation {
    addTask(title: String!): Task!
    updateTask(id: String!, title: String, completed: Boolean): Task!
  }
  type Task {
    id: ID!
    title: String!
    completed: Boolean!
  }
`;
