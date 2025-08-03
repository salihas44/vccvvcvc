#!/usr/bin/env python3
"""
Script to create a new admin user with different credentials
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

async def create_new_admin():
    """Create a new admin user with unique credentials"""
    admin_data = {
        "name": "Site Yöneticisi",
        "email": "yonetici@robosite.com", 
        "password": "robo2025",
        "role": UserRole.ADMIN
    }
    
    # Check if admin already exists
    existing_admin = await Database.get_user_by_email(admin_data["email"])
    if existing_admin:
        print(f"Bu admin zaten var: {admin_data['email']}")
        return existing_admin
    
    # Create new admin user
    hashed_password = get_password_hash(admin_data["password"])
    admin_user = UserInDB(
        name=admin_data["name"],
        email=admin_data["email"],
        role=admin_data["role"],
        hashed_password=hashed_password
    )
    
    created_admin = await Database.create_user(admin_user)
    print(f"Yeni admin kullanıcısı oluşturuldu!")
    print(f"E-posta: {admin_data['email']}")
    print(f"Şifre: {admin_data['password']}")
    print(f"İsim: {admin_data['name']}")
    print(f"Rol: {admin_data['role']}")
    
    return created_admin

if __name__ == "__main__":
    asyncio.run(create_new_admin())