import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { queryFetcher } from '../api/queryFetcher';

export const fetchWishList = createAsyncThunk(
  'wishList/fetchWishList',
  async (_, { rejectWithValue }) => {
    try {
      const queryKey = ['/wish-list', { method: 'GET' }];
      const data = await queryFetcher({ queryKey });
      console.log('Wish list response:', data);
      
      // Backend повертає { id, user_id, items: [...] }
      // Нам потрібен масив items, але з product даними + зберегти wish list item id для видалення
      if (data && data.items && Array.isArray(data.items)) {
        return data.items.map(item => ({
          id: item.product_id,
          wishlist_item_id: item.id,
          ...item.product
        }));
      }
      return [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addToWishList = createAsyncThunk(
  'wishList/addToWishList',
  async (productId, { getState, rejectWithValue }) => {
    try {
      const queryKey = ['/wish-list/add', { method: 'POST', body: JSON.stringify({ product_id: productId }) }];
      const data = await queryFetcher({ queryKey });
      console.log('Add to wish list response:', data);
      
      // Backend при додаванні нового item'а повертає лише { id, product_id, wishlist_id }
      // Але нам потрібні дані продукту з Redux store (вони вже завантажені з каталогу)
      if (data && data.product) {
        // Якщо backend повертає product дані
        return {
          id: data.product_id,
          wishlist_item_id: data.id,
          ...data.product,
          action: 'added'
        };
      }
      
      // Якщо backend не повернув product дані, ищемо їх у Redux
      const state = getState();
      // Шукаємо у filterSlice або інших місцях де можуть бути продукти
      // На даний момент просто повертаємо дані з backend'у з poznach що це додання
      if (data && data.product_id) {
        return {
          id: data.product_id,
          wishlist_item_id: data.id,
          action: 'added'
        };
      }
      
      // Якщо немає product, то item був видалений (toggle)
      return {
        id: productId,
        action: 'removed'
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromWishList = createAsyncThunk(
  'wishList/removeFromWishList',
  async (productId, { getState, rejectWithValue }) => {
    try {
      // productId це ID продукту, але нам потрібен wishlist_item_id для видалення
      // Знаходимо wishlist_item_id із state по productId
      const state = getState();
      const wishItem = state.wishList.items.find(item => item.id === productId);
      const wishlistItemId = wishItem?.wishlist_item_id;
      
      if (!wishlistItemId) {
        throw new Error('Wish list item not found');
      }
      
      const queryKey = [`/wish-list/remove/${wishlistItemId}`, { method: 'DELETE' }];
      const data = await queryFetcher({ queryKey });
      console.log('Remove from wish list response:', data);
      return productId; // Повертаємо productId щоб знати який item видалити
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  status: 'idle',
  error: null,
};

const wishListSlice = createSlice({
  name: 'wishList',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishList.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWishList.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload || [];
      })
      .addCase(fetchWishList.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addToWishList.fulfilled, (state, action) => {
        // Backend використовує toggle логіку: якщо товар уже є, видаляється, якщо немає - додається
        if (action.payload.action === 'removed') {
          // Видалити item
          state.items = state.items.filter(item => item.id !== action.payload.id);
        } else if (action.payload.action === 'added') {
          // Додати item якщо його ще немає
          if (action.payload && action.payload.id) {
            const exists = state.items.some(item => item.id === action.payload.id);
            if (!exists) {
              state.items.push(action.payload);
            }
          }
        }
      })
      .addCase(addToWishList.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(removeFromWishList.fulfilled, (state, action) => {
        // Remove item from local state by productId (which is returned from thunk)
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  },
});

export const { clearError } = wishListSlice.actions;

export default wishListSlice.reducer;
