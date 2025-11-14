import express from "express";
import Todo from "./model/todo.js";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.DB_URL);
}

app.get("/api/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post("/api/todos", async (req, res) => {
  const newTodo = await Todo.create({ text: req.body.text, completed: false });
  res.status(201).json(newTodo);
});

app.patch("/api/todos/:id", async (req, res) => {
  const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!updatedTodo) {
    return res.status(404).json({ message: "Todo not found" });
  }
  res.json(updatedTodo);
});

app.delete("/api/todos/:id", async (req, res) => {
  const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
  if (!deletedTodo) {
    return res.status(404).json({ message: "Todo not found" });
  }
  res.status(204).end();
});

app.delete("/api/todos", async (req, res) => {
  await Todo.deleteMany({});
  res.status(204).end();
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
