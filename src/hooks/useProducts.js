import { useInfiniteQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { queryFetcher } from '../api/queryFetcher';

const PRODUCTS_PER_PAGE = 5; 
const API_BASE_URL = 'https://sportmarketback.onrender.com';

const fetchProductsPage = async ({ pageParam = 0 }) => {
    const offset = pageParam * PRODUCTS_PER_PAGE;
    
    const url = `/products?limit=${PRODUCTS_PER_PAGE}&offset=${offset}`;
    const options = { method: 'GET' };

    const queryKey = [url, options];
    const products = await queryFetcher({
        queryKey
    });

    console.log('Fetched products:', products);
    const hasNext = products.length === PRODUCTS_PER_PAGE;

    return {
        products: products,
        nextPage: hasNext ? pageParam + 1 : undefined,
    };
};

export function useInfiniteProducts() {
    return useInfiniteQuery({
        queryKey: ['infiniteProducts'],
        queryFn: fetchProductsPage, 
        getNextPageParam: (lastPage) => lastPage.nextPage,
        initialPageParam: 0,
        staleTime: 1000 * 60 * 5,
    });
}

// ===================================================================
// Hook to fetch products based on active category and brand filters from Redux
// ===================================================================
const fetchFilteredProductsPage = async ({ pageParam = 0, categoryIds = [], brandIds = [] }) => {
    const offset = pageParam * PRODUCTS_PER_PAGE;
    
    // Build URL with category filters if present (without brand filters - we'll filter on front-end)
    let url = `/products?limit=${PRODUCTS_PER_PAGE}&offset=${offset}`;
    
    if (categoryIds && categoryIds.length > 0) {
        const ids = categoryIds.join(',');
        url = `/products/categories/multiple?ids=${ids}&limit=${PRODUCTS_PER_PAGE}&offset=${offset}`;
    }
    
    const options = { method: 'GET' };
    const queryKey = [url, options];
    const products = await queryFetcher({ queryKey });

    console.log('Fetched filtered products:', { url, products });
    const hasNext = products.length === PRODUCTS_PER_PAGE;

    return {
        products: products,
        nextPage: hasNext ? pageParam + 1 : undefined,
    };
};

export function useFilteredProducts() {
    // Get active category and brand filters from Redux
    const categoryIds = useSelector(state => state.filter.activeFilters.category_ids);
    const brandIds = useSelector(state => state.filter.activeFilters.brand_ids);
    const isOnSale = useSelector(state => state.filter.activeFilters.isOnSale);
    const priceMin = useSelector(state => state.filter.activeFilters.priceMin);
    const priceMax = useSelector(state => state.filter.activeFilters.priceMax);
    
    const query = useInfiniteQuery({
        queryKey: ['filteredProducts', categoryIds, brandIds],
        queryFn: ({ pageParam = 0 }) => fetchFilteredProductsPage({ pageParam, categoryIds, brandIds }),
        getNextPageParam: (lastPage) => lastPage.nextPage,
        initialPageParam: 0,
        staleTime: 1000 * 60 * 5,
    });

    // Filter products on the front-end based on brand, on-sale status, and price range
    if (query.data) {
        const filteredPages = query.data.pages.map(page => ({
            ...page,
            products: page.products.filter(product => {
                // Filter by brand
                if (brandIds && brandIds.length > 0 && !brandIds.includes(product.brand_id)) {
                    return false;
                }

                // Filter by on-sale status
                if (isOnSale && (!product.old_price || parseFloat(product.old_price) <= parseFloat(product.price))) {
                    return false;
                }

                // Filter by price range
                const price = parseFloat(product.price);
                if (price < priceMin || price > priceMax) {
                    return false;
                }

                return true;
            }),
        }));
        
        return {
            ...query,
            data: {
                ...query.data,
                pages: filteredPages,
            },
        };
    }

    return query;
}