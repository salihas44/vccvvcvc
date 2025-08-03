import React, { useState, useEffect } from 'react';
import { LogOut, Package, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import ProductForm from './ProductForm';

const AdminDashboard = ({ admin, onLogout }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/products/`, {
        headers: {
          'Authorization': `Bearer ${admin.token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      } else {
        toast.error('Ürünler yüklenirken hata oluştu!');
      }
    } catch (error) {
      console.error('Fetch products error:', error);
      toast.error('Bağlantı hatası!');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${admin.token}`
        }
      });

      if (response.ok) {
        setProducts(products.filter(p => p._id !== productId));
        toast.success('Ürün başarıyla silindi!');
      } else {
        toast.error('Ürün silinirken hata oluştu!');
      }
    } catch (error) {
      console.error('Delete product error:', error);
      toast.error('Bağlantı hatası!');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2
    }).format(price).replace('₺', '') + '₺';
  };

  const handleProductSaved = () => {
    setShowProductForm(false);
    setEditingProduct(null);
    fetchProducts();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (showProductForm) {
    return (
      <ProductForm
        admin={admin}
        product={editingProduct}
        onSave={handleProductSaved}
        onCancel={() => {
          setShowProductForm(false);
          setEditingProduct(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Paneli</h1>
              <p className="text-gray-600">Hoş geldiniz, {admin.user.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setShowProductForm(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Yeni Ürün
              </Button>
              <Button
                variant="outline"
                onClick={onLogout}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Çıkış
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Ürün</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stokta Olan</CardTitle>
              <Package className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {products.filter(p => p.in_stock).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stokta Olmayan</CardTitle>
              <Package className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {products.filter(p => !p.in_stock).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>Ürün Yönetimi</CardTitle>
            <CardDescription>
              Tüm ürünlerinizi buradan yönetebilirsiniz
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Resim</th>
                    <th className="text-left p-4">Ürün Adı</th>
                    <th className="text-left p-4">Kategori</th>
                    <th className="text-left p-4">Fiyat</th>
                    <th className="text-left p-4">Stok</th>
                    <th className="text-left p-4">Durum</th>
                    <th className="text-left p-4">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      </td>
                      <td className="p-4">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-600">
                          Puan: {product.rating}/5
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline">
                          {product.category}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="font-medium">
                          {formatPrice(product.current_price)}
                        </div>
                        {product.original_price > product.current_price && (
                          <div className="text-sm text-gray-500 line-through">
                            {formatPrice(product.original_price)}
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <Badge 
                          className={product.in_stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                        >
                          {product.in_stock ? 'Stokta' : 'Stok Yok'}
                        </Badge>
                      </td>
                      <td className="p-4">
                        {product.badge && (
                          <Badge className="bg-red-500 text-white">
                            {product.badge}
                          </Badge>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingProduct(product);
                              setShowProductForm(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteProduct(product._id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {products.length === 0 && (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Henüz ürün yok
                  </h3>
                  <p className="text-gray-600 mb-4">
                    İlk ürününüzü eklemek için "Yeni Ürün" butonuna tıklayın
                  </p>
                  <Button
                    onClick={() => setShowProductForm(true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Yeni Ürün Ekle
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;