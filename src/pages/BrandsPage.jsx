import React from 'react';
import BrandList from '../components/common/brandList';

const BrandsPage = () => {
    return (
        <main className="min-h-screen pt-16">
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-4xl font-bold text-black mb-2">Топові бренди</h1>
                    <p className="text-gray-600 mb-8">Вибір найкращих спортивних брендів</p>
                    <BrandList />
                </div>
            </section>
        </main>
    );
};

export default BrandsPage;
