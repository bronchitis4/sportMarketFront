import { ShoppingCart, Heart, User, Menu } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function Header() {
  const location = useLocation(); 
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  
  const wishListItems = useSelector(state => state.wishList.items);
  const cartItems = useSelector(state => state.cart.items);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userRole = localStorage.getItem('role');
    
    setIsAuthenticated(!!token);
    setRole(userRole);
  }, []);

  const isAdmin = role === 'admin';

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishListCount = wishListItems.length;

  const navLinks = [
    { to: '/', label: 'Головна' },
    { to: '/catalog', label: 'Каталог' },
    { to: '/brands', label: 'Бренди' },
    { to: '/sales', label: 'Акції' },
  ];

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      navigate('/registration');
    }
  };

  const handleWishListClick = () => {
    if (isAuthenticated) {
      navigate('/wish-list');
    } else {
      navigate('/registration');
    }
  };

  const handleCartClick = () => {
    if (isAuthenticated) {
      navigate('/cart');
    } else {
      navigate('/registration');
    }
  };

  return (
    <header className="fixed w-full top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
              SportMarket
            </Link>

            <nav className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-100 ${
                    location.pathname === link.to ? 'text-blue-600' : 'text-gray-600'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

          </div>

          {/* Іконки справа */}
          <div className="flex items-center gap-2">
            {/* Wishlist */}
            <div className="relative">
              <button onClick={handleWishListClick} className="p-2 rounded-md hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer">
                <Heart className="w-5 h-5" />
              </button>
              {wishListCount > 0 && isAuthenticated && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                  {wishListCount}
                </span>
              )}
            </div>

            {/* Cart */}
            <div className="relative">
              <button onClick={handleCartClick} className="p-2 rounded-md hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer">
                <ShoppingCart className="w-5 h-5" />
              </button>
              {cartCount > 0 && isAuthenticated && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>

            {/* Профіль */}
            <button onClick={handleProfileClick} className="p-2 rounded-md hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer">
              <User className="w-5 h-5" />
            </button>

            {/* Адмін панель */}
            {isAuthenticated && isAdmin && (
              <button
                onClick={() => navigate('/admin')}
                className="ml-2 px-2 py-1 text-xs font-semibold bg-red-600 text-white rounded hover:bg-red-700 transition-colors cursor-pointer"
                title="Адмін панель"
              >
                Адмін
              </button>
            )}

            {/* Меню для мобільних */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md hover:bg-gray-100 text-gray-700 md:hidden transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Мобільне меню */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-200 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}