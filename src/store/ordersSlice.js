import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderService } from '../services/orderService';

export const fetchOrderHistory = createAsyncThunk('orders/fetchOrderHistory', async (_, { rejectWithValue }) => {
    try {
        const data = await orderService.getOrderHistory();
        console.log('fetchOrderHistory response:', data);
        return data;
    } catch (err) {
        console.error('fetchOrderHistory error:', err);
        return rejectWithValue(err.message || 'Failed to load orders');
    }
});

export const cancelOrder = createAsyncThunk('orders/cancelOrder', async (orderId, { rejectWithValue }) => {
    try {
        const data = await orderService.cancelOrder(orderId);
        console.log('cancelOrder response:', data);
        return data;
    } catch (err) {
        console.error('cancelOrder error:', err);
        return rejectWithValue(err.message || 'Failed to cancel order');
    }
});

const initialState = {
    orders: [],
    status: 'idle',
    error: null,
    cancelStatus: 'idle',
    cancelError: null,
};

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrderHistory.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchOrderHistory.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Server returns array of orders or object with items property
                state.orders = Array.isArray(action.payload) ? action.payload : (action.payload.orders || action.payload.items || []);
            })
            .addCase(fetchOrderHistory.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(cancelOrder.pending, (state) => {
                state.cancelStatus = 'loading';
                state.cancelError = null;
            })
            .addCase(cancelOrder.fulfilled, (state, action) => {
                state.cancelStatus = 'succeeded';
                // Find and update the cancelled order
                const cancelledId = action.meta.arg;
                const idx = state.orders.findIndex(o => o.id === cancelledId);
                if (idx !== -1) {
                    state.orders[idx].status = 'cancelled';
                }
            })
            .addCase(cancelOrder.rejected, (state, action) => {
                state.cancelStatus = 'failed';
                state.cancelError = action.payload;
            });
    },
});

export default ordersSlice.reducer;
