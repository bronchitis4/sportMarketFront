
import { useQuery } from '@tanstack/react-query';
import { queryFetcher } from '../api/queryFetcher';

const fetchProductById = async ({ queryKey }) => {
    const [, productId] = queryKey;
    
    const endpoint = `/products/${productId}`;
    const options = { method: 'GET' }; 

    const product = await queryFetcher({ 
        queryKey: [endpoint, options] 
    });

    return product;
};

export function useProduct(productId) {
    return useQuery({
        queryKey: ['product', productId], 
        queryFn: fetchProductById,        
        enabled: !!productId,         
    });
}