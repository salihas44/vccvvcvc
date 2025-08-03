from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime
from enum import Enum
import uuid

class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"

class OrderStatus(str, Enum):
    PENDING = "pending"
    PAID = "paid"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class PaymentStatus(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"

class PaymentMethod(str, Enum):
    STRIPE = "stripe"
    IYZICO = "iyzico"

# User Models
class UserBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    role: UserRole = UserRole.USER

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: str = Field(alias="_id")
    created_at: datetime
    updated_at: datetime

    class Config:
        populate_by_name = True

class UserInDB(UserBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

# Category Models
class CategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: str = Field(alias="_id")

    class Config:
        populate_by_name = True

class CategoryInDB(CategoryBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")

    class Config:
        populate_by_name = True

# Product Models
class ProductBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=200)
    description: str = Field(..., max_length=1000)
    image: str
    original_price: float = Field(..., gt=0)
    current_price: float = Field(..., gt=0)
    rating: int = Field(default=5, ge=1, le=5)
    category: str
    badge: Optional[str] = None
    in_stock: bool = Field(default=True)

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    original_price: Optional[float] = None
    current_price: Optional[float] = None
    rating: Optional[int] = None
    category: Optional[str] = None
    badge: Optional[str] = None
    in_stock: Optional[bool] = None

class ProductResponse(ProductBase):
    id: str = Field(alias="_id")
    created_at: datetime
    updated_at: datetime

    class Config:
        populate_by_name = True

class ProductInDB(ProductBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

# Cart Models
class CartItem(BaseModel):
    product_id: str
    quantity: int = Field(..., ge=1)

class CartItemResponse(BaseModel):
    product_id: str
    product: ProductResponse
    quantity: int

class CartResponse(BaseModel):
    items: List[CartItemResponse]
    total: float

class CartInDB(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    user_id: str
    items: List[CartItem] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

# Address Model
class Address(BaseModel):
    full_name: str
    phone: str
    address_line: str
    city: str
    postal_code: str
    country: str = "Turkey"

# Order Models
class OrderCreate(BaseModel):
    items: List[CartItem]
    shipping_address: Address
    payment_method: PaymentMethod

class OrderResponse(BaseModel):
    id: str = Field(alias="_id")
    user_id: str
    items: List[CartItemResponse]
    total: float
    shipping: float
    status: OrderStatus
    shipping_address: Address
    payment_method: PaymentMethod
    payment_status: PaymentStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        populate_by_name = True

class OrderInDB(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    user_id: str
    items: List[CartItem]
    total: float
    shipping: float
    status: OrderStatus = OrderStatus.PENDING
    shipping_address: Address
    payment_method: PaymentMethod
    payment_status: PaymentStatus = PaymentStatus.PENDING
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

# Response Models
class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class MessageResponse(BaseModel):
    message: str

class ProductListResponse(BaseModel):
    products: List[ProductResponse]
    total_pages: int
    current_page: int
    total_count: int