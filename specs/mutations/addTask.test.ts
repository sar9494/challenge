import mongoose from "mongoose";
import { Task } from "@/graphql/schemas/schema";
import { addTask } from "@/graphql/resolvers/mutations/addTask";

beforeAll(async () => {
  await mongoose.connect(
    process.env.MONGODB_URL || "mongodb://localhost:27017/test-db"
  );
  await Task.deleteMany({});
});

afterAll(async () => {
  await Task.deleteMany({});
  await mongoose.disconnect();
});

beforeEach(async () => {
  await Task.deleteMany({});
});

describe("addTask", () => {
  it("should throw title required error", async () => {
    expect(addTask()).rejects.toThrowError("Title is required");
  });
  it("should throw failed error", async () => {
    jest
      .spyOn(Task, "create")
      .mockRejectedValueOnce(new Error("Something went wrong"));

    await expect(addTask({ title: "goog" })).rejects.toThrow(
      "Failed to add task"
    );

    jest.restoreAllMocks();
  });
  it("should throw error for duplicate title", async () => {
    const title = "Tasktest";

    const firstTask = await addTask({ title });
    await firstTask.save();

    expect(firstTask.title).toBe(title);

    await expect(addTask({ title })).rejects.toThrow(
      "Duplicate title not allowed"
    );
  });

  it("should successfully add a new task", async () => {
    const title = "New Unique Task";
    const result = await addTask({ title });
    expect(result).toHaveProperty("title", title);
    expect(result).toHaveProperty("completed", false);
  });
});
