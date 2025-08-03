from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path

# Import routers
from routers import auth, products, categories, cart, admin
from database import initialize_database

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create the main app
app = FastAPI(
    title="RoboTurkiye E-Commerce API",
    description="E-commerce API for Turkish home appliances and sports products",
    version="1.0.0"
)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Health check endpoint
@api_router.get("/")
async def root():
    return {"message": "RoboTurkiye API is running!", "version": "1.0.0"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "message": "API is working properly"}

# Include all routers
api_router.include_router(auth.router)
api_router.include_router(products.router)
api_router.include_router(categories.router)
api_router.include_router(cart.router)
api_router.include_router(admin.router)

# Include the main router in the app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_db():
    await initialize_database()
    logger.info("Database initialized successfully")


