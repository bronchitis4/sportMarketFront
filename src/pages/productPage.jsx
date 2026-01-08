import React, { useState, useEffect } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useProduct } from '../hooks/useProduct';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/cartSlice';

const API_BASE_URL = 'https://sportmarketback.onrender.com';

export default function ProductPage() {
    const { productId } = useParams(); 
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cartStatus = useSelector(state => state.cart.status);
    const cartError = useSelector(state => state.cart.error);
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    
    const { 
        data: product, 
        isLoading, 
        isError 
    } = useProduct(productId);
    
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState(null);
    const [mainImage, setMainImage] = useState(null);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [cartMessage, setCartMessage] = useState(''); 

    useEffect(() => {
        if (product && product.images && product.images.length > 0 && !mainImage) {
            setMainImage(product.images[0].image_url);
        }
    }, [product, mainImage]); 

    if (isLoading) {
        return <div className="text-center p-20 text-xl text-gray-700">Завантаження товару...</div>;
    }

    if (isError || !product) {
        return (
            <div className="text-center p-20 bg-red-50 border-red-200 border rounded-lg m-10">
                <h2 className="text-2xl font-semibold text-red-600">Помилка: Товар не знайдено</h2>
                <p className="text-gray-600 mt-2">Перевірте ID товару або спробуйте пізніше.</p>
            </div>
        );
    }
    
    // --- Допоміжні функції ---
    const formatPrice = (price) => `${parseFloat(price).toFixed(2).replace('.', ',')} ₴`;

    // Функція для додавання в кошик
    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        
        setIsAddingToCart(true);
        setCartMessage('');
        
        try {
            await dispatch(addToCart({ 
                product_id: parseInt(productId), 
                quantity 
            })).unwrap();
            
            setCartMessage('✓ Товар успішно додано в кошик!');
            setQuantity(1);
            
            // Автоматично приховати повідомлення через 3 секунди
            setTimeout(() => setCartMessage(''), 3000);
        } catch (error) {
            setCartMessage('✗ Помилка при додаванні в кошик. Спробуйте ще раз.');
            console.error('Cart error:', error);
        } finally {
            setIsAddingToCart(false);
        }
    };

    // --- Основний рендеринг товару ---
    const {
        name, description, price, old_price, images, brand_id, category, brand
    } = product;
    
    const displayImage = mainImage 
        ? (mainImage.startsWith('http') ? mainImage : `${API_BASE_URL}/${mainImage}`) 
        : (images && images.length > 0 
            ? (images[0].image_url.startsWith('http') ? images[0].image_url : `${API_BASE_URL}/${images[0].image_url}`) 
            : 'https://prof1group.ua/images/categories/86e68a7314be8fb072c50e4890ca0ddded57e3fd.jpg');
    
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pb-16">
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/2 sticky top-20">
                    <img
                        src={displayImage}
                        alt={name}
                        className="w-full h-auto object-cover rounded-lg shadow-lg aspect-square mb-4"
                    />

                    <div className="flex gap-3 overflow-x-auto p-1">
                        {images.map((img, index) => (
                            <img
                                key={index}
                                src={img.image_url.startsWith('http') ? img.image_url : `${API_BASE_URL}/${img.image_url}`}
                                alt={`${name} ${index + 1}`}
                                className={`w-20 h-20 object-cover rounded-md cursor-pointer transition-shadow 
                                    ${img.image_url === mainImage ? 'ring-2 ring-blue-500 shadow-md' : 'hover:shadow-md'}`}
                                onClick={() => setMainImage(img.image_url)}
                            />
                        ))}
                    </div>
                </div>

                <div className="lg:w-1/2 p-4">
                    <p className="text-sm text-gray-500 mb-2">Бренд: {brand.name}</p>
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{name}</h1>
                    
                    <p className="text-gray-700 mb-6 leading-relaxed">{description}</p>

                    <div className="mb-8 flex items-center gap-4">
                        <span className="text-4xl font-bold text-red-600">
                            {formatPrice(price)}
                        </span>
                        {old_price && parseFloat(old_price) > parseFloat(price) && (
                            <span className="text-xl text-gray-500 line-through">
                                {formatPrice(old_price)}
                            </span>
                        )}
                    </div>

                    {(() => {
                        const availableSizes = [
                            ...(product.clothing_sizes || []),
                            ...(product.shoe_sizes || [])
                        ];
                        const hasSizes = availableSizes.length > 0;

                        if (!hasSizes) return null;

                        return (
                            <div className="mb-8 border-t border-gray-200 pt-6">
                                <h3 className="text-md font-semibold text-gray-800 mb-3">
                                    Оберіть розмір
                                    <span className="text-red-500 ml-1">*</span>
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {availableSizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-4 py-2 border rounded-lg font-medium transition-colors cursor-pointer ${
                                                selectedSize === size
                                                    ? 'bg-blue-600 text-white border-blue-600'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600 hover:bg-blue-50'
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        );
                    })()}

                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                            <input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === '' || val === '0') {
                                        setQuantity('');
                                    } else {
                                        setQuantity(parseInt(val) || 1);
                                    }
                                }}
                                onBlur={(e) => {
                                    if (e.target.value === '' || parseInt(e.target.value) < 1) {
                                        setQuantity(1);
                                    }
                                }}
                                className="w-20 p-2 border border-gray-300 rounded-md text-center focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <button
                                onClick={handleAddToCart}
                                disabled={isAddingToCart}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors transform hover:scale-[1.01] disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                {isAddingToCart ? 'Додавання...' : 'Додати в кошик'}
                            </button>
                        </div>
                        
                        {/* Повідомлення про додавання */}
                        {cartMessage && (
                            <div className={`p-3 rounded-md text-center font-semibold ${
                                cartMessage.includes('✓') 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                            }`}>
                                {cartMessage}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}