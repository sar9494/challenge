import { Schema, model, models } from "mongoose";

const taskSchema = new Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

// Check if the model already exists before defining it
export const Task = models.Task || model("Task", taskSchema);
