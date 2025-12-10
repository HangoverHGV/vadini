from pydantic import BaseModel, Field
from typing import List
from datetime import datetime


class ProductTranslationRead(BaseModel):
    language: str
    title: str
    description: str

    class Config:
        orm_mode = True

class ProductFeatureRead(BaseModel):
    feature_name: str
    feature_value: str

    class Config:
        orm_mode = True

class ProductImageRead(BaseModel):
    image_url: str

    class Config:
        orm_mode = True


class ProductRead(BaseModel):
    id: int 
    translations: List[ProductTranslationRead]
    features: List[ProductFeatureRead]
    images: List[ProductImageRead]
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
    translation: ProductTranslationCreate
    features: List[ProductFeatureCreate] = Field(..., min_length=1)

    class Config:
        orm_mode = True
