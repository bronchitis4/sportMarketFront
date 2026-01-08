import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchOrderHistory, cancelOrder } from '../store/ordersSlice';
import { logout } from '../store/authSlice';
import { logoutUser } from '../services/authService';
import { Package, Calendar, DollarSign, X, LogOut } from 'lucide-react';

export default function ProfilePage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);
    const { orders, status, error, cancelStatus, cancelError } = useSelector(state => state.orders);

    useEffect(() => {
        dispatch(fetchOrderHistory());
    }, [dispatch]);

    useEffect(() => {
        console.log('Orders state:', { orders, status, error });
    }, [orders, status, error]);

    const handleCancelOrder = (orderId) => {
        if (window.confirm('Ви впевнені, що хочете скасувати це замовлення?')) {
            dispatch(cancelOrder(orderId));
        }
    };

    const handleLogout = () => {
        logoutUser()
            .then(() => {
                dispatch(logout());
                navigate('/login');
            })
            .catch((err) => {
                console.error('Logout error:', err);
                // Clear local state even if server logout fails
                dispatch(logout());
                navigate('/login');
            });
    };

    return (
        <div className="max-w-6xl mx-auto mt-20 px-4 pb-16">
            {/* Profile header */}
            <div className="mb-8">
                <div className="flex justify-between items-start mb-4">
                    <h1 className="text-3xl font-bold text-gray-900">Мій профіль</h1>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium cursor-pointer"
                    >
                        <LogOut className="w-5 h-5" />
                        Вийти
                    </button>
                </div>
                {user && (
                    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600 font-medium">Ім'я користувача</p>
                                <p className="text-lg text-gray-900 font-semibold">{user.username || 'Не вказано'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 font-medium">Email</p>
                                <p className="text-lg text-gray-900 font-semibold">{user.email || 'Не вказано'}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Order history */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Історія замовлень</h2>

                {status === 'loading' && (
                    <div className="text-center py-8">
                        <p className="text-gray-600">Завантаження замовлень...</p>
                    </div>
                )}

                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {status === 'succeeded' && (!orders || orders.length === 0) && (
                    <div className="text-center py-8 bg-gray-50 rounded">
                        <Package className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-600">У вас немає замовлень</p>
                    </div>
                )}

                {orders && orders.length > 0 && (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                                    {/* Order ID */}
                                    <div>
                                        <p className="text-sm text-gray-600">Номер замовлення</p>
                                        <p className="font-semibold text-gray-900">#{order.id}</p>
                                    </div>

                                    {/* Date */}
                                    <div className="flex items-start gap-2">
                                        <Calendar className="w-4 h-4 text-gray-500 mt-1 shrink-0" />
                                        <div>
                                            <p className="text-sm text-gray-600">Дата</p>
                                            <p className="font-semibold text-gray-900">
                                                {order.createdAt ? new Date(order.createdAt).toLocaleDateString('uk-UA') : 'N/A'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Amount */}
                                    <div className="flex items-start gap-2">
                                        <DollarSign className="w-4 h-4 text-gray-500 mt-1 shrink-0" />
                                        <div>
                                            <p className="text-sm text-gray-600">Сума</p>
                                            <p className="font-semibold text-gray-900">
                                                {(parseFloat(order.total_amount || 0)).toLocaleString('uk-UA')} грн
                                            </p>
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <p className="text-sm text-gray-600">Статус</p>
                                        <span className={`inline-block px-3 py-1 rounded text-sm font-semibold ${
                                            order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {order.status === 'confirmed' ? 'Підтверджено' :
                                             order.status === 'pending' ? 'Очікування' :
                                             order.status === 'cancelled' ? 'Скасовано' :
                                             order.status || 'Невідомо'}
                                        </span>
                                    </div>
                                </div>

                                {/* Items preview */}
                                {order.items && order.items.length > 0 && (
                                    <div className="mt-4 pt-4 border-t">
                                        <p className="text-sm text-gray-600 mb-3">Товари:</p>
                                        <div className="space-y-3">
                                            {order.items.slice(0, 2).map((item, idx) => (
                                                <div key={idx} className="flex gap-2 items-start">
                                                    {item.product?.images && item.product.images[0] && (
                                                        <img
                                                            src={item.product.images[0].image_url}
                                                            alt={item.product?.name || 'Товар'}
                                                            className="w-12 h-12 object-cover rounded"
                                                        />
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm text-gray-700 truncate">
                                                            {item.product?.name || 'Товар'} × {item.quantity}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                            {order.items.length > 2 && (
                                                <p className="text-sm text-gray-600">+ ще {order.items.length - 2} товарів</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Cancel button */}
                                {order.status !== 'cancelled' && (
                                    <div className="mt-4 pt-4 border-t flex gap-2">
                                        <button
                                            onClick={() => handleCancelOrder(order.id)}
                                            disabled={cancelStatus === 'pending'}
                                            className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium cursor-pointer"
                                        >
                                            <X className="w-4 h-4" />
                                            {cancelStatus === 'pending' ? 'Скасування...' : 'Скасувати замовлення'}
                                        </button>
                                        {cancelError && (
                                            <p className="text-xs text-red-600 self-center">{cancelError}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
