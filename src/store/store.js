import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'; 
import filterReducer from './filterSlice';
import wishListReducer from './wishListSlice';
import cartReducer from './cartSlice';
import checkoutReducer from './checkoutSlice';
import ordersReducer from './ordersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer, 
    filter: filterReducer,
    wishList: wishListReducer,
    cart: cartReducer,
    checkout: checkoutReducer,
    orders: ordersReducer,
  },
});