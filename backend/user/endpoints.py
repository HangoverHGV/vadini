"""
This file contains the user endpoints for the API. It includes the following routes:
- GET /: Get all users
- GET /{user_id}: Get a user by ID
- POST /: Create a user
- PUT /{user_id}: Edit a user by ID
- DELETE /{user_id}: Delete a user by ID
- POST /superuser/: Create a superuser
- POST /token: Get an access token
- GET /me: Get the current user (not implemented yet)
"""
from fastapi import (APIRouter, Depends, HTTPException, status, Response)
from configs import get_db, SessionLocal, ACCESS_TOKEN_EXPIRE_DAYS
from fastapi.security import OAuth2PasswordRequestForm
from user.models import User
from user.schema import UserCreate, UserEdit, SuperUserCreate, UserRead, Token
from datetime import timedelta
from user.dependencies import authenticate_user, create_access_token, get_current_user
from typing import List
from helpers import active_user_required, superuser_required



router = APIRouter()


### Routes
@router.get("/", tags=["user"], status_code=status.HTTP_200_OK, response_model=List[UserRead])
@superuser_required
async def get_all_users(current_user: User = Depends(get_current_user), db: SessionLocal = Depends(get_db)):
    query = db.query(User)
    users = query.all()
    return users

@router.get("/me", tags=["user"], status_code=status.HTTP_200_OK, response_model=UserRead)
@active_user_required
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.get("/{user_id}", tags=["user"], status_code=status.HTTP_200_OK, response_model=UserRead)
@superuser_required
async def get_user(user_id: int, current_user: User = Depends(get_current_user), db: SessionLocal = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    return user


@router.post("/", tags=["user"], status_code=status.HTTP_201_CREATED, response_model=UserRead)
async def create_user(user: UserCreate,
                      db: SessionLocal = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    new_user = User(name=user.name, email=user.email, is_active=True, is_superuser=False)
    new_user.hash_password(user.password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

@router.put("/{user_id}", tags=["user"], status_code=status.HTTP_200_OK, response_model=UserRead)
def edit_user(user_id: int, user: UserEdit, db: SessionLocal = Depends(get_db),
              current_user: User = Depends(get_current_user)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if not current_user.is_superuser and current_user.id != db_user.id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="You don't have permission to edit this user")

    for key, value in user.model_dump(exclude_unset=True).items():
        setattr(db_user, key, value)

    db.commit()
    db.refresh(db_user)

    return db_user


@router.delete("/{user_id}", tags=["user"], status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: int, db: SessionLocal = Depends(get_db), current_user: User = Depends(get_current_user)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if not current_user.is_superuser and current_user.id != user.id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="You don't have permission to delete this user")

    db.delete(user)
    db.commit()

    return None


@router.post("/superuser", tags=["user"], status_code=status.HTTP_201_CREATED, response_model=UserRead)
async def create_superuser(user: SuperUserCreate, db: SessionLocal = Depends(get_db)):
    if user.secret_token != SUPERUSER_SECRET_TOKEN:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid secret token")

    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    new_user = User(name=user.name, email=user.email, is_active=True, is_superuser=True)
    new_user.hash_password(user.password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.post("/token", tags=["user"], status_code=status.HTTP_200_OK, response_model=Token)
async def login_for_access_token(response: Response,db: SessionLocal = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    user_db = authenticate_user(form_data.username, form_data.password, db)
    if not user_db:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password",
                            headers={"WWW-Authenticate": "Bearer"}, )

    access_token_expires = timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    access_token = create_access_token(
        data={"sub": user_db.email}, expires_delta=access_token_expires
    )

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        max_age=ACCESS_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,  # seconds
        secure=False,  # True if using HTTPS
        samesite="lax"
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post('/logout', tags=['user'], status_code=status.HTTP_200_OK)
@active_user_required
async def logout(respone: Response, current_user: User = Depends(get_current_user)):
    """
        API endpoint to logout
    """

    cookie_name = 'access_token'

    respone.delete_cookie(
        key=cookie_name,
        path='/',
        domain=None,
        secure=True,
        httponly=True,
        samesite='lax'
    )

    return {'detail': 'Logout successfully'}
    
    