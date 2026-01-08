import { queryFetcher } from '../api/queryFetcher';

export const adminService = {
    createProduct: async (formData, token) => {
        // FormData з файлами потрібно відправляти через звичайний fetch
        console.log('Creating product with token:', token);
        console.log('Sending to: https://sportmarketback.onrender.com/products');
        
        const res = await fetch('https://sportmarketback.onrender.com/products', {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}`,
                // Don't set Content-Type, browser will set it with boundary for multipart/form-data
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

    // Users Management
    getUsers: async (token) => {
        const res = await queryFetcher({ 
            queryKey: ['/users/', { 
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }] 
        });
        return res;
    },

    banUser: async (userId, token) => {
        const res = await queryFetcher({ 
            queryKey: [`/users/ban`, { 
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ id: userId }),
            }] 
        });
        return res;
    },

    unbanUser: async (userId, token) => {
        const res = await queryFetcher({ 
            queryKey: [`/users/ban`, { 
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ id: userId }),
            }] 
        });
        return res;
    },

    // Orders Management
    getAllOrders: async (token) => {
        const res = await queryFetcher({ 
            queryKey: ['/orders/all', { 
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }] 
        });
        return res;
    },

    updateOrderStatus: async (orderId, status, token) => {
        const res = await queryFetcher({ 
            queryKey: [`/orders/${orderId}/status`, { 
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ status }),
            }] 
        });
        return res;
    },

    // Products Management
    getProducts: async (token) => {
        const res = await queryFetcher({ 
            queryKey: ['/products', { 
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }] 
        });
        return res;
    },

    toggleProductEnabled: async (productId, enabled, token) => {
        const res = await queryFetcher({ 
            queryKey: [`/admin/products/${productId}/toggle`, { 
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ enabled }),
            }] 
        });
        return res;
    },

    updateProduct: async (productId, formData, token) => {
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

    deleteProduct: async (productId, token) => {
        const res = await queryFetcher({ 
            queryKey: [`/admin/products/${productId}`, { 
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }] 
        });
        return res;
    },
};
