from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from models import CartItem, CartResponse, CartItemResponse, ProductResponse, MessageResponse, CartInDB
from database import Database
from auth import get_current_user_email

router = APIRouter(prefix="/cart", tags=["cart"])

async def build_cart_response(cart: CartInDB) -> CartResponse:
    """Build cart response with product details"""
    cart_items = []
    total = 0.0
    
    for item in cart.items:
        product = await Database.get_product_by_id(item.product_id)
        if product and product.in_stock:
            product_response = ProductResponse(
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
            
            cart_item_response = CartItemResponse(
                product_id=item.product_id,
                product=product_response,
                quantity=item.quantity
            )
            
            cart_items.append(cart_item_response)
            total += product.current_price * item.quantity
    
    return CartResponse(items=cart_items, total=total)

@router.get("/", response_model=CartResponse)
async def get_cart(current_user_email: str = Depends(get_current_user_email)):
    """Get user cart"""
    user = await Database.get_user_by_email(current_user_email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    cart = await Database.get_cart(user.id)
    if not cart:
        # Create empty cart
        cart = CartInDB(user_id=user.id, items=[])
        await Database.create_cart(cart)
    
    return await build_cart_response(cart)

@router.post("/add")
async def add_to_cart(
    item: CartItem,
    current_user_email: str = Depends(get_current_user_email)
):
    """Add item to cart"""
    user = await Database.get_user_by_email(current_user_email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Verify product exists
    product = await Database.get_product_by_id(item.product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    if not product.in_stock:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Product is out of stock"
        )
    
    # Get current cart
    cart = await Database.get_cart(user.id)
    if not cart:
        cart = CartInDB(user_id=user.id, items=[])
    
    # Update cart items
    existing_item = None
    for cart_item in cart.items:
        if cart_item.product_id == item.product_id:
            existing_item = cart_item
            break
    
    if existing_item:
        existing_item.quantity += item.quantity
    else:
        cart.items.append(item)
    
    # Save updated cart
    await Database.update_cart(user.id, cart.items)
    
    # Build response
    updated_cart = await Database.get_cart(user.id)
    cart_response = await build_cart_response(updated_cart)
    
    return {
        "message": "Item added to cart",
        "cart": cart_response
    }

@router.put("/update")
async def update_cart_item(
    item: CartItem,
    current_user_email: str = Depends(get_current_user_email)
):
    """Update cart item quantity"""
    user = await Database.get_user_by_email(current_user_email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    cart = await Database.get_cart(user.id)
    if not cart:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart not found"
        )
    
    # Update item quantity
    item_found = False
    for cart_item in cart.items:
        if cart_item.product_id == item.product_id:
            cart_item.quantity = item.quantity
            item_found = True
            break
    
    if not item_found:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found in cart"
        )
    
    # Remove items with quantity 0
    cart.items = [item for item in cart.items if item.quantity > 0]
    
    # Save updated cart
    await Database.update_cart(user.id, cart.items)
    
    # Build response
    updated_cart = await Database.get_cart(user.id)
    cart_response = await build_cart_response(updated_cart)
    
    return {
        "message": "Cart updated",
        "cart": cart_response
    }

@router.delete("/remove", response_model=dict)
async def remove_from_cart(
    product_id: str,
    current_user_email: str = Depends(get_current_user_email)
):
    """Remove item from cart"""
    user = await Database.get_user_by_email(current_user_email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    cart = await Database.get_cart(user.id)
    if not cart:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart not found"
        )
    
    # Remove item
    original_length = len(cart.items)
    cart.items = [item for item in cart.items if item.product_id != product_id]
    
    if len(cart.items) == original_length:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found in cart"
        )
    
    # Save updated cart
    await Database.update_cart(user.id, cart.items)
    
    # Build response
    updated_cart = await Database.get_cart(user.id)
    cart_response = await build_cart_response(updated_cart)
    
    return {
        "message": "Item removed from cart",
        "cart": cart_response
    }