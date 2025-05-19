import mongoose from "mongoose";
import { getAllTasks } from "@/graphql/resolvers/queries/getAllTasks";
import { Task } from "@/graphql/schemas/schema";

beforeAll(async () => {
  await mongoose.connect(
    process.env.MONGODB_URL || "mongodb://localhost:27017/test-db"
  );
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
  await Task.deleteMany({});
});

describe("getAllTasks", () => {
  it("should return all tasks", async () => {
    await Task.create([{ title: "Task A" }, { title: "Task B" }]);
    const result = await getAllTasks();
    const titles = result.map((task) => task.title);

    expect(result).toHaveLength(2);
    expect(titles).toEqual(expect.arrayContaining(["Task A", "Task B"]));
  });

  it("should throw an error when DB is not connected or fails", async () => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});

    jest
      .spyOn(Task, "find")
      .mockRejectedValueOnce(new Error("DB not connected"));

    await expect(getAllTasks()).rejects.toThrow("Failed to fetch tasks");

    jest.restoreAllMocks();
  });
});
