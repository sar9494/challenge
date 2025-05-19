import { Task } from "@/graphql/schemas/schema";
import mongoose from "mongoose";

export const updateTask = async (args: {
  title?: string;
  completed?: boolean;
  id: string;
}) => {
  const { id, title, completed } = args;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid task ID");
  }

  try {
    const update: Record<string, any> = {};
    if (typeof title !== "undefined") update.title = title;
    if (typeof completed !== "undefined") update.completed = completed;

    const updatedTask = await Task.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    return updatedTask;
  } catch (error) {
    throw new Error("Failed to update task");
  }
};
