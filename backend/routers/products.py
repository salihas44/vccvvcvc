from fastapi import APIRouter, HTTPException, status, Query, Depends
from typing import Optional
from models import ProductResponse, ProductListResponse, ProductCreate, ProductUpdate
from database import Database
from auth import get_current_admin_email
import math

router = APIRouter(prefix="/products", tags=["products"])

@router.get("/", response_model=ProductListResponse)
async def get_products(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=50, description="Items per page"),
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search products")
):
    """Get products with pagination and filtering"""
    skip = (page - 1) * limit
    
    products, total_count = await Database.get_products(
        skip=skip,
        limit=limit,
        category=category,
        search=search
    )
    
    total_pages = math.ceil(total_count / limit)
    
    product_responses = [
        ProductResponse(
            _id=product.id,
            name=product.name,
            description=product.description,
            image=product.image,
            original_price=product.original_price,
            current_price=product.current_price,
            rating=product.rating,
            category=product.category,
            badge=product.badge,
            in_stock=product.in_stock,
            created_at=product.created_at,
            updated_at=product.updated_at
        )
        for product in products
    ]
    
    return ProductListResponse(
        products=product_responses,
        total_pages=total_pages,
        current_page=page,
        total_count=total_count
    )

@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: str):
    """Get product by ID"""
    product = await Database.get_product_by_id(product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    return ProductResponse(
        _id=product.id,
        name=product.name,
        description=product.description,
        image=product.image,
        original_price=product.original_price,
        current_price=product.current_price,
        rating=product.rating,
        category=product.category,
        badge=product.badge,
        in_stock=product.in_stock,
        created_at=product.created_at,
        updated_at=product.updated_at
    )