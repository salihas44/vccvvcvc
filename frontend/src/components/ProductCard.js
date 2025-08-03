import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const ProductCard = ({ product, onAddToCart, onProductClick }) => {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2
    }).format(price).replace('₺', '') + '₺';
  };

  const hasDiscount = product.originalPrice > product.currentPrice;

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group">
      <div className="relative">
        {/* Product Image */}
        <div 
          className="aspect-square bg-gray-50 cursor-pointer"
          onClick={() => onProductClick(product)}
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Badge */}
        {product.badge && (
          <Badge 
            className={`absolute top-2 left-2 text-xs font-semibold px-2 py-1 ${
              product.badge.includes('İNDİRİM') 
                ? 'bg-red-500 text-white' 
                : product.badge === 'YENİ'
                ? 'bg-green-500 text-white'
                : 'bg-orange-500 text-white'
            }`}
          >
            {product.badge}
          </Badge>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Product Name */}
        <h3 
          className="font-medium text-gray-800 text-sm line-clamp-2 mb-2 cursor-pointer hover:text-red-600 transition-colors"
          onClick={() => onProductClick(product)}
        >
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="flex mr-1">
            {renderStars(product.rating)}
          </div>
          <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            <span className="font-bold text-lg text-gray-900">
              {formatPrice(product.currentPrice)}
            </span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={() => onAddToCart(product)}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <ShoppingCart className="h-4 w-4" />
          <span>Sepete Ekle</span>
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;