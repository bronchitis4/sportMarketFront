import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { clearCart } from '../../store/cartSlice';
import CartItem from './cartItem';

export default function CartItemsList({ items }) {
    const dispatch = useDispatch();

    const handleClearCart = useCallback(() => {
        if (window.confirm('Ви впевнені, що хочете очистити кошик?')) {
            dispatch(clearCart());
        }
    }, [dispatch]);

    return (
        <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Заголовок таблиці */}
                <div className="hidden sm:grid sm:grid-cols-4 gap-4 p-4 bg-gray-100 font-semibold text-sm">
                    <div className='text-black'>Товар</div>
                    <div className="text-right text-black">Ціна</div>
                    <div className="text-right text-black">Кількість</div>
                    <div className="text-right text-black">Всього</div>
                </div>

                {/* Товари в кошику */}
                {items.map((item) => (
                    <CartItem key={item.id} item={item} />
                ))}
            </div>

            {/* Кнопка очищення кошика */}
            <div className="mt-4">
                <button
                    onClick={handleClearCart}
                    className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors font-semibold"
                >
                    Очистити кошик
                </button>
            </div>
        </div>
    );
}
