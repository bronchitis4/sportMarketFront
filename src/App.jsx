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
