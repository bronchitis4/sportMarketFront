import { Link } from 'wouter';
import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Бренд */}
          <div>
            <h3 className="text-xl font-bold text-black mb-4">SportMarket</h3>
            <p className="text-sm text-gray-600">
              Ваш надійний партнер у світі спорту
            </p>
          </div>

          {/* Покупцям */}
          <div>
            <h4 className="font-semibold mb-4 text-black">Покупцям</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/catalog" className="hover:text-black transition-colors cursor-pointer">
                  Каталог
                </Link>
              </li>
              <li>
                <Link href="/brands" className="hover:text-black transition-colors cursor-pointer">
                  Бренди
                </Link>
              </li>
              <li>
                <Link href="/sales" className="hover:text-black transition-colors cursor-pointer">
                  Акції
                </Link>
              </li>
            </ul>
          </div>

          {/* Інформація */}
          <div>
            <h4 className="font-semibold mb-4 text-black">Інформація</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-black transition-colors cursor-pointer">
                  Доставка та оплата
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition-colors cursor-pointer">
                  Повернення товару
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition-colors cursor-pointer">
                  Про нас
                </a>
              </li>
            </ul>
          </div>

          {/* Контакти */}
          <div>
            <h4 className="font-semibold mb-4 text-black">Контакти</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Email: info@sportmarket.ua</li>
              <li>Тел: +380 123 456 789</li>
              <li>Пн-Нд: 9:00 - 21:00</li>
            </ul>
          </div>
        </div>

        {/* Нижня частина */}
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
          © 2025 SportMarket. Всі права захищені.
        </div>
      </div>
    </footer>
  );
}
