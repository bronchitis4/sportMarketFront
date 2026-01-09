import { queryFetcher } from '../api/queryFetcher';

export const cartService = {
    addToCart: async (product_id, quantity = 1, size = null) => {
        const body = {
            product_id,
            quantity,
        };
        
        if (size) {
            body.size = size;
        }
        
        return queryFetcher({
            queryKey: ['/orders/cart/add', { 
                method: 'POST',
                body: JSON.stringify(body)
            }]
        });
    },

    getCart: async () => {
        return queryFetcher({
            queryKey: ['/orders/cart', { method: 'GET' }]
        });
    },

    updateCartItem: async (cartItemId, quantity, size = null) => {
        const body = { quantity };
        
        if (size) {
            body.size = size;
        }
        
        return queryFetcher({
            queryKey: [`/orders/cart/item/${cartItemId}`, { 
                method: 'PATCH',
                body: JSON.stringify(body)
            }]
        });
    },

    removeFromCart: async (cartItemId) => {
        return queryFetcher({
            queryKey: [`/orders/cart/item/${cartItemId}`, { method: 'DELETE' }]
        });
    },

    clearCart: async () => {
        return queryFetcher({
            queryKey: ['/orders/cart', { method: 'DELETE' }]
        });
    },
};
