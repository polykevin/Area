import { Request, Response } from "express";
import { Todo } from "../models/todo.model";

let todos: Todo[] = [
  { id: 1, title: "How to cook", author: "Kevin Poly", data: "Cooking is fun"},
  { id: 2, title: "Jesus is King", author: "Kanye West", data: "Tracklist..." },
];

export const getTodos = (_: Request, res: Response) => {
  res.json(todos);
};

export const getTodo = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const todo = todos.find(t => t.id === id);

  if (!todo) return res.status(404).json({ error: "Todo not found" });
  res.json(todo);
};

export const createTodo = (req: Request, res: Response) => {
  const { title, author, data } = req.body;
  const newTodo: Todo = {
    id: Date.now(),
    title,
    author,
    data
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
};

export const updateTodo = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const todo = todos.find(t => t.id === id);

  if (!todo) return res.status(404).json({ error: "Not found" });

  todo.title = req.body.title ?? todo.title;
  todo.author = req.body.author ?? todo.author;
  todo.data = req.body.data ?? todo.data;

  res.json(todo);
};

export const deleteTodo = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  todos = todos.filter(t => t.id !== id);
  res.status(204).send();
};
