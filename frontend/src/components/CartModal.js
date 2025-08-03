import React from 'react';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Separator } from './ui/separator';

const CartModal = ({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckout 
}) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2
    }).format(price).replace('₺', '') + '₺';
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.currentPrice * item.quantity), 0);
  };

  const calculateShipping = () => {
    const total = calculateTotal();
    return total > 500 ? 0 : 29.90; // Free shipping over 500₺
  };

  const total = calculateTotal();
  const shipping = calculateShipping();
  const finalTotal = total + shipping;

  if (cartItems.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Sepetim</DialogTitle>
          </DialogHeader>
          
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5zM8 16a1 1 0 100-2 1 1 0 000 2zm4 0a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Sepetiniz boş</h3>
            <p className="text-gray-600 mb-4">Alışverişe başlamak için ürün ekleyin</p>
            <Button 
              onClick={onClose}
              className="bg-red-600 hover:bg-red-700"
            >
              Alışverişe Devam Et
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Sepetim ({cartItems.length} ürün)</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                
                <div className="flex-1">
                  <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                  <p className="text-red-600 font-bold">{formatPrice(item.currentPrice)}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8"
                    onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8"
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                <div className="text-right">
                  <p className="font-bold">{formatPrice(item.currentPrice * item.quantity)}</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:text-red-700 p-1"
                    onClick={() => onRemoveItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-4 mt-4">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span>Ara Toplam</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Kargo</span>
              <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                {shipping === 0 ? "Ücretsiz" : formatPrice(shipping)}
              </span>
            </div>
            {shipping === 0 && (
              <p className="text-green-600 text-xs">🎉 Ücretsiz kargo kazandınız!</p>
            )}
            {shipping > 0 && total < 500 && (
              <p className="text-orange-600 text-xs">
                {formatPrice(500 - total)} daha ekleyin, ücretsiz kargo kazanın!
              </p>
            )}
          </div>
          
          <Separator className="my-4" />
          
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-bold">Toplam</span>
            <span className="text-lg font-bold text-red-600">{formatPrice(finalTotal)}</span>
          </div>

          <Button
            onClick={onCheckout}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3"
          >
            Siparişi Tamamla
          </Button>

          <Button
            onClick={onClose}
            variant="outline"
            className="w-full mt-2"
          >
            Alışverişe Devam Et
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CartModal;