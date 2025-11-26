from fastapi import FastAPI
from models import User, Area
import handlers

app = FastAPI(title="AREA Python PoC")

@app.post("/users")
def create_user(user: User):
    return handlers.create_user(user)

@app.get("/users")
def get_users():
    return handlers.get_users()

@app.get("/users/{user_id}")
def get_user(user_id: int):
    return handlers.get_user(user_id)

@app.put("/users/{user_id}")
def update_user(user_id: int, user: User):
    return handlers.update_user(user_id, user)

@app.delete("/users/{user_id}")
def delete_user(user_id: int):
    return handlers.delete_user(user_id)

@app.post("/areas")
def create_area(area: Area):
    return handlers.create_area(area)

@app.get("/areas")
def get_areas():
    return handlers.get_areas()

@app.get("/areas/{area_id}")
def get_area(area_id: int):
    return handlers.get_area(area_id)

@app.put("/areas/{area_id}")
def update_area(area_id: int, area: Area):
    return handlers.update_area(area_id, area)

@app.delete("/areas/{area_id}")
def delete_area(area_id: int):
    return handlers.delete_area(area_id)

@app.get("/")
def root():
    return {"message": "AREA PoC Python running"}
