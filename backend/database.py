from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional, List, Dict, Any
import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from models import *

# Database connection
mongo_url = os.environ.get('MONGO_URL')
if not mongo_url:
    raise ValueError("MONGO_URL environment variable is not set")

client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'roboturkiye')]

# Collections
users_collection = db.users
products_collection = db.products
categories_collection = db.categories
carts_collection = db.carts
orders_collection = db.orders

class Database:
    """Database operations class"""
    
    # User operations
    @staticmethod
    async def create_user(user: UserInDB) -> UserInDB:
        """Create a new user"""
        await users_collection.insert_one(user.dict(by_alias=True))
        return user
    
    @staticmethod
    async def get_user_by_email(email: str) -> Optional[UserInDB]:
        """Get user by email"""
        user_doc = await users_collection.find_one({"email": email})
        if user_doc:
            return UserInDB(**user_doc)
        return None
    
    @staticmethod
    async def get_user_by_id(user_id: str) -> Optional[UserInDB]:
        """Get user by ID"""
        user_doc = await users_collection.find_one({"_id": user_id})
        if user_doc:
            return UserInDB(**user_doc)
        return None
    
    # Product operations
    @staticmethod
    async def create_product(product: ProductInDB) -> ProductInDB:
        """Create a new product"""
        await products_collection.insert_one(product.dict(by_alias=True))
        return product
    
    @staticmethod
    async def get_products(skip: int = 0, limit: int = 20, category: Optional[str] = None, search: Optional[str] = None) -> tuple[List[ProductInDB], int]:
        """Get products with pagination and filtering"""
        query = {}
        
        if category and category != "tum-urunler":
            query["category"] = category
        
        if search:
            query["$or"] = [
                {"name": {"$regex": search, "$options": "i"}},
                {"description": {"$regex": search, "$options": "i"}}
            ]
        
        # Get total count
        total_count = await products_collection.count_documents(query)
        
        # Get products
        cursor = products_collection.find(query).skip(skip).limit(limit)
        products = []
        async for doc in cursor:
            products.append(ProductInDB(**doc))
        
        return products, total_count
    
    @staticmethod
    async def get_product_by_id(product_id: str) -> Optional[ProductInDB]:
        """Get product by ID"""
        product_doc = await products_collection.find_one({"_id": product_id})
        if product_doc:
            return ProductInDB(**product_doc)
        return None
    
    @staticmethod
    async def update_product(product_id: str, update_data: dict) -> Optional[ProductInDB]:
        """Update product"""
        update_data["updated_at"] = datetime.utcnow()
        result = await products_collection.update_one(
            {"_id": product_id},
            {"$set": update_data}
        )
        if result.modified_count > 0:
            return await Database.get_product_by_id(product_id)
        return None
    
    @staticmethod
    async def delete_product(product_id: str) -> bool:
        """Delete product"""
        result = await products_collection.delete_one({"_id": product_id})
        return result.deleted_count > 0
    
    # Category operations
    @staticmethod
    async def get_categories() -> List[CategoryInDB]:
        """Get all categories"""
        cursor = categories_collection.find({})
        categories = []
        async for doc in cursor:
            categories.append(CategoryInDB(**doc))
        return categories
    
    @staticmethod
    async def create_category(category: CategoryInDB) -> CategoryInDB:
        """Create a new category"""
        await categories_collection.insert_one(category.dict(by_alias=True))
        return category
    
    # Cart operations
    @staticmethod
    async def get_cart(user_id: str) -> Optional[CartInDB]:
        """Get user cart"""
        cart_doc = await carts_collection.find_one({"user_id": user_id})
        if cart_doc:
            return CartInDB(**cart_doc)
        return None
    
    @staticmethod
    async def create_cart(cart: CartInDB) -> CartInDB:
        """Create a new cart"""
        await carts_collection.insert_one(cart.dict(by_alias=True))
        return cart
    
    @staticmethod
    async def update_cart(user_id: str, items: List[CartItem]) -> Optional[CartInDB]:
        """Update cart items"""
        result = await carts_collection.update_one(
            {"user_id": user_id},
            {
                "$set": {
                    "items": [item.dict() for item in items],
                    "updated_at": datetime.utcnow()
                }
            },
            upsert=True
        )
        return await Database.get_cart(user_id)
    
    # Order operations
    @staticmethod
    async def create_order(order: OrderInDB) -> OrderInDB:
        """Create a new order"""
        await orders_collection.insert_one(order.dict(by_alias=True))
        return order
    
    @staticmethod
    async def get_orders_by_user(user_id: str) -> List[OrderInDB]:
        """Get orders by user ID"""
        cursor = orders_collection.find({"user_id": user_id}).sort("created_at", -1)
        orders = []
        async for doc in cursor:
            orders.append(OrderInDB(**doc))
        return orders
    
    @staticmethod
    async def get_order_by_id(order_id: str) -> Optional[OrderInDB]:
        """Get order by ID"""
        order_doc = await orders_collection.find_one({"_id": order_id})
        if order_doc:
            return OrderInDB(**order_doc)
        return None
    
    @staticmethod
    async def get_all_orders() -> List[OrderInDB]:
        """Get all orders (admin only)"""
        cursor = orders_collection.find({}).sort("created_at", -1)
        orders = []
        async for doc in cursor:
            orders.append(OrderInDB(**doc))
        return orders

# Initialize default categories and products
async def initialize_database():
    """Initialize database with default categories and products"""
    # Check if categories exist
    existing_categories = await Database.get_categories()
    if not existing_categories:
        default_categories = [
            CategoryInDB(name="Tüm Ürünler", slug="tum-urunler", description="Tüm ürünler"),
            CategoryInDB(name="Elektrikli Ev Aletleri", slug="elektrikli-ev-aletleri", description="Elektrikli ev aletleri"),
            CategoryInDB(name="Spor Aletleri", slug="spor-aletleri", description="Spor ve fitness aletleri"),
            CategoryInDB(name="Küçük Ev Aletleri", slug="kucuk-ev-aletleri", description="Küçük ev aletleri"),
            CategoryInDB(name="Oyuncak", slug="oyuncak", description="Oyuncaklar"),
        ]
        
        for category in default_categories:
            await Database.create_category(category)
    
    # Check if products exist
    products, total_count = await Database.get_products(limit=1)
    if total_count == 0:
        # Create default products based on mock data
        from data.mockData import mockProducts
        for mock_product in mockProducts:
            product = ProductInDB(
                name=mock_product["name"],
                description=f"{mock_product['name']} - Yüksek kalite, garantili ürün. Hızlı kargo ile kapınızda!",
                image="/api/placeholder/300/300",  # Placeholder for now
                original_price=mock_product["originalPrice"],
                current_price=mock_product["currentPrice"],
                rating=mock_product["rating"],
                category=mock_product["category"],
                badge=mock_product.get("badge"),
                in_stock=True
            )
            await Database.create_product(product)