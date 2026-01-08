import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toggleOnSaleFilter } from '../store/filterSlice';
import FilterSidebar from '../components/layout/FiltersSidebar';
import ProductList from '../components/common/productsList';

export default function SalesPage() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(toggleOnSaleFilter());
        
        return () => {
            dispatch(toggleOnSaleFilter());
        };
    }, [dispatch]);

    return (
        <div className='flex'>
            <FilterSidebar />
            <ProductList />
        </div>
    );
}
