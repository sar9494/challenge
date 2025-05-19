import mongoose from "mongoose";
import { Task } from "@/graphql/schemas/schema";
import { updateTask } from "@/graphql/resolvers/mutations/updateTask";

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URL as string);
  await Task.deleteMany({});
});

afterAll(async () => {
  await Task.deleteMany({});
  await mongoose.disconnect();
});

beforeEach(async () => {
  await Task.deleteMany({});
});

describe("updateTask", () => {
  it("should update an existing task's title and completed status", async () => {
    const createdTask = await Task.create({
      title: "Old Task",
      completed: false,
    });

    const updated = await updateTask({
      id: createdTask._id.toString(),
      title: "Updated Task",
      completed: true,
    });

    expect(updated).not.toBeNull();
    expect(updated?.title).toBe("Updated Task");
    expect(updated?.completed).toBe(true);
  });
  it("should throw 'Failed to update task' when database operation fails", async () => {
    const validId = new mongoose.Types.ObjectId().toHexString(); // generates valid ObjectId

    jest
      .spyOn(Task, "findByIdAndUpdate")
      .mockRejectedValueOnce(new Error("DB error"));

    await expect(
      updateTask({ id: validId, title: "New title" })
    ).rejects.toThrow("Failed to update task");

    jest.restoreAllMocks();
  });
  it("should return null for non-existing task ID", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();

    const updated = await updateTask({
      id: fakeId,
      title: "Won't Work",
    });

    expect(updated).toBeNull();
  });

  it("should throw an error for invalid ID", async () => {
    await expect(
      updateTask({
        id: "not-a-valid-id",
        title: "Invalid",
      })
    ).rejects.toThrow("Invalid task ID");
  });
  it("should return the original task when no update fields are provided", async () => {
    const task = await Task.create({
      title: "No Update Task",
      completed: false,
    });

    const updated = await updateTask({
      id: task._id.toString(),
    });

    expect(updated).not.toBeNull();
    expect(updated?.title).toBe("No Update Task");
    expect(updated?.completed).toBe(false);
  });
});
