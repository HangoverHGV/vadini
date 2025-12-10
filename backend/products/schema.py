from pydantic import BaseModel
from typing import Optional, List
from pydantic import BaseModel, Field
from typing import List
from datetime import datetime


class ProductRead(BaseModel):
    id: int 
    translations: List[dict]
    features: List[dict]
    images: List[dict]
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class ProductTranslationCreate(BaseModel):
    language: str
    title: str
    description: str


class ProductFeatureCreate(BaseModel):
    feature_name: str
    feature_value: str


class ProductCreate(BaseModel):
    translation: dict
    features: dict
    images: 
    translation: ProductTranslationCreate
    features: List[ProductFeatureCreate] = Field(..., min_length=1)

    class Config:
        orm_mode = True
