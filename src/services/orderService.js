import { queryFetcher } from '../api/queryFetcher';

export const orderService = {
    getShippingMethods: async () => {
        const res = await queryFetcher({ queryKey: ['/shipping-methods', { method: 'GET' }] });
        console.log('Shipping methods from API:', res);
        return res;
    },
    getStores: async () => {
        const res = await queryFetcher({ queryKey: ['/stores', { method: 'GET' }] });
        console.log('Stores from API:', res);
        return res;
    },
    createAddress: async (addressData) => {
        const res = await queryFetcher({
            queryKey: ['/addresses', {
                method: 'POST',
                body: JSON.stringify(addressData),
                headers: { 'Content-Type': 'application/json' },
            }]
        });
        console.log('Address created:', res);
        return res;
    },
    createShippingInfo: async (shippingData) => {
        const res = await queryFetcher({
            queryKey: ['/shipping-info', {
                method: 'POST',
                body: JSON.stringify(shippingData),
                headers: { 'Content-Type': 'application/json' },
            }]
        });
        console.log('Shipping info created:', res);
        return res;
    },
    confirmOrder: async (payload) => {
        // payload expected: { shipping_method_id, ...maybe address or note }
        const res = await queryFetcher({ queryKey: ['/orders/confirm', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' },
        }] });
        return res;
    },
    getOrderHistory: async () => {
        const res = await queryFetcher({ queryKey: ['/orders/my-orders', { method: 'GET' }] });
        return res;
    },
    cancelOrder: async (orderId) => {
        const res = await queryFetcher({ queryKey: [`/orders/${orderId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'cancelled' }),
        }] });
        return res;
    },
};
