import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
    import { fetchCart } from '../store/cartSlice';
    import CartItemsList from '../components/common/CartItemsList';
    import CartSummary from '../components/common/CartSummary';

export default function CartPage() {
    const dispatch = useDispatch();
    const { items, total_amount, fetchStatus, error } = useSelector(state => state.cart);

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);





    if (fetchStatus === 'loading') {
        return (
            <div className="text-center mt-20 p-8">
                <p className="text-lg text-gray-600">Завантаження кошика...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center mt-20 p-8 bg-red-50 border border-red-200 rounded-lg m-4">
                <p className="text-lg text-red-600">Помилка: {error}</p>
            </div>
        );
    }

    if (!items || items.length === 0) {
        return (
            <div className="text-center mt-20 p-8">
                <h2 className="text-3xl font-semibold mb-4">Ваш кошик порожній</h2>
                <p className="text-gray-600 mb-6">Додайте товари, щоб розпочати покупки</p>
                <Link 
                    to="/catalog" 
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                    Перейти до каталогу
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pb-16">
            <h1 className="text-3xl font-bold mb-8">Кошик покупок</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                   <CartItemsList items={items} />
                   <CartSummary items={items} />
            </div>
        </div>
    );
}
