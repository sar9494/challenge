import { Task } from "@/graphql/schemas/schema";

export const addTask = async (args?: { title: string }) => {
  if (!args || !args.title) {
    throw new Error("Title is required");
  }

  const { title } = args;

  try {
    const task = await Task.create({ title });
    return task;
  } catch (error: any) {
    if (error.code === 11000) {
      throw new Error("Duplicate title not allowed");
    }
    throw new Error("Failed to add task");
  }
};
