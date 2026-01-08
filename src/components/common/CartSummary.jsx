import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

export default function CartSummary({ items }) {
    const itemsCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
    const totalPrice = useMemo(() => items.reduce((sum, item) => sum + (parseFloat(item.product?.price || 0) * item.quantity), 0), [items]);

    return (
        <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-24 border border-gray-200">
                <h2 className="text-xl font-bold mb-6 text-black">Сумарна інформація</h2>

                {/* Розрахунки */}
                <div className="space-y-4 mb-6 pb-6 border-b">
                    <div className="flex justify-between text-black">
                        <span>Кількість товарів:</span>
                        <span className="font-semibold">{itemsCount}</span>
                    </div>
                    <div className="flex justify-between text-black">
                        <span>Вартість товарів:</span>
                        <span className="font-semibold">
                            {totalPrice.toLocaleString('uk-UA')} грн
                        </span>
                    </div>
                </div>

                {/* Доставка */}
                <div className="space-y-4 mb-6 pb-6 border-b">
                    <h3 className="font-semibold text-black">Доставка</h3>
                    <p className="text-sm text-black">Вибір способу доставки буде доступний при оформленні замовлення</p>
                    <div className="p-3 bg-white rounded border text-sm">
                        <p className="text-black">Доставка розраховується при оформленні</p>
                    </div>
                </div>

                {/* Загальна сума */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-4 pb-4 border-b text-black">
                        <span className="text-lg font-bold">До оплати:</span>
                        <span className="text-2xl font-bold text-red-600">
                            {totalPrice.toLocaleString('uk-UA')} грн
                        </span>
                    </div>
                </div>

                {/* Кнопка оформлення */}
                <Link to="/checkout" className="w-full block text-center bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    Оформити замовлення
                </Link>

                {/* Повернення до каталогу */}
                <a
                    href="/catalog"
                    className="block text-center mt-4 text-blue-600 hover:underline font-semibold"
                >
                    Продовжити покупки
                </a>
            </div>
        </div>
    );
}
