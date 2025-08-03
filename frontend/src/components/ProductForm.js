import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { toast } from 'sonner';

const ProductForm = ({ admin, product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
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
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchCategories();
    
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        image: product.image || '',
        original_price: product.original_price || '',
        current_price: product.current_price || '',
        rating: product.rating || 5,
        category: product.category || '',
        badge: product.badge || '',
        in_stock: product.in_stock !== undefined ? product.in_stock : true
      });
    }
  }, [product]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/categories/`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Fetch categories error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = product
        ? `${BACKEND_URL}/api/admin/products/${product._id}`
        : `${BACKEND_URL}/api/admin/products`;

      const method = product ? 'PUT' : 'POST';

      const submitData = {
        ...formData,
        original_price: parseFloat(formData.original_price),
        current_price: parseFloat(formData.current_price),
        rating: parseInt(formData.rating),
        badge: formData.badge || null
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${admin.token}`
        },
        body: JSON.stringify(submitData)
      });

      if (response.ok) {
        toast.success(product ? 'Ürün güncellendi!' : 'Ürün eklendi!');
        onSave();
      } else {
        const errorData = await response.json();
        toast.error(errorData.detail || 'Hata oluştu!');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Bağlantı hatası!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={onCancel}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Geri
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">
              {product ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
            </h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Ürün Bilgileri</CardTitle>
            <CardDescription>
              Ürün detaylarını doldurun
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Ürün Adı *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="robo Ürün Adı"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Açıklama *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Ürün açıklaması..."
                      rows={4}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="image">Resim URL'si *</Label>
                    <Input
                      id="image"
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      placeholder="https://images.unsplash.com/..."
                      required
                    />
                    {formData.image && (
                      <div className="mt-2">
                        <img
                          src={formData.image}
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
                      value={formData.category} 
                      onValueChange={(value) => setFormData({...formData, category: value})}
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
                    <Label htmlFor="original_price">Orijinal Fiyat (₺) *</Label>
                    <Input
                      id="original_price"
                      type="number"
                      step="0.01"
                      value={formData.original_price}
                      onChange={(e) => setFormData({...formData, original_price: e.target.value})}
                      placeholder="1999.99"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="current_price">Güncel Fiyat (₺) *</Label>
                    <Input
                      id="current_price"
                      type="number"
                      step="0.01"
                      value={formData.current_price}
                      onChange={(e) => setFormData({...formData, current_price: e.target.value})}
                      placeholder="1499.99"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="rating">Puan (1-5)</Label>
                    <Select 
                      value={formData.rating.toString()} 
                      onValueChange={(value) => setFormData({...formData, rating: parseInt(value)})}
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
                      value={formData.badge}
                      onChange={(e) => setFormData({...formData, badge: e.target.value})}
                      placeholder="40% İNDİRİM, YENİ, vb."
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="in_stock"
                      checked={formData.in_stock}
                      onCheckedChange={(checked) => setFormData({...formData, in_stock: checked})}
                    />
                    <Label htmlFor="in_stock">Stokta mevcut</Label>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button type="button" variant="outline" onClick={onCancel}>
                  İptal
                </Button>
                <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
                  {loading ? 'Kaydediliyor...' : (product ? 'Güncelle' : 'Kaydet')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductForm;