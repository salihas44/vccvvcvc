import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Shield, LogOut, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

const AdminModal = ({ isOpen, onClose }) => {
  const [currentView, setCurrentView] = useState('login'); // 'login' or 'dashboard'
  const [admin, setAdmin] = useState(null);
  
  // Login state
  const [loginData, setLoginData] = useState({ email: 'yonetici@robosite.com', password: 'robo2025' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Dashboard state
  const [products, setProducts] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(false);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  // Reset state when modal closes/opens
  useEffect(() => {
    if (isOpen) {
      // Check if already logged in
      const savedAdmin = localStorage.getItem('roboturkiye_admin');
      if (savedAdmin) {
        try {
          const adminData = JSON.parse(savedAdmin);
          setAdmin(adminData);
          setCurrentView('dashboard');
          fetchProducts(adminData.token);
        } catch (error) {
          localStorage.removeItem('roboturkiye_admin');
          setCurrentView('login');
        }
      } else {
        setCurrentView('login');
      }
    } else {
      setError('');
    }
  }, [isOpen]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.user && data.user.role === 'admin') {
          const adminData = { token: data.access_token, user: data.user };
          setAdmin(adminData);
          localStorage.setItem('roboturkiye_admin', JSON.stringify(adminData));
          setCurrentView('dashboard');
          toast.success(`Hoş geldiniz ${data.user.name}!`);
          fetchProducts(data.access_token);
        } else {
          setError('Bu hesap admin yetkisine sahip değil!');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Giriş başarısız!');
      }
    } catch (err) {
      setError('Bağlantı hatası! Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (token) => {
    setDashboardLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/products/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      } else {
        toast.error('Ürünler yüklenirken hata oluştu!');
      }
    } catch (error) {
      toast.error('Bağlantı hatası!');
    } finally {
      setDashboardLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return;

    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${admin.token}` }
      });

      if (response.ok) {
        setProducts(products.filter(p => p._id !== productId));
        toast.success('Ürün başarıyla silindi!');
      } else {
        toast.error('Ürün silinirken hata oluştu!');
      }
    } catch (error) {
      toast.error('Bağlantı hatası!');
    }
  };

  const handleLogout = () => {
    setAdmin(null);
    localStorage.removeItem('roboturkiye_admin');
    setCurrentView('login');
    setLoginData({ email: 'yonetici@robosite.com', password: 'robo2025' });
    toast.success('Başarıyla çıkış yaptınız');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2
    }).format(price).replace('₺', '') + '₺';
  };

  const renderLoginView = () => (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="mx-auto w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-4">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Paneli</h2>
        <p className="text-gray-600">RoboTurkiye yönetici girişi</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">E-posta</Label>
          <Input
            id="email"
            type="email"
            value={loginData.email}
            onChange={(e) => setLoginData({...loginData, email: e.target.value})}
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Şifre</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={loginData.password}
              onChange={(e) => setLoginData({...loginData, password: e.target.value})}
              required
              disabled={loading}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-red-600 hover:bg-red-700"
          disabled={loading}
        >
          {loading ? 'Giriş yapılıyor...' : 'Admin Girişi'}
        </Button>
      </form>

      <div className="mt-4 text-center text-sm text-gray-600">
        <strong>Giriş Bilgileri:</strong><br />
        yonetici@robosite.com / robo2025
      </div>
    </div>
  );

  const renderDashboardView = () => (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Admin Paneli</h2>
          <p className="text-gray-600">Hoş geldiniz, {admin?.user?.name}</p>
        </div>
        <Button variant="outline" onClick={handleLogout} className="text-red-600">
          <LogOut className="h-4 w-4 mr-2" />
          Çıkış
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Toplam Ürün</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Stokta Olan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {products.filter(p => p.in_stock).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Stokta Olmayan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {products.filter(p => !p.in_stock).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Ürün Yönetimi</CardTitle>
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={() => toast.info('Ürün ekleme özelliği yakında!')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Yeni Ürün
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {dashboardLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Yükleniyor...</p>
            </div>
          ) : products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Ürün</th>
                    <th className="text-left p-2">Kategori</th>
                    <th className="text-left p-2">Fiyat</th>
                    <th className="text-left p-2">Stok</th>
                    <th className="text-left p-2">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {products.slice(0, 6).map((product) => (
                    <tr key={product._id} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        <div className="flex items-center space-x-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <div>
                            <div className="font-medium text-sm">{product.name?.substring(0, 40)}...</div>
                            <div className="text-xs text-gray-600">Puan: {product.rating}/5</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-2">
                        <Badge variant="outline">{product.category}</Badge>
                      </td>
                      <td className="p-2">
                        <div className="font-medium">{formatPrice(product.current_price)}</div>
                        {product.original_price > product.current_price && (
                          <div className="text-xs text-gray-500 line-through">
                            {formatPrice(product.original_price)}
                          </div>
                        )}
                      </td>
                      <td className="p-2">
                        <Badge className={product.in_stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {product.in_stock ? 'Stokta' : 'Stok Yok'}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toast.info('Düzenleme özelliği yakında!')}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteProduct(product._id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">Ürün bulunamadı</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Admin Panel</DialogTitle>
        </DialogHeader>
        
        {currentView === 'login' ? renderLoginView() : renderDashboardView()}
      </DialogContent>
    </Dialog>
  );
};

export default AdminModal;