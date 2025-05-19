import { Task } from "@/graphql/schemas/schema";

export const getAllTasks = async () => {
  try {
    const allTasks = await Task.find({});
    return allTasks;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch tasks: " + error);
  }
};
