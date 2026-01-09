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
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white p-6">
                <div className="max-w-2xl w-full text-center">
                    <h1 className="text-3xl font-extrabold text-red-600 mb-4">Технічні неполадки</h1>
                    <p className="text-gray-700 mb-6">Вибачте, сталася помилка при завантаженні товарів. Ми працюємо над виправленням.</p>
                    <div className="flex items-center justify-center gap-4">
                        <button
                            onClick={() => window.location.reload()}
                            className="px-5 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Спробувати ще раз
                        </button>
                        <button
                            onClick={() => { window.location.href = '/'; }}
                            className="px-5 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                        >
                            На головну
                        </button>
                    </div>
                </div>
            </div>
        );
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
