from fastapi import APIRouter, Depends, HTTPException, status, Request, Form, UploadFile, File, Query
from user.models import User, Product, ProductFeatures, ProductImages, ProductTranslation, TimestampMixin
from user.dependencies import get_current_user, authenticate_user, create_access_token
from configs import get_db, SessionLocal
from typing import Optional, List
from helpers import active_user_required, superuser_required, process_and_save_image
import json
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import contains_eager, subqueryload
from schema import ProductCreate, ProductRead


router = APIRouter()


@router.get('/', tags=['products'], status_code=status.HTTP_200_OK, response_model=List[ProductRead])
@active_user_required
async def get_products(
    request: Request,
    current_user: User = Depends(get_current_user), 
    db: SessionLocal = Depends(get_db), 
    language: Optional[str] = Query(None, description="Filter products by a specific language code (e.g., 'en')")
):
    """
    Retrieve a list of products.
    - If 'language' is provided, only the translation for that language will be returned with each product.
    - If no 'language' is provided, all translations for each product will be returned.
    """
    query = db.query(Product).options(
        subqueryload(Product.features),
        subqueryload(Product.images)
    )

    if language:
        # Join with translations, filter by language, and use contains_eager
        # to load only the filtered translation into the 'translations' relationship.
        query = query.join(Product.translations).filter(ProductTranslation.language == language).options(contains_eager(Product.translations))
    else:
        # If no language is specified, load all translations efficiently.
        query = query.options(subqueryload(Product.translations))

    return query.all()

@router.post('/', tags=['products'], status_code=status.HTTP_201_CREATED, response_model=ProductRead)
@superuser_required
async def create_product(
    product_data: str = Form(...),
    images: Optional[List[UploadFile]] = File(None),
    current_user: User = Depends(get_current_user),
    db: SessionLocal = Depends(get_db)
):
    """
    Create a new product with one translation, multiple features, and optional images.
    - `product_data` should be a JSON string conforming to `ProductCreate` schema.
    """
    try:
        product_schema = ProductCreate.parse_raw(product_data)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=f"Invalid product data format: {e}")

    new_product = Product()
    new_product.translations.append(ProductTranslation(**product_schema.translation.dict()))
    for feature in product_schema.features:
        new_product.features.append(ProductFeatures(**feature.dict()))

    if images:
        for image_file in images:
            if image_file.content_type not in ["image/jpeg", "image/png", "image/webp"]:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid image format. Only JPG, PNG, and WebP are allowed.")
            image_path = await process_and_save_image(image_file)
            new_product.images.append(ProductImages(image_url=image_path))

    try:
        db.add(new_product)
        db.commit()
        db.refresh(new_product)
        return new_product
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Product creation failed. Check for duplicate data.")

@router.get('/{product_id}', tags=['products'], status_code=status.HTTP_200_OK, response_model=ProductRead)
@active_user_required
async def get_product_by_id(product_id: int, current_user: User = Depends(get_current_user), db: SessionLocal = Depends(get_db), language: Optional[str] = Query(None)):
    query = db.query(Product).filter(Product.id == product_id).options(subqueryload(Product.features), subqueryload(Product.images))
    if language:
        query = query.join(Product.translations).filter(ProductTranslation.language == language).options(contains_eager(Product.translations))
    else:
        query = query.options(subqueryload(Product.translations))

    product = query.first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Product not found')

    return product

@router.put('/{product_id}', tags=['products'], status_code=status.HTTP_200_OK, response_model=ProductRead)
@superuser_required
async def update_product(
    product_id: int,
    product_data: str = Form(...),
    images: Optional[List[UploadFile]] = File(None),
    current_user: User = Depends(get_current_user),
    db: SessionLocal = Depends(get_db)
):
    product_to_update = db.query(Product).filter(Product.id == product_id).first()
    if not product_to_update:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Product not found')
    
    try:
        product_schema = ProductCreate.parse_raw(product_data)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=f"Invalid product data format: {e}")

    # Clear old collections and add new ones
    product_to_update.translations.clear()
    product_to_update.features.clear()
    
    product_to_update.translations.append(ProductTranslation(**product_schema.translation.dict()))
    for feature in product_schema.features:
        product_to_update.features.append(ProductFeatures(**feature.dict()))

    # Add new images if they are provided
    if images:
        for image_file in images:
            if image_file.content_type not in ["image/jpeg", "image/png", "image/webp"]:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid image format.")
            image_path = await process_and_save_image(image_file)
            product_to_update.images.append(ProductImages(image_url=image_path))

    try:
        db.add(product_to_update)
        db.commit()
        db.refresh(product_to_update)
        return product_to_update
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Product update failed.")


@router.delete('/{product_id}', tags=['products'], status_code=status.HTTP_204_NO_CONTENT)
@superuser_required
async def delete_product(product_id: int, current_user: User = Depends(get_current_user), db: SessionLocal = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if product:
        db.delete(product)
        db.commit()
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Product not found')
    
