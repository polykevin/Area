from fastapi import FastAPI, HTTPException
from models import Todo

app = FastAPI()

todos: list[Todo] = [
    Todo(id=1, title="How to cook", author="Kevin Poly", data="Cooking is fun"),
    Todo(id=2, title="Jesus is King", author="Kanye West", data="Tracklist..."),
]

@app.get("/todos")
def get_todos():
    return todos

@app.get("/todos/{id}")
def get_todo(id: int):
    for todo in todos:
        if todo.id == id:
            return todo
    raise HTTPException(status_code=404, detail="Todo not found")

@app.post("/todos")
def create_todo(todo: Todo):
    todo.id = len(todos) + 1
    todos.append(todo)
    return todo

@app.put("/todos/{id}")
def update_todo(id: int, updated: Todo):
    for i, todo in enumerate(todos):
        if todo.id == id:
            updated.id = id
            todos[i] = updated
            return updated
    raise HTTPException(status_code=404, detail="Todo not found")

@app.delete("/todos/{id}")
def delete_todo(id: int):
    for i, todo in enumerate(todos):
        if todo.id == id:
            todos.pop(i)
            return {"status": "deleted"}
    raise HTTPException(status_code=404, detail="Todo not found")
