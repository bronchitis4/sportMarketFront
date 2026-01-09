import React from 'react'
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import ProductCard from './components/ui/productCard'
import ProductList from './components/common/productsList'
import BrandCard from './components/ui/brandCard'
import RegistrationBlock from './components/ui/registrationForm'
import LoginForm from './components/ui/loginForm'
import ProductPage from './pages/productPage'
import FilterSidebar from './components/layout/FiltersSidebar'
import MainPage from './pages/MainPage'
import BrandsPage from './pages/BrandsPage'
import WishListPage from './pages/WishListPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import ProfilePage from './pages/ProfilePage'
import ProtectedRoute from './components/ProtectedRoute'
import AdminPage from './pages/AdminPage'
import SalesPage from './pages/SalesPage'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, fetchBrands } from './store/filterSlice';
import { fetchWishList } from './store/wishListSlice';
import { fetchCart } from './store/cartSlice';
import { setCredentials } from './store/authSlice';

function AppContent() {
  const location = useLocation();
  const dispatch = useDispatch();
  const filterStatus = useSelector(state => state.filter.status);
  const filterError = useSelector(state => state.filter.error);
  
  
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const role = localStorage.getItem('role');
    
    if (accessToken) {
      console.log('Restoring auth from localStorage:', { accessToken: accessToken.substring(0, 20) + '...', role });
      dispatch(setCredentials({ 
        accessToken, 
        role
      }));
    }
  }, [dispatch]);
  
  
  useEffect(() => {
    if (filterStatus === 'idle') {
      dispatch(fetchCategories());
      dispatch(fetchBrands());
    }
  }, [dispatch, filterStatus]);
  
  
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      dispatch(fetchWishList());
      dispatch(fetchCart());
    }
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* If categories failed to load, show a full-page technical error banner */}
      {filterStatus === 'failed' ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white p-6">
          <div className="max-w-2xl w-full text-center">
            <h1 className="text-3xl font-extrabold text-red-600 mb-4">Технічні неполадки</h1>
            <p className="text-gray-700 mb-6">Не вдалося завантажити категорії. Адміністрація про це повідомлена.</p>
            {filterError && <pre className="text-xs text-gray-500 mb-4 whitespace-pre-wrap">{String(filterError)}</pre>}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => { dispatch(fetchCategories()); dispatch(fetchBrands()); }}
                className="px-5 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Спробувати ще раз
              </button>
              <button
                onClick={() => { window.location.href = '/'; }}
                className="px-5 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                На головну
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <Header />
          <main className="grow">
            <Routes>
              <Route path='/' element={<MainPage />} />
              <Route path='/catalog' element={
                <div className='flex'>
                  <FilterSidebar />
                  <ProductList />
                </div>
              } />
              <Route path='/wish-list' element={<ProtectedRoute><WishListPage /></ProtectedRoute>} />
              <Route path='/cart' element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
              <Route path='/checkout' element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
              <Route path='/profile' element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path='/admin' element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
              <Route path='/registration' element={
                <RegistrationBlock />
              } />
              <Route path='/login' element={
                <LoginForm />
              } />
              <Route path='/brands' element={
                <BrandsPage />
              } />
              <Route path='/sales' element={
                <SalesPage />
              } />
              <Route path='/product/:productId' element={
                <ProductPage />
              } />
            </Routes>
          </main>
          {location.pathname !== '/admin' && <Footer />}
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App
