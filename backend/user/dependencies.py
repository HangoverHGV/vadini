from fastapi import Depends, HTTPException, status, Request
from configs import get_db, SessionLocal, SECRET_KEY, ALGORITHM, oauth2_scheme, ACCESS_TOKEN_EXPIRE_DAYS
from jose import JWTError, jwt
from user.models import User
from user.schema import TokenData
from passlib.context import CryptContext
from datetime import timedelta, datetime, timezone
from typing import Optional

### Helper functions
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_current_user(
        request: Request,
        token: Optional[str] = Depends(oauth2_scheme),
        db: SessionLocal = Depends(get_db)
):
    """
Extract the current user either from the Authorization header or the cookie.
    """
    # 1️⃣ Check cookie if header not provided
    if not token:
        cookie_token = request.cookies.get("access_token")
        if cookie_token and cookie_token.startswith("Bearer "):
            token = cookie_token[len("Bearer "):]

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 2️⃣ Decode JWT
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_email: str = payload.get("sub")
        if user_email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 3️⃣ Fetch user from DB
    user = db.query(User).filter(User.email == user_email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user


def verify_password(plain_password, hashed_password):
    """
        Verify password hashes 
    """
    return pwd_context.verify(plain_password, hashed_password)


def authenticate_user(email: str, password: str, db: SessionLocal):
    """
        Authenticate User
    """
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def create_access_token(data: dict, expires_delta: timedelta = None):
    """
        Create access Token
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt