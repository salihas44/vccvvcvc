import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Shield, LogOut, Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { toast } from 'sonner';

const AdminModal = ({ isOpen, onClose, onProductChange }) => {
  const [currentView, setCurrentView] = useState('login'); // 'login', 'dashboard', 'add-product'
  const [admin, setAdmin] = useState(null);
  
  // Login state
  const [loginData, setLoginData] = useState({ email: 'yonetici@robosite.com', password: 'robo2025' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Dashboard state
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(false);

  // Product form state
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    image: '',
    original_price: '',
    current_price: '',
    rating: 5,
    category: '',
    badge: '',
    in_stock: true
  });
  const [productFormLoading, setProductFormLoading] = useState(false);

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
          fetchCategories();
        } catch (error) {
          localStorage.removeItem('roboturkiye_admin');
          setCurrentView('login');
        }
      } else {
        setCurrentView('login');
      }
    } else {
      setError('');
      setCurrentView('login');
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/categories/`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

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
          fetchCategories();
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

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setProductFormLoading(true);

    try {
      const submitData = {
        ...productForm,
        original_price: parseFloat(productForm.original_price),
        current_price: parseFloat(productForm.current_price),
        rating: parseInt(productForm.rating),
        badge: productForm.badge || null
      };

      const response = await fetch(`${BACKEND_URL}/api/admin/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${admin.token}`
        },
        body: JSON.stringify(submitData)
      });

      if (response.ok) {
        const newProduct = await response.json();
        setProducts([newProduct, ...products]); // Add to beginning of list
        toast.success('Ürün başarıyla eklendi!');
        
        // Update main page products
        if (onProductChange) {
          onProductChange();
        }
        
        // Reset form
        setProductForm({
          name: '',
          description: '',
          image: '',
          original_price: '',
          current_price: '',
          rating: 5,
          category: '',
          badge: '',
          in_stock: true
        });
        setCurrentView('dashboard');
      } else {
        const errorData = await response.json();
        toast.error(errorData.detail || 'Ürün eklenirken hata oluştu!');
      }
    } catch (error) {
      toast.error('Bağlantı hatası!');
    } finally {
      setProductFormLoading(false);
    }
  };

  const [editingProduct, setEditingProduct] = useState(null);

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      image: product.image,
      original_price: product.original_price.toString(),
      current_price: product.current_price.toString(),
      rating: product.rating,
      category: product.category,
      badge: product.badge || '',
      in_stock: product.in_stock
    });
    setCurrentView('add-product');
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setProductFormLoading(true);

    try {
      const submitData = {
        ...productForm,
        original_price: parseFloat(productForm.original_price),
        current_price: parseFloat(productForm.current_price),
        rating: parseInt(productForm.rating),
        badge: productForm.badge || null
      };

      const response = await fetch(`${BACKEND_URL}/api/admin/products/${editingProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${admin.token}`
        },
        body: JSON.stringify(submitData)
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        setProducts(products.map(p => p._id === updatedProduct._id ? updatedProduct : p));
        toast.success('Ürün başarıyla güncellendi!');
        
        // Update main page products
        if (onProductChange) {
          onProductChange();
        }
        
        // Reset form and editing state
        setEditingProduct(null);
        setProductForm({
          name: '',
          description: '',
          image: '',
          original_price: '',
          current_price: '',
          rating: 5,
          category: '',
          badge: '',
          in_stock: true
        });
        setCurrentView('dashboard');
      } else {
        const errorData = await response.json();
        toast.error(errorData.detail || 'Ürün güncellenirken hata oluştu!');
      }
    } catch (error) {
      toast.error('Bağlantı hatası!');
    } finally {
      setProductFormLoading(false);
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
        
        // Update main page products
        if (onProductChange) {
          onProductChange();
        }
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

  const renderProductFormView = () => (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => {
              setCurrentView('dashboard');
              setEditingProduct(null);
              setProductForm({
                name: '',
                description: '',
                image: '',
                original_price: '',
                current_price: '',
                rating: 5,
                category: '',
                badge: '',
                in_stock: true
              });
            }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Geri
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
            </h2>
          </div>
        </div>
      </div>

      <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="productName">Ürün Adı *</Label>
              <Input
                id="productName"
                value={productForm.name}
                onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                placeholder="robo Ürün Adı"
                required
                disabled={productFormLoading}
              />
            </div>

            <div>
              <Label htmlFor="description">Açıklama *</Label>
              <Textarea
                id="description"
                value={productForm.description}
                onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                placeholder="Ürün açıklaması..."
                rows={4}
                required
                disabled={productFormLoading}
              />
            </div>

            <div>
              <Label htmlFor="image">Resim URL'si *</Label>
              <Input
                id="image"
                value={productForm.image}
                onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                placeholder="https://images.unsplash.com/..."
                required
                disabled={productFormLoading}
              />
              {productForm.image && (
                <div className="mt-2">
                  <img
                    src={productForm.image}
                    alt="Ürün önizleme"
                    className="w-24 h-24 object-cover rounded border"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="category">Kategori *</Label>
              <Select 
                value={productForm.category} 
                onValueChange={(value) => setProductForm({...productForm, category: value})}
                disabled={productFormLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Kategori seçin" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category.slug}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="originalPrice">Orijinal Fiyat (₺) *</Label>
              <Input
                id="originalPrice"
                type="number"
                step="0.01"
                value={productForm.original_price}
                onChange={(e) => setProductForm({...productForm, original_price: e.target.value})}
                placeholder="1999.99"
                required
                disabled={productFormLoading}
              />
            </div>

            <div>
              <Label htmlFor="currentPrice">Güncel Fiyat (₺) *</Label>
              <Input
                id="currentPrice"
                type="number"
                step="0.01"
                value={productForm.current_price}
                onChange={(e) => setProductForm({...productForm, current_price: e.target.value})}
                placeholder="1499.99"
                required
                disabled={productFormLoading}
              />
            </div>

            <div>
              <Label htmlFor="rating">Puan (1-5)</Label>
              <Select 
                value={productForm.rating.toString()} 
                onValueChange={(value) => setProductForm({...productForm, rating: parseInt(value)})}
                disabled={productFormLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Yıldız</SelectItem>
                  <SelectItem value="2">2 Yıldız</SelectItem>
                  <SelectItem value="3">3 Yıldız</SelectItem>
                  <SelectItem value="4">4 Yıldız</SelectItem>
                  <SelectItem value="5">5 Yıldız</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="badge">Rozet (opsiyonel)</Label>
              <Input
                id="badge"
                value={productForm.badge}
                onChange={(e) => setProductForm({...productForm, badge: e.target.value})}
                placeholder="40% İNDİRİM, YENİ, vb."
                disabled={productFormLoading}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="inStock"
                checked={productForm.in_stock}
                onCheckedChange={(checked) => setProductForm({...productForm, in_stock: checked})}
                disabled={productFormLoading}
              />
              <Label htmlFor="inStock">Stokta mevcut</Label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setCurrentView('dashboard')}
            disabled={productFormLoading}
          >
            İptal
          </Button>
          <Button 
            type="submit" 
            disabled={productFormLoading} 
            className="bg-green-600 hover:bg-green-700"
          >
            {productFormLoading ? 'Kaydediliyor...' : (editingProduct ? 'Güncelle' : 'Kaydet')}
          </Button>
        </div>
      </form>
    </div>
  );

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
              onClick={() => setCurrentView('add-product')}
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
                            onClick={() => handleEditProduct(product)}
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
        
        {currentView === 'login' ? renderLoginView() : 
         currentView === 'dashboard' ? renderDashboardView() : 
         renderProductFormView()}
      </DialogContent>
    </Dialog>
  );
};

export default AdminModal;