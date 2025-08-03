import React, { useState } from 'react';
import { Search, User, ShoppingCart, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const Header = ({ cartItems = [], onLoginClick, onCartClick, isLoggedIn = false, userEmail = '' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartItemsCount = cartItems.length;

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <header className="w-full bg-white shadow-sm border-b">
      {/* Top shipping banner */}
      <div className="bg-green-600 text-white py-2 px-4 text-center text-sm">
        <span>⏰ SAAT 16:00'YA KADAR AYNI GÜN KARGO</span>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-red-600">robo.</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-red-600 transition-colors">Tüm Ürünler</a>
            <a href="#" className="text-gray-700 hover:text-red-600 transition-colors">Elektrikli Ev Aletleri</a>
            <a href="#" className="text-gray-700 hover:text-red-600 transition-colors">Spor Aletleri</a>
            <a href="#" className="text-gray-700 hover:text-red-600 transition-colors">Küçük Ev Aletleri</a>
            <a href="#" className="text-gray-700 hover:text-red-600 transition-colors">Oyuncak</a>
          </nav>

          {/* Search, User, Cart */}
          <div className="flex items-center space-x-4">
            {/* Search - Desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Ürün ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-4 pr-10 py-2"
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  variant="ghost" 
                  className="absolute right-0 top-0 h-full"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>

            {/* Search icon - Mobile */}
            <Button 
              size="icon" 
              variant="ghost" 
              className="md:hidden"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* User */}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onLoginClick}
              className="flex items-center space-x-1"
            >
              <User className="h-5 w-5" />
              <span className="hidden sm:inline">
                {isLoggedIn ? userEmail.split('@')[0] : 'Giriş / Üye Ol'}
              </span>
            </Button>

            {/* Cart */}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onCartClick}
              className="relative flex items-center space-x-1"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden sm:inline">Sepet</span>
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Button>

            {/* Mobile menu toggle */}
            <Button 
              variant="ghost" 
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden mt-4 py-4 border-t">
            <div className="flex flex-col space-y-2">
              <a href="#" className="text-gray-700 hover:text-red-600 transition-colors py-2">Tüm Ürünler</a>
              <a href="#" className="text-gray-700 hover:text-red-600 transition-colors py-2">Elektrikli Ev Aletleri</a>
              <a href="#" className="text-gray-700 hover:text-red-600 transition-colors py-2">Spor Aletleri</a>
              <a href="#" className="text-gray-700 hover:text-red-600 transition-colors py-2">Küçük Ev Aletleri</a>
              <a href="#" className="text-gray-700 hover:text-red-600 transition-colors py-2">Oyuncak</a>
            </div>

            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mt-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Ürün ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-2"
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  variant="ghost" 
                  className="absolute right-0 top-0 h-full"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;