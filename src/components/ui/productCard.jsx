import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishList, removeFromWishList, fetchWishList } from '../../store/wishListSlice';
import { addToCart } from '../../store/cartSlice';

const API_BASE_URL = 'https://sportmarketback.onrender.com';

const ProductCard = ({
    id,
    url_image = "https://prof1group.ua/images/categories/86e68a7314be8fb072c50e4890ca0ddded57e3fd.jpg",
    name = "Shoes",
    price = "1000",
    old_price = null,
    description = "",
    onAdd = () => {}
}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false);
    const wishListItems = useSelector(state => state.wishList.items);
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const isInWishList = wishListItems.some(item => item.id === id);
    const isOnSale = old_price && parseFloat(old_price) > parseFloat(price);
    const discount = isOnSale ? Math.round((1 - parseFloat(price) / parseFloat(old_price)) * 100) : 0;

    const handleWishListToggle = async (e) => {
        e.stopPropagation();
        e.preventDefault();
        
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        
        if (isLoading) return; // Запобігаємо множним кликам
        
        setIsLoading(true);
        try {
            if (isInWishList) {
                await dispatch(removeFromWishList(id)).unwrap();
            } else {
                await dispatch(addToWishList(id)).unwrap();
                // Перез-завантажуємо wish list щоб отримати повні дані продукту
                await dispatch(fetchWishList()).unwrap();
            }
        } catch (error) {
            console.error('Wish list error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddToCart = async (e) => {
        e.stopPropagation();
        e.preventDefault();
        
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        
        if (addingToCart) return;
        
        setAddingToCart(true);
        try {
            await dispatch(addToCart({ 
                product_id: id, 
                quantity: 1 
            })).unwrap();
            // Навігуємо на сторінку товара для подробных
            navigate(`/product/${id}`);
        } catch (error) {
            console.error('Cart error:', error);
        } finally {
            setAddingToCart(false);
        }
    };
    return (
        // use `group` so we can reveal the footer on hover; make `relative` and `overflow-visible` so overlay doesn't push siblings
        <div className="w-full rounded-lg bg-white shadow-md hover:shadow-xl cursor-pointer flex flex-col justify-between group relative overflow-visible transition-shadow">
            {/* Акційний бейдж */}
            {isOnSale && (
                <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-red-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold z-20">
                    -{discount}%
                </div>
            )}
            {/* Clickable area that navigates to product page */}
            <Link to={`/product/${id}`} className="no-underline text-inherit">
                <div className='w-full overflow-hidden'>
                    <img
                        src={url_image ? (url_image.startsWith('http') ? url_image : `${API_BASE_URL}/${url_image}`) : "https://prof1group.ua/images/categories/86e68a7314be8fb072c50e4890ca0ddded57e3fd.jpg"}
                        className='w-full h-32 sm:h-40 md:h-44 object-cover transition-transform duration-500 group-hover:scale-105'
                        alt={name}
                    />
                </div>

                {/* Wish list heart icon */}
                <button
                    onClick={handleWishListToggle}
                    disabled={isLoading}
                    className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-white rounded-full p-1.5 sm:p-2 shadow-md hover:shadow-lg transition-all z-20 cursor-pointer hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={isInWishList ? "Remove from wish list" : "Add to wish list"}
                >
                    <svg className={`w-4 sm:w-5 h-4 sm:h-5 transition-colors ${isInWishList ? 'fill-red-600 text-red-600' : 'text-gray-400'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                </button>

                <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                    <div className="font-bold text-black text-base sm:text-lg md:text-xl line-clamp-2 mb-1 sm:mb-2">{name}</div>
                    <p className="text-gray-600 text-xs sm:text-sm max-h-10 sm:max-h-16 overflow-hidden line-clamp-2">
                        {description}
                    </p>
                </div>

                <div className="px-3 sm:px-4 md:px-6 pt-2 sm:pt-4 pb-2">
                    {isOnSale ? (
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="inline-block line-through text-gray-500 text-xs sm:text-sm font-semibold">
                                {old_price} грн
                            </span>
                            <span className="inline-block bg-red-600 text-white rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm font-bold">
                                {price} грн
                            </span>
                        </div>
                    ) : (
                        <span className="inline-block bg-gray-200 rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold text-gray-700">
                            {price} грн
                        </span>
                    )}
                </div>
            </Link>

            {/* Footer overlay: absolute so it doesn't affect siblings; slides up on hover of this card only */}
            <div className="absolute left-0 right-0 bottom-0 transform translate-y-4 opacity-0 invisible pointer-events-none group-hover:translate-y-0 group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto transition-all duration-300 z-10">
                <div className="px-3 sm:px-4 pb-3 sm:pb-4 bg-white/90 backdrop-blur-sm rounded-b-lg">
                    <button
                        onClick={handleAddToCart}
                        disabled={addingToCart}
                        className="w-full bg-red-600 text-white py-2 sm:py-3 rounded text-center font-semibold text-sm sm:text-base hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
                        aria-label={`Додати до кошика ${name}`}
                    >
                        {addingToCart ? 'Додавання...' : 'Додати в кошик'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;