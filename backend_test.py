#!/usr/bin/env python3
"""
Backend API Testing Script for RoboTurkiye E-commerce
Tests all backend endpoints according to test_result.md requirements
"""

import requests
import json
import sys
import os
from datetime import datetime

# Get backend URL from environment
BACKEND_URL = "https://a34145ea-5887-41c1-bd03-8a57e04dab2c.preview.emergentagent.com"
API_BASE = f"{BACKEND_URL}/api"

class BackendTester:
    def __init__(self):
        self.session = requests.Session()
        self.auth_token = None
        self.admin_token = None
        self.test_user_id = None
        self.test_product_id = None
        self.results = {
            "health_check": False,
            "database_connection": False,
            "products_api": False,
            "categories_api": False,
            "auth_register": False,
            "auth_login": False,
            "auth_profile": False,
            "cart_operations": False,
            "admin_endpoints": False,
            "database_initialization": False
        }
        self.errors = []

    def log_error(self, test_name, error):
        """Log test errors"""
        error_msg = f"[{test_name}] {str(error)}"
        self.errors.append(error_msg)
        print(f"❌ {error_msg}")

    def log_success(self, test_name, message=""):
        """Log test success"""
        success_msg = f"[{test_name}] {message}"
        print(f"✅ {success_msg}")

    def test_health_endpoints(self):
        """Test health check and root endpoints"""
        print("\n🔍 Testing Health & Database Endpoints...")
        
        try:
            # Test root endpoint
            response = self.session.get(f"{API_BASE}/")
            if response.status_code == 200:
                data = response.json()
                if "RoboTurkiye API is running" in data.get("message", ""):
                    self.log_success("Root Endpoint", "API is running")
                    self.results["database_connection"] = True
                else:
                    self.log_error("Root Endpoint", "Unexpected response message")
            else:
                self.log_error("Root Endpoint", f"Status code: {response.status_code}")
                
        except Exception as e:
            self.log_error("Root Endpoint", e)

        try:
            # Test health endpoint
            response = self.session.get(f"{API_BASE}/health")
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "healthy":
                    self.log_success("Health Check", "API is healthy")
                    self.results["health_check"] = True
                else:
                    self.log_error("Health Check", "API not healthy")
            else:
                self.log_error("Health Check", f"Status code: {response.status_code}")
                
        except Exception as e:
            self.log_error("Health Check", e)

    def test_products_api(self):
        """Test products API endpoints"""
        print("\n🔍 Testing Products API...")
        
        try:
            # Test get products
            response = self.session.get(f"{API_BASE}/products/")
            if response.status_code == 200:
                data = response.json()
                products = data.get("products", [])
                
                if len(products) > 0:
                    # Check for Turkish product names
                    turkish_product_found = False
                    for product in products:
                        if "robo" in product.get("name", "").lower():
                            turkish_product_found = True
                            self.test_product_id = product.get("id")
                            break
                    
                    if turkish_product_found:
                        self.log_success("Products API", f"Found {len(products)} products with Turkish names")
                        self.results["products_api"] = True
                        self.results["database_initialization"] = True
                    else:
                        self.log_error("Products API", "No Turkish products found")
                else:
                    self.log_error("Products API", "No products returned")
            else:
                self.log_error("Products API", f"Status code: {response.status_code}")
                
        except Exception as e:
            self.log_error("Products API", e)

        # Test individual product endpoint if we have a product ID
        if self.test_product_id:
            try:
                response = self.session.get(f"{API_BASE}/products/{self.test_product_id}")
                if response.status_code == 200:
                    product = response.json()
                    if product.get("name") and product.get("current_price"):
                        self.log_success("Product Detail", f"Product: {product.get('name')}")
                    else:
                        self.log_error("Product Detail", "Missing product data")
                else:
                    self.log_error("Product Detail", f"Status code: {response.status_code}")
            except Exception as e:
                self.log_error("Product Detail", e)

    def test_categories_api(self):
        """Test categories API"""
        print("\n🔍 Testing Categories API...")
        
        try:
            response = self.session.get(f"{API_BASE}/categories/")
            if response.status_code == 200:
                categories = response.json()
                
                if len(categories) > 0:
                    # Check for Turkish categories
                    expected_categories = ["elektrikli-ev-aletleri", "spor-aletleri", "kucuk-ev-aletleri"]
                    found_categories = [cat.get("slug") for cat in categories]
                    
                    turkish_categories_found = any(cat in found_categories for cat in expected_categories)
                    
                    if turkish_categories_found:
                        self.log_success("Categories API", f"Found {len(categories)} categories including Turkish ones")
                        self.results["categories_api"] = True
                    else:
                        self.log_error("Categories API", "Turkish categories not found")
                else:
                    self.log_error("Categories API", "No categories returned")
            else:
                self.log_error("Categories API", f"Status code: {response.status_code}")
                
        except Exception as e:
            self.log_error("Categories API", e)

    def test_authentication(self):
        """Test authentication endpoints"""
        print("\n🔍 Testing Authentication System...")
        
        # Test user registration
        test_user_data = {
            "name": "Ahmet Yılmaz",
            "email": f"ahmet.test.{datetime.now().timestamp()}@roboturkiye.com",
            "password": "güvenliparola123",
            "role": "user"
        }
        
        try:
            response = self.session.post(f"{API_BASE}/auth/register", json=test_user_data)
            if response.status_code == 200:
                data = response.json()
                if data.get("access_token") and data.get("user"):
                    self.auth_token = data["access_token"]
                    self.test_user_id = data["user"]["id"]
                    self.log_success("User Registration", f"User: {data['user']['name']}")
                    self.results["auth_register"] = True
                else:
                    self.log_error("User Registration", "Missing token or user data")
            else:
                self.log_error("User Registration", f"Status code: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_error("User Registration", e)

        # Test user login
        login_data = {
            "email": test_user_data["email"],
            "password": test_user_data["password"]
        }
        
        try:
            response = self.session.post(f"{API_BASE}/auth/login", json=login_data)
            if response.status_code == 200:
                data = response.json()
                if data.get("access_token"):
                    self.log_success("User Login", "Login successful")
                    self.results["auth_login"] = True
                else:
                    self.log_error("User Login", "No access token received")
            else:
                self.log_error("User Login", f"Status code: {response.status_code}")
                
        except Exception as e:
            self.log_error("User Login", e)

        # Test profile endpoint
        if self.auth_token:
            try:
                headers = {"Authorization": f"Bearer {self.auth_token}"}
                response = self.session.get(f"{API_BASE}/auth/profile", headers=headers)
                if response.status_code == 200:
                    profile = response.json()
                    if profile.get("name") and profile.get("email"):
                        self.log_success("User Profile", f"Profile: {profile.get('name')}")
                        self.results["auth_profile"] = True
                    else:
                        self.log_error("User Profile", "Missing profile data")
                else:
                    self.log_error("User Profile", f"Status code: {response.status_code}")
                    
            except Exception as e:
                self.log_error("User Profile", e)

        # Test admin registration for admin endpoints
        admin_user_data = {
            "name": "Admin Kullanıcı",
            "email": f"admin.test.{datetime.now().timestamp()}@roboturkiye.com",
            "password": "adminparola123",
            "role": "admin"
        }
        
        try:
            response = self.session.post(f"{API_BASE}/auth/register", json=admin_user_data)
            if response.status_code == 200:
                data = response.json()
                if data.get("access_token"):
                    self.admin_token = data["access_token"]
                    self.log_success("Admin Registration", "Admin user created")
                else:
                    self.log_error("Admin Registration", "No admin token received")
            else:
                self.log_error("Admin Registration", f"Status code: {response.status_code}")
                
        except Exception as e:
            self.log_error("Admin Registration", e)

    def test_cart_operations(self):
        """Test shopping cart operations"""
        print("\n🔍 Testing Shopping Cart Operations...")
        
        if not self.auth_token:
            self.log_error("Cart Operations", "No auth token available")
            return

        headers = {"Authorization": f"Bearer {self.auth_token}"}

        # Test get cart
        try:
            response = self.session.get(f"{API_BASE}/cart/", headers=headers)
            if response.status_code == 200:
                cart = response.json()
                if "items" in cart and "total" in cart:
                    self.log_success("Get Cart", "Cart retrieved successfully")
                else:
                    self.log_error("Get Cart", "Invalid cart structure")
            else:
                self.log_error("Get Cart", f"Status code: {response.status_code}")
                
        except Exception as e:
            self.log_error("Get Cart", e)

        # Test add to cart
        if self.test_product_id:
            try:
                cart_item = {
                    "product_id": self.test_product_id,
                    "quantity": 2
                }
                response = self.session.post(f"{API_BASE}/cart/add", json=cart_item, headers=headers)
                if response.status_code == 200:
                    data = response.json()
                    if data.get("message") and data.get("cart"):
                        self.log_success("Add to Cart", "Item added successfully")
                        self.results["cart_operations"] = True
                    else:
                        self.log_error("Add to Cart", "Invalid response structure")
                else:
                    self.log_error("Add to Cart", f"Status code: {response.status_code}")
                    
            except Exception as e:
                self.log_error("Add to Cart", e)

            # Test update cart
            try:
                update_item = {
                    "product_id": self.test_product_id,
                    "quantity": 3
                }
                response = self.session.put(f"{API_BASE}/cart/update", json=update_item, headers=headers)
                if response.status_code == 200:
                    self.log_success("Update Cart", "Cart updated successfully")
                else:
                    self.log_error("Update Cart", f"Status code: {response.status_code}")
                    
            except Exception as e:
                self.log_error("Update Cart", e)

            # Test remove from cart
            try:
                response = self.session.delete(f"{API_BASE}/cart/remove?product_id={self.test_product_id}", headers=headers)
                if response.status_code == 200:
                    self.log_success("Remove from Cart", "Item removed successfully")
                else:
                    self.log_error("Remove from Cart", f"Status code: {response.status_code}")
                    
            except Exception as e:
                self.log_error("Remove from Cart", e)

    def test_admin_endpoints(self):
        """Test admin panel endpoints"""
        print("\n🔍 Testing Admin Panel Endpoints...")
        
        if not self.admin_token:
            self.log_error("Admin Endpoints", "No admin token available")
            return

        headers = {"Authorization": f"Bearer {self.admin_token}"}

        # Test create product
        try:
            new_product = {
                "name": "Test Ürün - robo Yeni Cihaz",
                "description": "Test için oluşturulan ürün",
                "image": "/api/placeholder/300/300",
                "original_price": 1000.0,
                "current_price": 800.0,
                "rating": 5,
                "category": "elektrikli-ev-aletleri",
                "badge": "TEST",
                "in_stock": True
            }
            response = self.session.post(f"{API_BASE}/admin/products", json=new_product, headers=headers)
            if response.status_code == 200:
                product = response.json()
                if product.get("id"):
                    created_product_id = product["id"]
                    self.log_success("Admin Create Product", f"Product created: {product.get('name')}")
                    self.results["admin_endpoints"] = True
                else:
                    self.log_error("Admin Create Product", "No product ID returned")
            else:
                self.log_error("Admin Create Product", f"Status code: {response.status_code}")
                
        except Exception as e:
            self.log_error("Admin Create Product", e)

        # Test get all orders
        try:
            response = self.session.get(f"{API_BASE}/admin/orders", headers=headers)
            if response.status_code == 200:
                orders = response.json()
                self.log_success("Admin Get Orders", f"Retrieved {len(orders)} orders")
            else:
                self.log_error("Admin Get Orders", f"Status code: {response.status_code}")
                
        except Exception as e:
            self.log_error("Admin Get Orders", e)

    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting Backend API Tests for RoboTurkiye E-commerce")
        print("=" * 60)
        
        # Run tests in order
        self.test_health_endpoints()
        self.test_products_api()
        self.test_categories_api()
        self.test_authentication()
        self.test_cart_operations()
        self.test_admin_endpoints()
        
        # Print summary
        print("\n" + "=" * 60)
        print("📊 TEST RESULTS SUMMARY")
        print("=" * 60)
        
        total_tests = len(self.results)
        passed_tests = sum(1 for result in self.results.values() if result)
        
        for test_name, result in self.results.items():
            status = "✅ PASS" if result else "❌ FAIL"
            print(f"{test_name.replace('_', ' ').title()}: {status}")
        
        print(f"\nOverall: {passed_tests}/{total_tests} tests passed")
        
        if self.errors:
            print(f"\n🚨 ERRORS ENCOUNTERED ({len(self.errors)}):")
            for error in self.errors:
                print(f"  • {error}")
        
        return self.results, self.errors

if __name__ == "__main__":
    tester = BackendTester()
    results, errors = tester.run_all_tests()
    
    # Exit with error code if any critical tests failed
    critical_tests = ["health_check", "database_connection", "products_api", "auth_register"]
    critical_failures = [test for test in critical_tests if not results.get(test, False)]
    
    if critical_failures:
        print(f"\n❌ Critical test failures: {critical_failures}")
        sys.exit(1)
    else:
        print(f"\n✅ All critical tests passed!")
        sys.exit(0)