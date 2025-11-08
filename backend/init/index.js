import mongoose from "mongoose";
import Todo from "../model/todo.js";
import dotenv from "dotenv";
import { sampleTodos } from "./sampleData.js";

dotenv.config({ path: "../.env" });

console.log(process.env.DB_URL);

async function connectDB() {
  await mongoose.connect(process.env.DB_URL);
}

connectDB()
  .then(() => {
    console.log("Database connected");
    initSampleData();
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

const initSampleData = async () => {
  try {
    await Todo.deleteMany({});
    await Todo.insertMany(sampleTodos);
    console.log("Sample data initialized");
  } catch (error) {
    console.error("Error initializing sample data:", error);
  }
};
