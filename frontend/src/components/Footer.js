import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-red-500">robo.</h3>
            <p className="text-gray-300 text-sm">
              Türkiye'nin en güvenilir ev aletleri ve spor ürünleri mağazası. 
              Kaliteli ürünlerle hayatınızı kolaylaştırıyoruz.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4" />
                <span>0850 XXX XX XX</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4" />
                <span>info@roboturkiye.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4" />
                <span>İstanbul, Türkiye</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Kategoriler</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Elektrikli Ev Aletleri</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Spor Aletleri</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Küçük Ev Aletleri</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Oyuncak</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Bahçe Aletleri</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Müşteri Hizmetleri</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">İletişim</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">SSS</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Kargo Bilgileri</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">İade ve Değişim</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Garanti Koşulları</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Kurumsal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Hakkımızda</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Gizlilik Politikası</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Kullanım Şartları</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">KVKK</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Mesafeli Satış Sözleşmesi</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 robo. Tüm hakları saklıdır.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">Güvenli ödeme:</span>
              <div className="flex space-x-2">
                <div className="bg-white text-gray-900 px-2 py-1 rounded text-xs font-medium">VISA</div>
                <div className="bg-white text-gray-900 px-2 py-1 rounded text-xs font-medium">MC</div>
                <div className="bg-white text-gray-900 px-2 py-1 rounded text-xs font-medium">AMEX</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;