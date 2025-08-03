# Mock data for initializing the database
mockProducts = [
    {
        "name": "robo Uzaktan Kumandalı Isıtma ve Soğutma Ünitesi",
        "originalPrice": 7759.00,
        "currentPrice": 5319.00,
        "rating": 5,
        "badge": "40% İNDİRİM",
        "category": "elektrikli-ev-aletleri",
        "image": "https://images.unsplash.com/photo-1484154218962-a197022b5858?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwYXBwbGlhbmNlc3xlbnwwfHx8fDE3NTQyMTk5OTd8MA&ixlib=rb-4.1.0&q=85"
    },
    {
        "name": "robo Ultra 1.90 Bar 88W Yüksek Basınçlı Yıkama Makinesi",
        "originalPrice": 1699.00,
        "currentPrice": 1699.00,
        "rating": 3,
        "badge": None,
        "category": "elektrikli-ev-aletleri",
        "image": "https://images.unsplash.com/photo-1586208958839-06c17cacdf08?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwyfHxob21lJTIwYXBwbGlhbmNlc3xlbnwwfHx8fDE3NTQyMTk5OTd8MA&ixlib=rb-4.1.0&q=85"
    },
    {
        "name": "robo Turbo 1 Şarjlı 70 Bar Yüksek Basınçlı Oto Yıkama ve Sulama",
        "originalPrice": 1599.00,
        "currentPrice": 1599.00,
        "rating": 5,
        "badge": "40% İNDİRİM",
        "category": "elektrikli-ev-aletleri",
        "image": "https://images.unsplash.com/photo-1570222094114-d054a817e56b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwzfHxob21lJTIwYXBwbGlhbmNlc3xlbnwwfHx8fDE3NTQyMTk5OTd8MA&ixlib=rb-4.1.0&q=85"
    },
    {
        "name": "robo Yüksek Basınçlı Yıkama Makinesi",
        "originalPrice": 4599.00,
        "currentPrice": 4599.00,
        "rating": 5,
        "badge": "YENİ",
        "category": "elektrikli-ev-aletleri",
        "image": "https://images.unsplash.com/photo-1593853761096-d0423b545cf9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHw0fHxob21lJTIwYXBwbGlhbmNlc3xlbnwwfHx8fDE3NTQyMTk5OTd8MA&ixlib=rb-4.1.0&q=85"
    },
    {
        "name": "robo Şarjlı Çim Biçme Makinesi",
        "originalPrice": 1699.00,
        "currentPrice": 1699.00,
        "rating": 5,
        "badge": None,
        "category": "kucuk-ev-aletleri",
        "image": "https://images.unsplash.com/photo-1556185781-a47769abb7ee?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHw0fHxraXRjaGVuJTIwYXBwbGlhbmNlc3xlbnwwfHx8fDE3NTQyMjAwMTN8MA&ixlib=rb-4.1.0&q=85"
    },
    {
        "name": "robo Katlanır Çamaşır Makinesi 10 Litre",
        "originalPrice": 2499.00,
        "currentPrice": 1499.00,
        "rating": 5,
        "badge": "40% İNDİRİM",
        "category": "elektrikli-ev-aletleri",
        "image": "https://images.pexels.com/photos/213162/pexels-photo-213162.jpeg"
    },
    {
        "name": "robo Süt köpürtücülü Espresso Latte Cappuccino Americano Kahve",
        "originalPrice": 5499.00,
        "currentPrice": 3299.00,
        "rating": 5,
        "badge": "40% İNDİRİM",
        "category": "kucuk-ev-aletleri",
        "image": "https://images.pexels.com/photos/1370082/pexels-photo-1370082.jpeg"
    },
    {
        "name": "robo Şarjlı Taşınabilir Çamaşır Makinesi",
        "originalPrice": 1499.00,
        "currentPrice": 1499.00,
        "rating": 5,
        "badge": "YENİ",
        "category": "elektrikli-ev-aletleri",
        "image": "https://images.pexels.com/photos/1271940/pexels-photo-1271940.jpeg"
    },
    {
        "name": "robo Müzikli Duvar Boks Padi",
        "originalPrice": 2999.00,
        "currentPrice": 1650.00,
        "rating": 5,
        "badge": "45% İNDİRİM",
        "category": "spor-aletleri",
        "image": "https://images.unsplash.com/photo-1646736009298-202d1dba28dd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBwcm9kdWN0c3xlbnwwfHx8fDE3NTQyMjAwMDN8MA&ixlib=rb-4.1.0&q=85"
    },
    {
        "name": "robo Masaj Gözlüğü",
        "originalPrice": 1699.00,
        "currentPrice": 1699.00,
        "rating": 5,
        "badge": None,
        "category": "kucuk-ev-aletleri",
        "image": "https://images.unsplash.com/photo-1634243967207-8f8a09cb578b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwyfHxzcG9ydHMlMjBwcm9kdWN0c3xlbnwwfHx8fDE3NTQyMjAwMDN8MA&ixlib=rb-4.1.0&q=85"
    },
    {
        "name": "robo Kings 8 Litre Air Fryer Sıcak Hava Fritözü",
        "originalPrice": 1999.00,
        "currentPrice": 1999.00,
        "rating": 5,
        "badge": "YENİ",
        "category": "kucuk-ev-aletleri",
        "image": "https://images.unsplash.com/photo-1653661198822-171fb20fea83?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHw0fHxzcG9ydHMlMjBwcm9kdWN0c3xlbnwwfHx8fDE3NTQyMjAwMDN8MA&ixlib=rb-4.1.0&q=85"
    },
    {
        "name": "robo Katlanır Çamaşır Kurutma Makinesi",
        "originalPrice": 1999.00,
        "currentPrice": 1999.00,
        "rating": 5,
        "badge": "KREM MOR PEMBE",
        "category": "elektrikli-ev-aletleri",
        "image": "https://images.unsplash.com/photo-1597332356827-a60ed8e19876?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwzfHxzcG9ydHMlMjBwcm9kdWN0c3xlbnwwfHx8fDE3NTQyMjAwMDN8MA&ixlib=rb-4.1.0&q=85"
    }
]