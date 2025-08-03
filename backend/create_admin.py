#!/usr/bin/env python3
"""
Script to create an admin user for the RoboTurkiye e-commerce platform
"""

import asyncio
import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from database import Database
from models import UserInDB, UserRole
from auth import get_password_hash

async def create_admin_user():
    """Create an admin user"""
    admin_data = {
        "name": "Admin User",
        "email": "admin@roboturkiye.com", 
        "password": "admin123",
        "role": UserRole.ADMIN
    }
    
    # Check if admin already exists
    existing_admin = await Database.get_user_by_email(admin_data["email"])
    if existing_admin:
        print(f"Admin user already exists: {admin_data['email']}")
        return existing_admin
    
    # Create admin user
    hashed_password = get_password_hash(admin_data["password"])
    admin_user = UserInDB(
        name=admin_data["name"],
        email=admin_data["email"],
        role=admin_data["role"],
        hashed_password=hashed_password
    )
    
    created_admin = await Database.create_user(admin_user)
    print(f"Admin user created successfully!")
    print(f"Email: {admin_data['email']}")
    print(f"Password: {admin_data['password']}")
    print(f"Role: {admin_data['role']}")
    
    return created_admin

if __name__ == "__main__":
    asyncio.run(create_admin_user())