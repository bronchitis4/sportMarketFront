import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchShippingMethods, fetchStores, confirmOrder, clearMessage } from '../store/checkoutSlice';
import { fetchCart, clearCart } from '../store/cartSlice';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/orderService';

export default function CheckoutPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { shippingMethods, stores, fetchStatus, storesFetchStatus, confirmStatus, message, error, storesError } = useSelector(state => state.checkout);
    const { items } = useSelector(state => state.cart);
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [selectedStore, setSelectedStore] = useState(null);
    const [shippingAddressId, setShippingAddressId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        dispatch(fetchShippingMethods());
    }, [dispatch]);

    useEffect(() => {
        console.log('Shipping methods received:', shippingMethods);
        if (shippingMethods && shippingMethods.length > 0 && selectedMethod === null) {
            setSelectedMethod(shippingMethods[0].id);
        }
    }, [shippingMethods]);

    useEffect(() => {
        // Якщо вибрано "самовивіз", завантажуємо магазини
        const selectedMethodObj = shippingMethods.find(m => m.id === selectedMethod);
        if (selectedMethodObj && selectedMethodObj.name && selectedMethodObj.name.toLowerCase().includes('самовивіз')) {
            dispatch(fetchStores());
        }
    }, [selectedMethod, shippingMethods, dispatch]);

    const handleConfirm = async () => {
        const methodObj = shippingMethods.find(m => m.id === selectedMethod) || {};
        const shippingCost = parseFloat(methodObj.cost || 0);
        
        // Перевіряємо чи вибрано магазин для самовивізу
        const isPickupMethod = methodObj.name?.toLowerCase().includes('самовивіз');
        if (isPickupMethod && !selectedStore) {
            alert('Будь ласка, виберіть магазин для самовивізу');
            return;
        }

        setIsSubmitting(true);
        
        try {
            // 1. Спочатку створюємо замовлення
            const confirmPayload = {
                shipping_address_id: isPickupMethod ? parseInt(selectedStore, 10) : (parseInt(shippingAddressId, 10) || 0),
                shipping_method_id: selectedMethod,
                shipping_cost: shippingCost,
            };

            console.log('Creating order with payload:', confirmPayload);
            
            const orderResult = await dispatch(confirmOrder(confirmPayload));
            
            if (orderResult.type === 'checkout/confirmOrder/fulfilled') {
                const orderId = orderResult.payload?.order.id;
                
                if (orderId) {
                    // 2. Створюємо інформацію про доставку
                    const shippingInfoPayload = {
                        order_id: orderId,
                        shipping_method_id: selectedMethod,
                        shipping_cost: shippingCost,
                        store_id: isPickupMethod ? parseInt(selectedStore, 10) : undefined,
                        shipping_address_id: !isPickupMethod ? (parseInt(shippingAddressId, 10) || 0) : undefined,
                        shipping_status: 'pending',
                    };

                    console.log('Creating shipping info:', shippingInfoPayload);
                    await orderService.createShippingInfo(shippingInfoPayload);
                }
                
                dispatch(clearCart());
                alert('Замовлення успішно оформлено!');
                // navigate('/order-success');
            } else {
                alert('Помилка при оформленні замовлення');
            }
        } catch (error) {
            console.error('Order confirmation error:', error);
            alert('Помилка при оформленні замовлення: ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-20 p-6 pb-16">
            <h1 className="text-3xl font-bold mb-8 text-gray-900">Оформлення замовлення</h1>

            {fetchStatus === 'loading' && <p className="text-center text-gray-600 py-8">Завантаження способів доставки...</p>}

            {error && <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">{error}</div>}

            {message && <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">{message}</div>}

            {/* Методи доставки */}
            <div className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-gray-900">Виберіть спосіб доставки</h2>
                <div className="space-y-3">
                    {shippingMethods.map((m) => {
                        const isSelected = selectedMethod === m.id;
                        const isPickup = m.name?.toLowerCase().includes('самовивіз');
                        
                        return (
                            <div
                                key={m.id}
                                className={`border-2 rounded-lg p-4 transition-all cursor-pointer ${
                                    isSelected
                                        ? 'border-blue-600 bg-blue-50'
                                        : 'border-gray-300 hover:border-blue-400 bg-white'
                                }`}
                                onClick={() => setSelectedMethod(m.id)}
                            >
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="shipping"
                                        checked={isSelected}
                                        onChange={() => setSelectedMethod(m.id)}
                                        className="mt-1"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold text-gray-900">{m.name}</h3>
                                            <span className="text-lg font-bold text-blue-600">{(parseFloat(m.cost || 0)).toLocaleString('uk-UA')} грн</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">{m.description}</p>
                                    </div>
                                </label>

                                {/* Dropdown для магазинів, якщо вибрано самовивіз */}
                                {isSelected && isPickup && (
                                    <div className="mt-4 ml-10 pt-4 border-t border-gray-300">
                                        <label className="block mb-2 font-semibold text-gray-900">Виберіть магазин для самовивізу:</label>
                                        {storesFetchStatus === 'loading' && <p className="text-gray-600 text-sm">Завантаження магазинів...</p>}
                                        {storesError && <div className="p-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded mb-2">{storesError}</div>}
                                        {stores && stores.length > 0 ? (
                                            <select
                                                value={selectedStore || ''}
                                                onChange={(e) => setSelectedStore(e.target.value)}
                                                className="w-full p-3 border-2 border-gray-300 rounded bg-white text-gray-900 font-medium focus:border-blue-600 focus:outline-none"
                                            >
                                                <option value="">-- Виберіть магазин --</option>
                                                {stores.map((store) => (
                                                    <option key={store.id} value={store.id}>
                                                        {store.name} - {store.city}, {store.address}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <p className="text-gray-600 text-sm">Магазини не знайдені</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Інформація про недоступні методи */}
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                        <strong>Примітка:</strong> Нова Пошта та УкрПошта тимчасово недоступні. На даний момент доступна тільки доставка самовивізом з наших магазинів.
                    </p>
                </div>
            </div>

            {/* Адреса для доставки (якщо не самовивіз) */}
            {shippingMethods.find(m => m.id === selectedMethod)?.name?.toLowerCase().includes('самовивіз') === false && (
                <div className="mb-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h2 className="text-lg font-bold mb-3 text-gray-900">Адреса доставки</h2>
                    <input
                        type="number"
                        value={shippingAddressId}
                        onChange={(e) => setShippingAddressId(e.target.value)}
                        className="w-full p-3 border-2 border-gray-300 rounded bg-white text-gray-900 focus:border-blue-600 focus:outline-none"
                        placeholder="Введіть ID адреси доставки"
                    />
                </div>
            )}

            {/* Підсумок */}
            <div className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
                <h2 className="text-lg font-bold mb-4 text-gray-900">Підсумок замовлення</h2>
                <div className="space-y-3">
                    <div className="flex justify-between text-gray-700">
                        <span>Кількість товарів:</span>
                        <span className="font-semibold">{items.reduce((s, it) => s + it.quantity, 0)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                        <span>Вартість товарів:</span>
                        <span className="font-semibold">{items.reduce((s, it) => s + (parseFloat(it.product?.price || 0) * it.quantity), 0).toLocaleString('uk-UA')} грн</span>
                    </div>
                    <div className="border-t border-gray-300 pt-3 flex justify-between text-lg font-bold text-gray-900">
                        <span>Всього до оплати:</span>
                        <span className="text-blue-600">
                            {(items.reduce((s, it) => s + (parseFloat(it.product?.price || 0) * it.quantity), 0) + parseFloat(shippingMethods.find(m => m.id === selectedMethod)?.cost || 0)).toLocaleString('uk-UA')} грн
                        </span>
                    </div>
                </div>
            </div>

            {/* Кнопки */}
            <div className="flex gap-3">
                <button
                    onClick={handleConfirm}
                    disabled={confirmStatus === 'loading' || isSubmitting}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:opacity-60 cursor-pointer transition-colors"
                >
                    {isSubmitting || confirmStatus === 'loading' ? 'Оформлення...' : 'Підтвердити замовлення'}
                </button>
                <button
                    onClick={() => navigate(-1)}
                    disabled={isSubmitting}
                    className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60 cursor-pointer transition-colors"
                >
                    Повернутись
                </button>
            </div>
        </div>
    );
}
