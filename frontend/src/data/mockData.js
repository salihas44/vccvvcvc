// Mock data for the e-commerce site
export const mockProducts = [
  {
    id: 1,
    name: "robo Uzaktan Kumandalı Isıtma ve Soğutma Ünitesi",
    image: "/api/placeholder/300/300",
    originalPrice: 7759.00,
    currentPrice: 5319.00,
    rating: 5,
    badge: "40% İNDİRİM",
    category: "ev-aletleri"
  },
  {
    id: 2,
    name: "robo Ultra 1.90 Bar 88W Yüksek Basınçlı Yıkama Makinesi",
    image: "/api/placeholder/300/300",
    originalPrice: 1699.00,
    currentPrice: 1699.00,
    rating: 3,
    badge: null,
    category: "ev-aletleri"
  },
  {
    id: 3,
    name: "robo Turbo 1 Şarjlı 70 Bar Yüksek Basınçlı Oto Yıkama ve Sulama",
    image: "/api/placeholder/300/300",
    originalPrice: 1599.00,
    currentPrice: 1599.00,
    rating: 5,
    badge: "40% İNDİRİM",
    category: "ev-aletleri"
  },
  {
    id: 4,
    name: "robo Yüksek Basınçlı Yıkama Makinesi",
    image: "/api/placeholder/300/300",
    originalPrice: 4599.00,
    currentPrice: 4599.00,
    rating: 5,
    badge: "YENİ",
    category: "ev-aletleri"
  },
  {
    id: 5,
    name: "robo Şarjlı Çim Biçme Makinesi",
    image: "/api/placeholder/300/300",
    originalPrice: 1699.00,
    currentPrice: 1699.00,
    rating: 5,
    badge: null,
    category: "bahce"
  },
  {
    id: 6,
    name: "robo Katlanır Çamaşır Makinesi 10 Litre",
    image: "/api/placeholder/300/300",
    originalPrice: 2499.00,
    currentPrice: 1499.00,
    rating: 5,
    badge: "40% İNDİRİM",
    category: "ev-aletleri"
  },
  {
    id: 7,
    name: "robo Süt köpürtücülü Espresso Latte Cappuccino Americano Kahve",
    image: "/api/placeholder/300/300",
    originalPrice: 5499.00,
    currentPrice: 3299.00,
    rating: 5,
    badge: "40% İNDİRİM",
    category: "ev-aletleri"
  },
  {
    id: 8,
    name: "robo Şarjlı Taşınabilir Çamaşır Makinesi",
    image: "/api/placeholder/300/300",
    originalPrice: 1499.00,
    currentPrice: 1499.00,
    rating: 5,
    badge: "YENİ",
    category: "ev-aletleri"
  },
  {
    id: 9,
    name: "robo Müzikli Duvar Boks Padi",
    image: "/api/placeholder/300/300",
    originalPrice: 2999.00,
    currentPrice: 1650.00,
    rating: 5,
    badge: "45% İNDİRİM",
    category: "spor"
  },
  {
    id: 10,
    name: "robo Masaj Gözlüğü",
    image: "/api/placeholder/300/300",
    originalPrice: 1699.00,
    currentPrice: 1699.00,
    rating: 5,
    badge: null,
    category: "saglik"
  },
  {
    id: 11,
    name: "robo Kings 8 Litre Air Fryer Sıcak Hava Fritözü",
    image: "/api/placeholder/300/300",
    originalPrice: 1999.00,
    currentPrice: 1999.00,
    rating: 5,
    badge: "YENİ",
    category: "ev-aletleri"
  },
  {
    id: 12,
    name: "robo Katlanır Çamaşır Kurutma Makinesi",
    image: "/api/placeholder/300/300",
    originalPrice: 1999.00,
    currentPrice: 1999.00,
    rating: 5,
    badge: "KREM MOR PEMBE",
    category: "ev-aletleri"
  }
];

export const mockCategories = [
  { id: 'tum-urunler', name: 'Tüm Ürünler', slug: 'tum-urunler' },
  { id: 'elektrikli-ev-aletleri', name: 'Elektrikli Ev Aletleri', slug: 'elektrikli-ev-aletleri' },
  { id: 'spor-aletleri', name: 'Spor Aletleri', slug: 'spor-aletleri' },
  { id: 'kucuk-ev-aletleri', name: 'Küçük Ev Aletleri', slug: 'kucuk-ev-aletleri' },
  { id: 'oyuncak', name: 'Oyuncak', slug: 'oyuncak' }
];

export const mockHeroBanners = [
  {
    id: 1,
    title: "4K Ultra HD Smart TV",
    subtitle: "Televizyon Modelleri",
    buttonText: "SİPARİŞ VER",
    image: "/api/placeholder/600/400",
    backgroundColor: "#c41e3a"
  },
  {
    id: 2,
    title: "Yüksek Basınçlı Yıkama",
    subtitle: "Temizlik Makineleri",
    buttonText: "KEŞFET",
    image: "/api/placeholder/600/400", 
    backgroundColor: "#2c5aa0"
  },
  {
    id: 3,
    title: "Spor ve Fitness",
    subtitle: "Evde Antrenman",
    buttonText: "İNCELE",
    image: "/api/placeholder/600/400",
    backgroundColor: "#228b22"
  }
];

export const mockUser = {
  id: null,
  name: '',
  email: '',
  isLoggedIn: false
};

export const mockCart = {
  items: [],
  total: 0
};