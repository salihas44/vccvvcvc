from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from models import (
    ProductCreate, ProductUpdate, ProductResponse, ProductInDB,
    OrderResponse, MessageResponse
)
from database import Database
from auth import get_current_admin_email

router = APIRouter(prefix="/admin", tags=["admin"])

# Product Management
@router.post("/products", response_model=ProductResponse)
async def create_product(
    product_data: ProductCreate,
    current_admin_email: str = Depends(get_current_admin_email)
):
    """Create a new product (Admin only)"""
    new_product = ProductInDB(
        name=product_data.name,
        description=product_data.description,
        image=product_data.image,
        original_price=product_data.original_price,
        current_price=product_data.current_price,
        rating=product_data.rating,
        category=product_data.category,
        badge=product_data.badge,
        in_stock=product_data.in_stock
    )
    
    created_product = await Database.create_product(new_product)
    
    return ProductResponse(
        _id=created_product.id,
        name=created_product.name,
        description=created_product.description,
        image=created_product.image,
        original_price=created_product.original_price,
        current_price=created_product.current_price,
        rating=created_product.rating,
        category=created_product.category,
        badge=created_product.badge,
        in_stock=created_product.in_stock,
        created_at=created_product.created_at,
        updated_at=created_product.updated_at
    )

@router.put("/products/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: str,
    product_data: ProductUpdate,
    current_admin_email: str = Depends(get_current_admin_email)
):
    """Update a product (Admin only)"""
    # Check if product exists
    existing_product = await Database.get_product_by_id(product_id)
    if not existing_product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    # Update product
    update_data = {k: v for k, v in product_data.dict().items() if v is not None}
    updated_product = await Database.update_product(product_id, update_data)
    
    if not updated_product:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to update product"
        )
    
    return ProductResponse(
        _id=updated_product.id,
        name=updated_product.name,
        description=updated_product.description,
        image=updated_product.image,
        original_price=updated_product.original_price,
        current_price=updated_product.current_price,
        rating=updated_product.rating,
        category=updated_product.category,
        badge=updated_product.badge,
        in_stock=updated_product.in_stock,
        created_at=updated_product.created_at,
        updated_at=updated_product.updated_at
    )

@router.delete("/products/{product_id}", response_model=MessageResponse)
async def delete_product(
    product_id: str,
    current_admin_email: str = Depends(get_current_admin_email)
):
    """Delete a product (Admin only)"""
    success = await Database.delete_product(product_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    return MessageResponse(message="Product deleted successfully")

# Order Management
@router.get("/orders", response_model=List[OrderResponse])
async def get_all_orders(current_admin_email: str = Depends(get_current_admin_email)):
    """Get all orders (Admin only)"""
    orders = await Database.get_all_orders()
    
    order_responses = []
    for order in orders:
        # Build cart items with product details
        cart_items = []
        for item in order.items:
            product = await Database.get_product_by_id(item.product_id)
            if product:
                cart_items.append({
                    "product_id": item.product_id,
                    "product": ProductResponse(
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
                    ),
                    "quantity": item.quantity
                })
        
        order_responses.append(OrderResponse(
            _id=order.id,
            user_id=order.user_id,
            items=cart_items,
            total=order.total,
            shipping=order.shipping,
            status=order.status,
            shipping_address=order.shipping_address,
            payment_method=order.payment_method,
            payment_status=order.payment_status,
            created_at=order.created_at,
            updated_at=order.updated_at
        ))
    
    return order_responses