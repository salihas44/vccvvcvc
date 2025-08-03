import React, { useState, useEffect } from "react";
import "./App.css";

// Components
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import ProductGrid from './components/ProductGrid';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import CartModal from './components/CartModal';
import ProductModal from './components/ProductModal';
import AdminModal from './components/AdminModal';

// Mock Data
import { mockProducts } from './data/mockData';

// Toast
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';

const Home = () => {
  // State management
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState({ isLoggedIn: false, email: '', name: '' });
  
  // Modal states
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  // Load products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/api/products/`);
      
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      } else {
        console.error('Failed to fetch products');
        // Fallback to mock data if API fails
        setProducts(mockProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to mock data if API fails
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  // Load cart from localStorage on mount
  useEffect(() => {
    fetchProducts(); // Load products from API

    const savedCart = localStorage.getItem('roboturkiye_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }

    const savedUser = localStorage.getItem('roboturkiye_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever cartItems changes
  useEffect(() => {
    localStorage.setItem('roboturkiye_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Save user to localStorage whenever user changes
  useEffect(() => {
    localStorage.setItem('roboturkiye_user', JSON.stringify(user));
  }, [user]);

  // Cart functions
  const handleAddToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        const updatedItems = prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        toast.success(`${product.name} sepete eklendi! (${existingItem.quantity + 1} adet)`);
        return updatedItems;
      } else {
        const newItem = { ...product, quantity: 1 };
        toast.success(`${product.name} sepete eklendi!`);
        return [...prevItems, newItem];
      }
    });
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      handleRemoveFromCart(productId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems(prevItems => {
      const removedItem = prevItems.find(item => item.id === productId);
      if (removedItem) {
        toast.success(`${removedItem.name} sepetten çıkarıldı`);
      }
      return prevItems.filter(item => item.id !== productId);
    });
  };

  // Auth functions
  const handleLogin = (userData) => {
    setUser({
      isLoggedIn: true,
      email: userData.email,
      name: userData.name
    });
    toast.success(`Hoş geldiniz ${userData.name}!`);
  };

  const handleLogout = () => {
    setUser({ isLoggedIn: false, email: '', name: '' });
    localStorage.removeItem('roboturkiye_user');
    toast.success('Başarıyla çıkış yaptınız');
  };

  // Product modal functions
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleCheckout = () => {
    if (!user.isLoggedIn) {
      setIsCartModalOpen(false);
      setIsLoginModalOpen(true);
      toast.error('Siparişi tamamlamak için giriş yapın');
      return;
    }

    // Mock checkout process
    const total = cartItems.reduce((sum, item) => sum + (item.currentPrice * item.quantity), 0);
    toast.success(`Sipariş başarıyla oluşturuldu! Toplam: ${total.toFixed(2)}₺`);
    setCartItems([]);
    setIsCartModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header
        cartItems={cartItems}
        onLoginClick={() => setIsLoginModalOpen(true)}
        onCartClick={() => setIsCartModalOpen(true)}
        isLoggedIn={user.isLoggedIn}
        userEmail={user.email}
      />

      {/* Main Content */}
      <main>
        {/* Hero Banner */}
        <section className="py-8">
          <HeroBanner />
        </section>

        {/* Products Section */}
        <section className="py-8">
          <ProductGrid
            products={products}
            onAddToCart={handleAddToCart}
            onProductClick={handleProductClick}
          />
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Admin Panel Button - Fixed */}
      <button 
        onClick={() => setIsAdminModalOpen(true)}
        className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 hover:shadow-xl flex items-center space-x-2"
        style={{
          background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
          boxShadow: '0 8px 25px rgba(220, 38, 38, 0.3)',
          zIndex: 999999
        }}
      >
        <span>🔐</span>
        <span>Admin Paneli</span>
      </button>

      {/* Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />

      <CartModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />

      <ProductModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onAddToCart={handleAddToCart}
      />

      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onProductChange={fetchProducts}
      />

      {/* Toast Container */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }} 
      />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <Home />
    </div>
  );
}

export default App;