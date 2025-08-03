from fastapi import APIRouter, HTTPException, status, Depends
from datetime import timedelta
from models import UserCreate, UserLogin, UserResponse, UserInDB, TokenResponse, UserRole
from database import Database
from auth import (
    verify_password, 
    get_password_hash, 
    create_access_token, 
    get_current_user_email,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post("/register", response_model=TokenResponse)
async def register(user_data: UserCreate):
    """Register a new user"""
    # Check if user already exists
    existing_user = await Database.get_user_by_email(user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = UserInDB(
        name=user_data.name,
        email=user_data.email,
        role=user_data.role,
        hashed_password=hashed_password
    )
    
    # Save to database
    created_user = await Database.create_user(new_user)
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={
            "sub": created_user.email,
            "is_admin": created_user.role == UserRole.ADMIN
        },
        expires_delta=access_token_expires
    )
    
    # Return token and user info
    user_response = UserResponse(
        _id=created_user.id,
        name=created_user.name,
        email=created_user.email,
        role=created_user.role,
        created_at=created_user.created_at,
        updated_at=created_user.updated_at
    )
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=user_response
    )

@router.post("/login", response_model=TokenResponse)
async def login(user_credentials: UserLogin):
    """Login user"""
    # Get user from database
    user = await Database.get_user_by_email(user_credentials.email)
    if not user or not verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={
            "sub": user.email,
            "is_admin": user.role == UserRole.ADMIN
        },
        expires_delta=access_token_expires
    )
    
    # Return token and user info
    user_response = UserResponse(
        _id=user.id,
        name=user.name,
        email=user.email,
        role=user.role,
        created_at=user.created_at,
        updated_at=user.updated_at
    )
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=user_response
    )

@router.get("/profile", response_model=UserResponse)
async def get_profile(current_user_email: str = Depends(get_current_user_email)):
    """Get current user profile"""
    user = await Database.get_user_by_email(current_user_email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserResponse(
        _id=user.id,
        name=user.name,
        email=user.email,
        role=user.role,
        created_at=user.created_at,
        updated_at=user.updated_at
    )