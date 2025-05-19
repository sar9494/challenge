import { getFinishedTasksLists } from "./queries/getFinishedTasksLists";
import { getAllTasks } from "./queries/getAllTasks";
import { addTask } from "./mutations/addTask";
import { updateTask } from "./mutations/updateTask";

export const resolvers = {
  Query: {
    getAllTasks,
    getFinishedTasksLists,
  },
  Mutation: {
    addTask,
    updateTask,
  },
};
