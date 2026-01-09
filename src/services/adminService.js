import { queryFetcher } from '../api/queryFetcher';

export const adminService = {
    createProduct: async (formData) => {
        const token = localStorage.getItem('accessToken');
        console.log('Creating product with token');
        console.log('Sending to: https://sportmarketback.onrender.com/products');
        
        const res = await fetch('https://sportmarketback.onrender.com/products', {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        console.log('Response status:', res.status);
        console.log('Response statusText:', res.statusText);

        if (!res.ok) {
            const error = await res.json();
            console.error('Server error:', error);
            throw new Error(error.message || 'Failed to create product');
        }

        const data = await res.json();
        console.log('Product created:', data);
        return data;
    },

    getCategories: async () => {
        const res = await queryFetcher({ queryKey: ['/categories', { method: 'GET' }] });
        console.log('Categories:', res);
        return res;
    },

    getBrands: async () => {
        const res = await queryFetcher({ queryKey: ['/brands', { method: 'GET' }] });
        console.log('Brands:', res);
        return res;
    },

    getUsers: async () => {
        const res = await queryFetcher({ 
            queryKey: ['/users/', { 
                method: 'GET'
            }] 
        });
        return res;
    },

    banUser: async (userId) => {
        const res = await queryFetcher({ 
            queryKey: [`/users/ban`, { 
                method: 'PUT',
                body: JSON.stringify({ id: userId }),
            }] 
        });
        return res;
    },

    unbanUser: async (userId) => {
        const res = await queryFetcher({ 
            queryKey: [`/users/ban`, { 
                method: 'PUT',
                body: JSON.stringify({ id: userId }),
            }] 
        });
        return res;
    },

    getAllOrders: async () => {
        const res = await queryFetcher({ 
            queryKey: ['/orders/all', { 
                method: 'GET'
            }] 
        });
        return res;
    },

    updateOrderStatus: async (orderId, status) => {
        const res = await queryFetcher({ 
            queryKey: [`/orders/${orderId}/status`, { 
                method: 'PUT',
                body: JSON.stringify({ status }),
            }] 
        });
        return res;
    },

    getProducts: async () => {
        const res = await queryFetcher({ 
            queryKey: ['/products', { 
                method: 'GET'
            }] 
        });
        return res;
    },

    toggleProductEnabled: async (productId, enabled) => {
        const res = await queryFetcher({ 
            queryKey: [`/admin/products/${productId}/toggle`, { 
                method: 'PUT',
                body: JSON.stringify({ enabled }),
            }] 
        });
        return res;
    },

    updateProduct: async (productId, formData) => {
        const token = localStorage.getItem('accessToken');
        const res = await fetch(`https://sportmarketback.onrender.com/products/${productId}`, {
            method: 'PUT',
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Failed to update product');
        }

        return res.json();
    },

    deleteProduct: async (productId) => {
        const res = await queryFetcher({ 
            queryKey: [`/admin/products/${productId}`, { 
                method: 'DELETE'
            }] 
        });
        return res;
    },
};
