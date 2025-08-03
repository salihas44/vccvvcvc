from fastapi import APIRouter
from typing import List
from models import CategoryResponse
from database import Database

router = APIRouter(prefix="/categories", tags=["categories"])

@router.get("/", response_model=List[CategoryResponse])
async def get_categories():
    """Get all categories"""
    categories = await Database.get_categories()
    
    return [
        CategoryResponse(
            _id=category.id,
            name=category.name,
            slug=category.slug,
            description=category.description
        )
        for category in categories
    ]