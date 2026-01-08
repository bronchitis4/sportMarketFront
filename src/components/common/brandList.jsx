import React, { useEffect } from 'react';
import BrandCard from '../ui/brandCard.jsx';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBrands, toggleBrandFilter } from '../../store/filterSlice';
import { useNavigate } from 'react-router-dom';

const BrandList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const brands = useSelector(state => state.filter.availableFilters.brands || []);
    const brandIds = useSelector(state => state.filter.activeFilters.brand_ids || []);

    useEffect(() => {
        if (!brands || brands.length === 0) {
            dispatch(fetchBrands());
        }
    }, [brands, dispatch]);

    const onBrandClick = (brandId) => {
        // Toggle brand filter and navigate to catalog to show filtered products
        dispatch(toggleBrandFilter(brandId));
        navigate('/catalog');
    };

    return (
        <div className='w-full'>
            <div className='max-w-6xl mx-auto py-12 px-4'>
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6'>
                    {brands.map(brand => (
                        <BrandCard
                            key={brand.id}
                            name={brand.name}
                            logo_url={brand.logo || brand.logo_url}
                            onClick={() => onBrandClick(brand.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default BrandList;