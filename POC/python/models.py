from pydantic import BaseModel
from typing import Optional

class User(BaseModel):
    id: int
    email: str
    password: str

class Area(BaseModel):
    id: int
    name: str
    action: str
    reaction: str
    enabled: bool = True
