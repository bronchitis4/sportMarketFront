// src/store/cartSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartService } from '../services/cartService';

// Async thunks
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
    try {
        const data = await cartService.getCart();
        console.log('fetchCart response:', data);
        return data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async ({ product_id, quantity = 1, size = null }, { rejectWithValue }) => {
        try {
            const data = await cartService.addToCart(product_id, quantity, size);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateCartItem = createAsyncThunk(
    'cart/updateCartItem',
    async ({ cartItemId, quantity, size = null }, { rejectWithValue }) => {
        try {
            const data = await cartService.updateCartItem(cartItemId, quantity, size);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const removeFromCart = createAsyncThunk(
    'cart/removeFromCart',
    async (cartItemId, { rejectWithValue }) => {
        try {
            const data = await cartService.removeFromCart(cartItemId);
            return { cartItemId, ...data };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const clearCart = createAsyncThunk('cart/clearCart', async (_, { rejectWithValue }) => {
    try {
        const data = await cartService.clearCart();
        return data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

const initialState = {
    items: [],
    total_amount: 0,
    // fetchStatus: for initial loading/fetching of the cart
    fetchStatus: 'idle',
    // actionStatus: for add/update/remove/clear operations
    actionStatus: 'idle',
    error: null,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setItemQuantity(state, action) {
            const { cartItemId, quantity } = action.payload;
            if (quantity <= 0) {
                state.items = state.items.filter((it) => it.id !== cartItemId);
            } else {
                const idx = state.items.findIndex((it) => it.id === cartItemId);
                if (idx !== -1) {
                    state.items[idx] = {
                        ...state.items[idx],
                        quantity,
                    };
                }
            }
            state.total_amount = state.items.reduce((sum, item) => {
                return sum + (parseFloat(item.product?.price || 0) * item.quantity);
            }, 0);
        },
    },
    extraReducers: (builder) => {
        // Fetch Cart
        builder
            .addCase(fetchCart.pending, (state) => {
                state.fetchStatus = 'loading';
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.fetchStatus = 'succeeded';
                // Сервер повертає масив картItems безпосередньо
                const cartItems = Array.isArray(action.payload) ? action.payload : action.payload.items || [];
                state.items = cartItems;
                // Розраховуємо total_amount на основі товарів
                state.total_amount = cartItems.reduce((sum, item) => {
                    return sum + (parseFloat(item.product?.price || 0) * item.quantity);
                }, 0);
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.fetchStatus = 'failed';
                state.error = action.payload;
            });

        // Add to Cart
        builder
            .addCase(addToCart.pending, (state) => {
                state.actionStatus = 'loading';
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.actionStatus = 'succeeded';
                // Після додавання сервер повертає масив всіх картItems або окремий об'єкт
                const payload = action.payload;
                if (Array.isArray(payload)) {
                    state.items = payload;
                } else if (payload.items) {
                    state.items = payload.items;
                } else {
                    // Додаємо новий елемент до масиву
                    state.items.push(payload);
                }
                // Розраховуємо total_amount
                state.total_amount = state.items.reduce((sum, item) => {
                    return sum + (parseFloat(item.product?.price || 0) * item.quantity);
                }, 0);
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.actionStatus = 'failed';
                state.error = action.payload;
            });

        // Update Cart Item
        builder
            .addCase(updateCartItem.pending, (state) => {
                state.actionStatus = 'loading';
                state.error = null;
            })
            .addCase(updateCartItem.fulfilled, (state, action) => {
                state.actionStatus = 'succeeded';
                const payload = action.payload;
                if (Array.isArray(payload)) {
                    state.items = payload;
                } else if (payload.items) {
                    state.items = payload.items;
                }
                // Розраховуємо total_amount
                state.total_amount = state.items.reduce((sum, item) => {
                    return sum + (parseFloat(item.product?.price || 0) * item.quantity);
                }, 0);
            })
            .addCase(updateCartItem.rejected, (state, action) => {
                state.actionStatus = 'failed';
                state.error = action.payload;
            });

        // Remove from Cart
        builder
            .addCase(removeFromCart.pending, (state) => {
                state.actionStatus = 'loading';
                state.error = null;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.actionStatus = 'succeeded';
                const payload = action.payload;
                if (Array.isArray(payload)) {
                    state.items = payload;
                } else if (payload.items) {
                    state.items = payload.items;
                } else {
                    // Видаляємо за ID з масиву
                    state.items = state.items.filter(item => item.id !== action.payload.cartItemId);
                }
                // Розраховуємо total_amount
                state.total_amount = state.items.reduce((sum, item) => {
                    return sum + (parseFloat(item.product?.price || 0) * item.quantity);
                }, 0);
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.actionStatus = 'failed';
                state.error = action.payload;
            });

        // Clear Cart
        builder
            .addCase(clearCart.pending, (state) => {
                state.actionStatus = 'loading';
                state.error = null;
            })
            .addCase(clearCart.fulfilled, (state) => {
                state.actionStatus = 'succeeded';
                state.items = [];
                state.total_amount = 0;
            })
            .addCase(clearCart.rejected, (state, action) => {
                state.actionStatus = 'failed';
                state.error = action.payload;
            });
    },
});

export const { setItemQuantity } = cartSlice.actions;

export default cartSlice.reducer;
