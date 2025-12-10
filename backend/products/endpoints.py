from fastapi import APIRouter, Depends, HTTPException, status, Request
from user.model import User, Product, ProductFeatures, ProductImages
from user.dependencies import get_current_user, authenticate_user, create_access_token
from configs import get_db, SessionLocal
from typing import Optional, List
from helpers import active_user_required
import json
from sqlalchemy.exc import IntegrityError


router = APIRouter()
@router.get('/', tags=['items', status_code=status.HTTP_200_OK])

