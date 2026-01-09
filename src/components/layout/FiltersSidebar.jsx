import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import HierarchicalCategoryFilter from '../common/CategoryFilter';
import { 
    setCategoryFilter, 
    setCategoryFilterExclusive,
    toggleBrandFilter, 
    toggleOnSaleFilter,
    setPriceRange,
    resetAllFilters 
} from '../../store/filterSlice'; 

const FilterSidebar = React.memo(() => {
    const dispatch = useDispatch();
    
    const { activeFilters, availableFilters } = useSelector(state => state.filter); 
    const { categories, brands } = availableFilters; 
    const { category_ids, brand_ids, isOnSale, priceMin, priceMax } = activeFilters; 

    const activeBrands = useMemo(() => 
        brands.filter(b => brand_ids.includes(b.id)),
        [brands, brand_ids]
    );
    
    const activeCategories = useMemo(() => {
        const findCategoryById = (cats, id) => {
            for (const cat of cats) {
                if (cat.id === id) return cat;
                if (cat.children && cat.children.length > 0) {
                    const found = findCategoryById(cat.children, id);
                    if (found) return found;
                }
            }
            return null;
        };
        
        return category_ids
            .map(id => findCategoryById(categories, id))
            .filter(cat => cat !== null && (!cat.children || cat.children.length === 0));
    }, [categories, category_ids]);

    const hasActiveFilters = useMemo(() => 
        category_ids.length > 0 || activeBrands.length > 0 || isOnSale || priceMin > 0 || priceMax < 100000,
        [category_ids.length, activeBrands.length, isOnSale, priceMin, priceMax]
    ); 

    const handleSetCategory = useCallback((id) => {
        dispatch(setCategoryFilter(id));
    }, [dispatch]);

    const handleSetParentCategory = useCallback((id) => {
        dispatch(setCategoryFilterExclusive(id));
    }, [dispatch]);

    const handleToggleBrand = useCallback((id) => {
        dispatch(toggleBrandFilter(id));
    }, [dispatch]);

    const handleReset = useCallback(() => {
        dispatch(resetAllFilters());
    }, [dispatch]);

    const handleToggleOnSale = useCallback(() => {
        dispatch(toggleOnSaleFilter());
    }, [dispatch]);

    const handlePriceRangeChange = useCallback((min, max) => {
        dispatch(setPriceRange({ min, max }));
    }, [dispatch]);

    const [headerHeight, setHeaderHeight] = useState(64);

    useEffect(() => {
        const headerEl = document.querySelector('header');
        if (headerEl) {
            setHeaderHeight(Math.ceil(headerEl.getBoundingClientRect().height));
        }
    }, []);

    return (
        <aside className="w-72 bg-gradient-to-b from-gray-50 to-white shadow-lg border-r border-gray-200 sticky top-16 self-start flex flex-col overflow-hidden" style={{ height: 'calc(100vh - 4rem)' }}>
            <div className="p-6 border-b border-gray-200 bg-white">
                <h2 className="text-xl font-bold text-gray-900">
                    Фільтри
                </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {hasActiveFilters && (
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl shadow-sm">
                    <h4 className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                        </svg>
                        Активні фільтри
                    </h4>
                    <div className="flex flex-wrap gap-2 mb-3">
                        
                        {activeCategories.map(cat => (
                            <span 
                                key={cat.id}
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-white text-blue-700 rounded-full border border-blue-300 cursor-pointer hover:bg-blue-50 hover:border-blue-400 transition-all shadow-sm"
                                onClick={() => handleSetCategory(cat.id)} 
                            >
                                {cat.name}
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </span>
                        ))}
                        
                        {activeBrands.map(brand => (
                            <span 
                                key={brand.id}
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-white text-blue-700 rounded-full border border-blue-300 cursor-pointer hover:bg-blue-50 hover:border-blue-400 transition-all shadow-sm"
                                onClick={() => handleToggleBrand(brand.id)}
                            >
                                {brand.name}
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </span>
                        ))}
                        
                        {isOnSale && (
                            <span 
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-white text-red-700 rounded-full border border-red-300 cursor-pointer hover:bg-red-50 hover:border-red-400 transition-all shadow-sm"
                                onClick={handleToggleOnSale}
                            >
                                Акційні
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </span>
                        )}

                        {(priceMin > 0 || priceMax < 100000) && (
                            <span 
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-white text-green-700 rounded-full border border-green-300 cursor-pointer hover:bg-green-50 hover:border-green-400 transition-all shadow-sm"
                                onClick={() => handlePriceRangeChange(0, 100000)}
                            >
                                {priceMin} - {priceMax} грн
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </span>
                        )}
                    </div>
                    <button 
                        className="w-full py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg cursor-pointer"
                        onClick={handleReset}
                    >
                        Скинути всі фільтри
                    </button>
                </div>
            )}

            <div className="space-y-6">

            {/* 1. Фільтр Категорій (Тепер ієрархічний) */}
            <HierarchicalCategoryFilter
                categories={categories}
                onFilterChange={handleSetCategory}
                onParentFilterChange={handleSetParentCategory}
                activeCategoryIds={category_ids}
            />
            
            <div className="border-b border-gray-200 pb-6">
                <h3 className="text-base font-bold mb-4 text-gray-900 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Бренд
                </h3>
                <div className="space-y-2.5 text-sm">
                    {brands.map(brand => (
                        <label key={brand.id} className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
                            <input
                                type="checkbox"
                                id={`brand-${brand.id}`}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                checked={brand_ids.includes(brand.id)}
                                onChange={() => handleToggleBrand(brand.id)}
                            />
                            <span className="ml-3 text-gray-700 group-hover:text-gray-900 font-medium">
                                {brand.name}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="border-b border-gray-200 pb-6">
                <h3 className="text-base font-bold mb-4 text-gray-900 flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                    Спеціальні пропозиції
                </h3>
                <label className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
                    <input
                        type="checkbox"
                        id="on-sale"
                        className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-2 focus:ring-red-500 cursor-pointer"
                        checked={isOnSale}
                        onChange={handleToggleOnSale}
                    />
                    <span className="ml-3 text-gray-700 group-hover:text-gray-900 font-medium">
                        Акційні товари
                    </span>
                </label>
            </div>
            
            <div className="pb-6">
                <h3 className="text-base font-bold mb-4 text-gray-900 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Ціна
                </h3>
                <div className="space-y-4">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-gray-600">
                                Від:
                            </label>
                            <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded">{priceMin} грн</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100000"
                            step="100"
                            value={priceMin}
                            onChange={(e) => {
                                const newMin = Math.min(parseInt(e.target.value), priceMax);
                                handlePriceRangeChange(newMin, priceMax);
                            }}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600 hover:accent-green-700"
                        />
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-gray-600">
                                До:
                            </label>
                            <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded">{priceMax} грн</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100000"
                            step="100"
                            value={priceMax}
                            onChange={(e) => {
                                const newMax = Math.max(parseInt(e.target.value), priceMin);
                                handlePriceRangeChange(priceMin, newMax);
                            }}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600 hover:accent-green-700"
                        />
                    </div>
                </div>
            </div>
            </div>
            </div>
        </aside>
    );
});

export default FilterSidebar;