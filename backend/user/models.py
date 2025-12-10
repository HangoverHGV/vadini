from database import Base
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class TimestampMixin:
    created_at = Column(DateTime, 
                        default=lambda: datetime.now(timezone.utc),
                        nullable=False
                        )
    updated_at = Column(DateTime,
                        default=lambda: datetime.now(timezone.utc), 
                        onupdate=lambda: datetime.now(timezone.utc),
                        nullable=False
                        )

class User(TimestampMixin, Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)

    def verify_password(self, password: str):
        return pwd_context.verify(password, self.hashed_password)

    def get_password_hash(self, password: str):
        return pwd_context.hash(password)



class Product(TimestampMixin, Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)

    translations = relationship("ProductTranslation", back_populates="product", cascade="all, delete-orphan")
    features = relationship("ProductFeatures", back_populates="product", cascade="all, delete-orphan")
    images = relationship("ProductImages", back_populates="product", cascade="all, delete-orphan")


class ProductTranslation(TimestampMixin, Base):
    __tablename__ = "product_translations"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    language = Column(String, index=True)
    title = Column(String, index=True)
    description = Column(String, index=True)

    product = relationship("Product", back_populates="translations")
    

class ProductFeatures(TimestampMixin, Base):
    __tablename__ = "product_features"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    feature_name = Column(String, index=True)
    feature_value = Column(String)

    product = relationship("Product", back_populates="features")


class ProductImages(TimestampMixin, Base):
    __tablename__ = "product_images"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    image_url = Column(String)

    product = relationship("Product", back_populates="images")
