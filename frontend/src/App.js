import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Components
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import ProductGrid from './components/ProductGrid';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import CartModal from './components/CartModal';
import ProductModal from './components/ProductModal';

// Mock Data
import { mockProducts } from './data/mockData';

// Toast
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';

const Home = () => {
  // State management
  const [products] = useState(mockProducts);
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState({ isLoggedIn: false, email: '', name: '' });
  
  // Modal states
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;