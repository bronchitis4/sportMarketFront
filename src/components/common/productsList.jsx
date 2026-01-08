import React, { useEffect } from 'react';
import ProductCard from '../ui/productCard.jsx';
import { useFilteredProducts } from '../../hooks/useProducts.js';
import { useInView } from 'react-intersection-observer';

const ProductList = () => {

    const { ref, inView } = useInView({
        threshold: 0,
    });
    
  const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } = useFilteredProducts();
    
    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
            console.log(hasNextPage);
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (status === 'pending') {
        return <div className="text-center mt-20 p-8">Завантаження продуктів...</div>;
    }

    if (status === 'error') {
        return <div className="text-center mt-20 p-8 text-red-600">
            БАНЕР ПОМИЛКИ
        </div>;
    }

    const products = data?.pages.flatMap(page => page.products) || [];
    
    if (products.length === 0) {
        return <div className="text-center mt-20 p-8 text-gray-600">
            Товари не знайдені
            {hasNextPage && <div ref={ref} className="text-center my-10"></div>}
        </div>;
    }
    
    return (
        <div className='w-full mt-20 px-4'>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 justify-items-center'>
                {products.map(product => (
                    <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        price={product.price}
                        description={product.description}
                        url_image={product.images?.[0]?.image_url}
                        old_price={product.old_price}
                    />
                ))}
                
            </div>
            {hasNextPage && <div ref={ref} className="text-center my-10"></div>}
    </div>);
}


export default ProductList;
