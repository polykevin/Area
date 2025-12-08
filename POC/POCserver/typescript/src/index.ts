import express from "express";
import todoRoutes from "./routes/todo.routes";

const app = express();
app.use(express.json());

app.use("/todos", todoRoutes);

app.get("/", (_req, res) => {
  res.send("API is running!");
});

const PORT = 9090;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
