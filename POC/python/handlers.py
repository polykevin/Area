from fastapi import HTTPException
from models import User, Area

users_db = []
areas_db = []

def create_user(user: User):
    users_db.append(user)
    return user

def get_users():
    return users_db

def get_user(user_id: int):
    for u in users_db:
        if u.id == user_id:
            return u
    raise HTTPException(status_code=404, detail="User not found")

def update_user(user_id: int, user: User):
    for i, u in enumerate(users_db):
        if u.id == user_id:
            users_db[i] = user
            return user
    raise HTTPException(status_code=404, detail="User not found")

def delete_user(user_id: int):
    for i, u in enumerate(users_db):
        if u.id == user_id:
            del users_db[i]
            return {"message": "User deleted"}
    raise HTTPException(status_code=404, detail="User not found")

def create_area(area: Area):
    areas_db.append(area)
    return area

def get_areas():
    return areas_db

def get_area(area_id: int):
    for a in areas_db:
        if a.id == area_id:
            return a
    raise HTTPException(status_code=404, detail="Area not found")

def update_area(area_id: int, area: Area):
    for i, a in enumerate(areas_db):
        if a.id == area_id:
            areas_db[i] = area
            return area
    raise HTTPException(status_code=404, detail="Area not found")

def delete_area(area_id: int):
    for i, a in enumerate(areas_db):
        if a.id == area_id:
            del areas_db[i]
            return {"message": "Area deleted"}
    raise HTTPException(status_code=404, detail="Area not found")
