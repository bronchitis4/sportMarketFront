import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishList } from '../store/wishListSlice';
import ProductCard from '../components/ui/productCard';
import { Link } from 'react-router';

const WishListPage = () => {
  const dispatch = useDispatch();
  const { items, status } = useSelector(state => state.wishList);

  useEffect(() => {
    dispatch(fetchWishList());
  }, [dispatch]);

  if (status === 'loading' || status === 'pending') {
    return <div className="text-center mt-20 p-8">Завантаження вішліста...</div>;
  }

  if (status === 'failed') {
    return <div className="text-center mt-20 p-8 text-red-600">Не вдалося завантажити вішліст</div>;
  }

  if (items.length === 0) {
    return (
      <div className="text-center mt-20 p-8">
        <h2 className="text-2xl font-semibold mb-4">Вішліст порожній</h2>
        <p className="text-gray-600 mb-6">Додайте улюблені товари, щоб вони опинилися тут</p>
        <Link to="/catalog" className="inline-block bg-red-600 text-white px-6 py-3 rounded font-semibold">
          Перейти до каталогу
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full mt-20 px-4">
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl font-semibold mb-2">Мій вішліст</h1>
        <p className="text-gray-600">{items.length} товарів</p>
      </div>

      <div className="max-w-6xl mx-auto py-8 px-4 pb-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map(product => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              old_price={product.old_price}
              description={product.description}
              url_image={product.url_image || product.logo_image || "https://sezon.ua/image/catalog/image/easyfoto/18354/krossovki-zhenskie-kozhanye-590102-molochnye-1.jpg"}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishListPage;
