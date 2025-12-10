"""
This file contains the schema for the user model.
"""

from pydantic import BaseModel
from typing import Optional

class UserBase(BaseModel):
    model_config = {"from_attributes": True}

class UserRead(UserBase):
    id: int
    name: str
    aproval_name: str|None
    email: str
    is_active: bool


class UserCreate(UserBase):
    name: str
    email: str
    password: str
    aproval_name: Optional[str] = None


class UserEdit(UserBase):
    name: Optional[str] = None
    email: Optional[str] = None
    is_active: Optional[bool] = None
    is_superuser: Optional[bool] = None
    password: Optional[str] = None
    aproval_name: Optional[str] = None


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: str

class SuperUserCreate(BaseModel):
    name: str
    email: str
    password: str
    secret_token: str