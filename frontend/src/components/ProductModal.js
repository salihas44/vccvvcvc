import React, { useState } from 'react';
import { X, Star, ShoppingCart, Plus, Minus } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

const ProductModal = ({ product, isOpen, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-5 w-5 ${
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
  const discountPercent = hasDiscount 
    ? Math.round((1 - product.currentPrice / product.originalPrice) * 100) 
    : 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product);
    }
    setQuantity(1);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Ürün Detayları</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
              />
              {product.badge && (
                <Badge 
                  className={`absolute top-4 left-4 text-sm font-semibold px-3 py-1 ${
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
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex mr-2">
                  {renderStars(product.rating)}
                </div>
                <span className="text-sm text-gray-600">
                  ({product.rating} / 5)
                </span>
              </div>

              {/* Price */}
              <div className="space-y-2 mb-6">
                {hasDiscount && (
                  <div className="flex items-center space-x-2">
                    <span className="text-lg text-gray-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <Badge className="bg-red-100 text-red-800 text-sm">
                      %{discountPercent} İndirim
                    </Badge>
                  </div>
                )}
                <div className="text-3xl font-bold text-red-600">
                  {formatPrice(product.currentPrice)}
                </div>
              </div>

              <Separator className="my-6" />

              {/* Features */}
              <div className="space-y-4 mb-6">
                <h3 className="font-semibold text-lg">Ürün Özellikleri</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Yüksek kalite malzemelerden üretilmiştir</li>
                  <li>• CE belgeli ve garantilidir</li>
                  <li>• Türkiye'de satış sonrası hizmet mevcuttur</li>
                  <li>• Hızlı ve güvenli kargo</li>
                </ul>
              </div>

              <Separator className="my-6" />

              {/* Quantity and Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="font-medium">Adet:</span>
                  <div className="flex items-center border rounded-lg">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-4 py-2 border-x min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={handleAddToCart}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 text-lg flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Sepete Ekle - {formatPrice(product.currentPrice * quantity)}</span>
                </Button>

                {/* Shipping Info */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-green-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium">Ücretsiz Kargo</span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">
                    500₺ ve üzeri alışverişlerde kargo bedava!
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-blue-700">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="font-medium">Aynı Gün Kargo</span>
                  </div>
                  <p className="text-sm text-blue-600 mt-1">
                    16:00'a kadar verilen siparişler aynı gün kargoda!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;