# RoboTurkiye E-Commerce - API Contracts & Integration Plan

## A) API Contracts

### 1. Authentication Endpoints
```
POST /api/auth/register
Body: { name: string, email: string, password: string }
Response: { user: UserObject, token: string }

POST /api/auth/login  
Body: { email: string, password: string }
Response: { user: UserObject, token: string }

GET /api/auth/profile (Protected)
Headers: { Authorization: Bearer <token> }
Response: { user: UserObject }
```

### 2. Product Endpoints
```
GET /api/products
Query: { category?: string, search?: string, page?: number, limit?: number }
Response: { products: ProductObject[], totalPages: number, currentPage: number }

GET /api/products/:id
Response: { product: ProductObject }

GET /api/categories
Response: { categories: CategoryObject[] }
```

### 3. Cart Endpoints
```
GET /api/cart (Protected)
Response: { items: CartItemObject[], total: number }

POST /api/cart/add (Protected)
Body: { productId: string, quantity: number }
Response: { message: string, cart: CartObject }

PUT /api/cart/update (Protected) 
Body: { productId: string, quantity: number }
Response: { message: string, cart: CartObject }

DELETE /api/cart/remove (Protected)
Body: { productId: string }
Response: { message: string, cart: CartObject }
```

### 4. Order Endpoints
```
POST /api/orders (Protected)
Body: { items: CartItemObject[], shippingAddress: AddressObject, paymentMethod: string }
Response: { order: OrderObject, paymentUrl?: string }

GET /api/orders (Protected)
Response: { orders: OrderObject[] }

GET /api/orders/:id (Protected)
Response: { order: OrderObject }
```

### 5. Admin Endpoints (Protected - Admin only)
```
POST /api/admin/products
Body: { name, description, price, originalPrice, image, category, badge }
Response: { product: ProductObject }

PUT /api/admin/products/:id
Body: { name?, description?, price?, originalPrice?, image?, category?, badge? }
Response: { product: ProductObject }

DELETE /api/admin/products/:id
Response: { message: string }

GET /api/admin/orders
Response: { orders: OrderObject[] }
```

## B) Data Models

### User Object
```javascript
{
  _id: string,
  name: string,
  email: string,
  isAdmin: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Product Object  
```javascript
{
  _id: string,
  name: string,
  description: string,
  image: string,
  originalPrice: number,
  currentPrice: number,
  rating: number,
  category: string,
  badge: string | null,
  inStock: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Cart Item Object
```javascript
{
  productId: string,
  product: ProductObject,
  quantity: number
}
```

### Order Object
```javascript
{
  _id: string,
  userId: string,
  items: CartItemObject[],
  total: number,
  shipping: number,
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled',
  shippingAddress: AddressObject,
  paymentMethod: 'stripe' | 'iyzico',
  paymentStatus: 'pending' | 'completed' | 'failed',
  createdAt: Date,
  updatedAt: Date
}
```

## C) Mocked Data Replacement Plan

### Currently Mocked in `/app/frontend/src/data/mockData.js`:
1. **mockProducts** → Replace with API calls to `GET /api/products`
2. **mockCategories** → Replace with API calls to `GET /api/categories`  
3. **mockHeroBanners** → Replace with API calls to `GET /api/banners` (or keep as config)
4. **mockUser** → Replace with authentication state management
5. **mockCart** → Replace with API calls to cart endpoints

### Frontend Integration Changes:
1. **App.js** - Replace localStorage cart with API calls
2. **Header.js** - Add real authentication state
3. **ProductGrid.js** - Fetch products from API
4. **LoginModal.js** - Connect to real auth endpoints
5. **CartModal.js** - Connect to cart API endpoints

## D) Backend Implementation Plan

### Phase 1: Core Setup
1. MongoDB models (User, Product, Cart, Order, Category)
2. JWT authentication middleware
3. Basic CRUD operations

### Phase 2: E-commerce Logic
1. Cart management
2. Order processing
3. Admin panel functionality
4. File upload for product images

### Phase 3: Payment Integration
1. Stripe integration for international cards
2. Iyzico integration for Turkish payment methods
3. Order status management

### Phase 4: Admin Panel
1. Separate admin login system  
2. Product management (CRUD)
3. Order management
4. User management

## E) Frontend-Backend Integration

### Authentication Flow:
1. User registers/logs in → JWT token stored in localStorage
2. Token sent in Authorization header for protected routes
3. Auto-logout on token expiration

### Shopping Flow:
1. Browse products → API call to get products
2. Add to cart → API call to add item
3. View cart → API call to get cart items  
4. Checkout → API call to create order + payment redirect
5. Payment success → Update order status

### Admin Flow:
1. Admin login → Separate admin authentication
2. Access admin panel → Protected admin routes
3. Manage products → CRUD operations via API
4. View orders → Order management interface

## F) Key Implementation Notes

- All prices in Turkish Lira (₺)
- Support for both Turkish and international payment methods
- Mobile-responsive design maintained
- Real-time cart updates
- Proper error handling and loading states
- SEO-friendly product URLs
- Image optimization for product photos