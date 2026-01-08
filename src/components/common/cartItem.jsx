import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import { removeFromCart, updateCartItem, setItemQuantity, fetchCart } from '../../store/cartSlice';

const API_BASE_URL = 'https://sportmarketback.onrender.com';

export default function CartItem({ item }) {
    const dispatch = useDispatch();
    const [localQuantity, setLocalQuantity] = useState(item.quantity);

    const handleUpdateQuantity = (quantity) => {
        if (quantity > 0) {
            setLocalQuantity(quantity);
            dispatch(updateCartItem({ cartItemId: item.id, quantity, size: item.size }));
        }
    };

    const handleInputChange = (val) => {
        if (val === '' || val === '0') {
            setLocalQuantity('');
        } else {
            const numVal = parseInt(val);
            if (numVal > 0) {
                setLocalQuantity(numVal);
            }
        }
    };

    const handleInputBlur = () => {
        const finalQuantity = localQuantity === '' || localQuantity < 1 ? 1 : localQuantity;
        setLocalQuantity(finalQuantity);
        if (finalQuantity !== item.quantity) {
            dispatch(updateCartItem({ cartItemId: item.id, quantity: finalQuantity, size: item.size }));
        }
    };

    const handleRemoveItem = () => {
        dispatch(removeFromCart(item.id));
    };

    return (
        <div className="border-b p-4 sm:grid sm:grid-cols-4 sm:gap-4 sm:items-center">
            {/* Інформація про товар */}
            <div className="flex gap-4 mb-4 sm:mb-0">
                <Link to={`/product/${item.product_id}`} className="shrink-0">
                    <img
                        src={
                            item.product?.images?.[0]?.image_url 
                                ? (item.product.images[0].image_url.startsWith('http') ? item.product.images[0].image_url : `${API_BASE_URL}/${item.product.images[0].image_url}`) 
                                : 'https://prof1group.ua/images/categories/86e68a7314be8fb072c50e4890ca0ddded57e3fd.jpg'
                        }
                        alt={item.product?.name}
                        className="w-20 h-20 object-cover rounded"
                    />
                </Link>
                <div className="flex-1">
                    <Link 
                        to={`/product/${item.product_id}`}
                        className="text-blue-600 hover:underline font-semibold"
                    >
                        {item.product?.name || 'Невідомий товар'}
                    </Link>
                    {item.size && (
                        <p className="text-gray-800 text-sm font-medium mt-1">
                            Розмір: <span className="text-blue-600">{item.size}</span>
                        </p>
                    )}
                    <p className="text-gray-600 text-sm">{item.product?.description}</p>
                </div>
            </div>

            {/* Ціна */}
            <div className="text-right font-semibold mb-4 sm:mb-0 text-black">
                {parseFloat(item.product?.price || 0).toLocaleString('uk-UA')} грн
            </div>

            {/* Кількість */}
            <div className="flex items-center justify-between sm:justify-end gap-2 mb-4 sm:mb-0">
                <div className="flex items-center gap-2 border border-gray-200 rounded-lg bg-white">
                    <button
                        onClick={() => handleUpdateQuantity(item.quantity - 1)}
                        className="p-1 bg-white text-black hover:bg-gray-100 transition-colors rounded-l cursor-pointer"
                        aria-label="Зменшити кількість"
                    >
                        <Minus className="w-4 h-4 text-black" />
                    </button>
                    <input
                        type="number"
                        min="1"
                        value={localQuantity}
                        onChange={(e) => handleInputChange(e.target.value)}
                        onBlur={handleInputBlur}
                        className="w-12 text-center border-0 focus:ring-0 text-gray-900 font-medium bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                        onClick={() => handleUpdateQuantity(item.quantity + 1)}
                        className="p-1 bg-white text-black hover:bg-gray-100 transition-colors rounded-r cursor-pointer"
                        aria-label="Збільшити кількість"
                    >
                        <Plus className="w-4 h-4 text-black" />
                    </button>
                </div>
            </div>

            {/* Всього */}
            <div className="flex justify-between sm:justify-end items-center gap-4">
                <span className="sm:hidden text-black">Всього:</span>
                <span className="font-bold text-black">
                    {(parseFloat(item.product?.price || 0) * item.quantity).toLocaleString('uk-UA')} грн
                </span>
                <button
                    onClick={handleRemoveItem}
                    className="text-red-600 hover:text-red-800 transition-colors p-2 cursor-pointer"
                    aria-label="Видалити товар"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
