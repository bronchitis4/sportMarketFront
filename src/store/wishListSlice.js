import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { queryFetcher } from '../api/queryFetcher';
import { logout } from './authSlice';

export const fetchWishList = createAsyncThunk(
  'wishList/fetchWishList',
  async (_, { rejectWithValue }) => {
    try {
      const queryKey = ['/wish-list', { method: 'GET' }];
      const data = await queryFetcher({ queryKey });
      console.log('Wish list response:', data);
      
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
      
      if (data && data.product) {
        return {
          id: data.product_id,
          wishlist_item_id: data.id,
          ...data.product,
          action: 'added'
        };
      }
      
      const state = getState();
      if (data && data.product_id) {
        return {
          id: data.product_id,
          wishlist_item_id: data.id,
          action: 'added'
        };
      }
      
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
      const state = getState();
      const wishItem = state.wishList.items.find(item => item.id === productId);
      const wishlistItemId = wishItem?.wishlist_item_id;
      
      if (!wishlistItemId) {
        throw new Error('Wish list item not found');
      }
      
      const queryKey = [`/wish-list/remove/${wishlistItemId}`, { method: 'DELETE' }];
      const data = await queryFetcher({ queryKey });
      console.log('Remove from wish list response:', data);
      return productId;
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
        if (action.payload.action === 'removed') {
          state.items = state.items.filter(item => item.id !== action.payload.id);
        } else if (action.payload.action === 'added') {
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
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(logout, (state) => {
        state.items = [];
        state.status = 'idle';
        state.error = null;
      });
  },
});

export const { clearError } = wishListSlice.actions;

export default wishListSlice.reducer;
