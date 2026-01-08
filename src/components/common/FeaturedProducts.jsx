import React from 'react';
import ProductCard from '../ui/productCard';
import { useInfiniteProducts } from '../../hooks/useProducts';

const FeaturedProducts = ({ limit = 6 }) => {
  const { data, status } = useInfiniteProducts();
  const products = data?.pages?.flatMap(p => p.products) || [];
  const items = products.slice(0, limit);

  if (status === 'loading' || status === 'pending') return <div className="text-center py-8">Завантаження...</div>;
  if (status === 'error') return <div className="text-center py-8 text-red-600">Не вдалося завантажити товари</div>;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h3 className="text-2xl font-semibold mb-6">Рекомендуємо</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {items.map(p => (
          <ProductCard key={p.id} id={p.id} name={p.name} price={p.price} old_price={p.old_price} description={p.description} url_image={p.images?.[0]?.image_url} />
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;
