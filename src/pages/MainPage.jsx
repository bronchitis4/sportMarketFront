import React from 'react';
import { Link } from 'react-router-dom';
import FeaturedProducts from '../components/common/FeaturedProducts';
import BrandList from '../components/common/brandList';
import { ShoppingBag, Zap, Truck, HeartHandshake } from 'lucide-react';

const MainPage = () => {
  return (
    <main className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-24 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6">Спортмаркет</h1>
            <p className="text-xl mb-4 opacity-95">Все для активного способу життя</p>
            <p className="text-lg mb-8 opacity-90">Виступаєш ти профі атлетом чи починаєш з нуля — у нас є все що тобі потрібно</p>
            <div className="flex flex-wrap gap-4">
              <Link to="/catalog" className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                Почати покупки
              </Link>
              <Link to="/brands" className="inline-block border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-blue-600 transition-colors">
                Дивити бренди
              </Link>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="text-center">
              <div className="inline-block bg-white/20 backdrop-blur-sm rounded-lg p-8 border border-white/30">
                <ShoppingBag className="w-24 h-24 mx-auto text-white mb-4" />
                <p className="text-lg font-semibold">Найбільший вибір спорттоварів</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <Zap className="w-12 h-12 mx-auto text-blue-600 mb-4" />
              <h3 className="font-bold text-lg mb-2">Швидка доставка</h3>
              <p className="text-gray-600">Доставляємо по Україні за 1-3 дні</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <HeartHandshake className="w-12 h-12 mx-auto text-green-600 mb-4" />
              <h3 className="font-bold text-lg mb-2">Гарантія якості</h3>
              <p className="text-gray-600">Оригіналь 100% або повернення грошей</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <Truck className="w-12 h-12 mx-auto text-red-600 mb-4" />
              <h3 className="font-bold text-lg mb-2">Легкі повернення</h3>
              <p className="text-gray-600">30 днів на повернення без питань</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <ShoppingBag className="w-12 h-12 mx-auto text-purple-600 mb-4" />
              <h3 className="font-bold text-lg mb-2">Постійні акції</h3>
              <p className="text-gray-600">Знижки до 50% на популярні товари</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-black">Рекомендуємо</h2>
            <Link to="/catalog" className="text-blue-600 font-semibold hover:underline">Дивити все →</Link>
          </div>
          <FeaturedProducts />
        </div>
      </section>

      {/* Brands */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-black">Топові бренди</h2>
            <Link to="/brands" className="text-blue-600 font-semibold hover:underline">Дивити все →</Link>
          </div>
          <BrandList />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Готовий до активного життя?</h2>
          <p className="text-xl mb-8 opacity-95">Приєднайся до тисяч задоволених клієнтів</p>
          <Link to="/catalog" className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors">
            Розпочати покупки зараз
          </Link>
        </div>
      </section>
    </main>
  );
};

export default MainPage;
