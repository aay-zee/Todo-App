import express from "express";
import Todo from "./model/todo.js";
import cors from "cors";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/api/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post("/api/todos", async (req, res) => {
  const newTodo = await Todo.create({ text: req.body.text, completed: false });
  res.status(201).json(newTodo);
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
