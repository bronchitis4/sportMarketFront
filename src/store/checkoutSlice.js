import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderService } from '../services/orderService';

export const fetchShippingMethods = createAsyncThunk('checkout/fetchShippingMethods', async (_, { rejectWithValue }) => {
    try {
        const data = await orderService.getShippingMethods();
        return data;
    } catch (err) {
        return rejectWithValue(err.message || 'Failed to load shipping methods');
    }
});

export const fetchStores = createAsyncThunk('checkout/fetchStores', async (_, { rejectWithValue }) => {
    try {
        const data = await orderService.getStores();
        return data;
    } catch (err) {
        return rejectWithValue(err.message || 'Failed to load stores');
    }
});

export const confirmOrder = createAsyncThunk('checkout/confirmOrder', async (payload, { rejectWithValue }) => {
    try {
        const data = await orderService.confirmOrder(payload);
        return data;
    } catch (err) {
        return rejectWithValue(err.message || 'Failed to confirm order');
    }
});

const initialState = {
    shippingMethods: [],
    stores: [],
    fetchStatus: 'idle',
    storesFetchStatus: 'idle',
    confirmStatus: 'idle',
    message: null,
    error: null,
    storesError: null,
};

const checkoutSlice = createSlice({
    name: 'checkout',
    initialState,
    reducers: {
        clearMessage(state) {
            state.message = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchShippingMethods.pending, (state) => {
                state.fetchStatus = 'loading';
                state.error = null;
            })
            .addCase(fetchShippingMethods.fulfilled, (state, action) => {
                console.log('✅ fetchShippingMethods fulfilled with:', action.payload);
                state.fetchStatus = 'succeeded';
                state.shippingMethods = action.payload || [];
            })
            .addCase(fetchShippingMethods.rejected, (state, action) => {
                console.error('❌ fetchShippingMethods failed:', action.payload);
                state.fetchStatus = 'failed';
                state.error = action.payload;
            })
            .addCase(fetchStores.pending, (state) => {
                state.storesFetchStatus = 'loading';
                state.storesError = null;
            })
            .addCase(fetchStores.fulfilled, (state, action) => {
                console.log('✅ fetchStores fulfilled with:', action.payload);
                state.storesFetchStatus = 'succeeded';
                state.stores = action.payload || [];
            })
            .addCase(fetchStores.rejected, (state, action) => {
                console.error('❌ fetchStores failed:', action.payload);
                state.storesFetchStatus = 'failed';
                state.storesError = action.payload;
            })
            .addCase(confirmOrder.pending, (state) => {
                state.confirmStatus = 'loading';
                state.error = null;
                state.message = null;
            })
            .addCase(confirmOrder.fulfilled, (state, action) => {
                state.confirmStatus = 'succeeded';
                state.message = action.payload?.message || 'Order confirmed';
            })
            .addCase(confirmOrder.rejected, (state, action) => {
                state.confirmStatus = 'failed';
                state.error = action.payload || 'Failed to confirm order';
            });
    },
});

export const { clearMessage } = checkoutSlice.actions;
export default checkoutSlice.reducer;
