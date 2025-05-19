import { Task } from "@/graphql/schemas/schema";

export const getFinishedTasksLists = async () => {
  try {
    const finishedTasks = await Task.find({ completed: true });
    return finishedTasks;
  } catch (error) {
    throw new Error("Failed to fetch completed tasks: " + error);
  }
};
