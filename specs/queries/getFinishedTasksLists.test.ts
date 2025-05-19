import mongoose from "mongoose";
import { Task } from "@/graphql/schemas/schema";
import { getFinishedTasksLists } from "@/graphql/resolvers/queries/getFinishedTasksLists";

// Set up and clean DB for working DB tests
beforeAll(async () => {
  await mongoose.connect(
    process.env.MONGODB_URL || "mongodb://localhost:27017/test-db"
  );
});

afterAll(async () => {
  await mongoose.disconnect();
});

beforeEach(async () => {
  await Task.deleteMany({});
});

afterEach(async () => {
  await Task.deleteMany({});
});

describe("getFinishedTasksLists - with connected DB", () => {
  it("should return only completed tasks", async () => {
    await Task.insertMany([
      { title: "Task 1", completed: true },
      { title: "Task 2", completed: false },
      { title: "Task 3", completed: true },
    ]);

    const finishedTasks = (await getFinishedTasksLists()) as {
      id: string;
      title: string;
      completed: boolean;
    }[];

    expect(finishedTasks).toHaveLength(2);
    expect(finishedTasks.every((task) => task.completed)).toBe(true);

    const titles = finishedTasks.map((task) => task.title);
    expect(titles).toContain("Task 1");
    expect(titles).toContain("Task 3");
  });
});

// Separate block for simulating disconnected DB
describe("getFinishedTasksLists - when DB fails", () => {
  it("should throw an error when DB is not connected or fails", async () => {
    // Mock Task.find to simulate DB failure
    jest
      .spyOn(Task, "find")
      .mockRejectedValueOnce(new Error("DB not connected"));

    await expect(getFinishedTasksLists()).rejects.toThrow(
      "Failed to fetch completed tasks"
    );

    // Restore original behavior
    jest.restoreAllMocks();
  });
});
