// src/components/common/HierarchicalCategoryFilter.jsx
import React, { useState, useEffect } from 'react';
const CategoryNode = ({ category, onFilterChange, onParentFilterChange, activeCategoryIds, level = 0 }) => {
    const isActive = activeCategoryIds.includes(category.id);
    const paddingLeft = `${level * 1.0 + 0.5}rem`;

    const hasActiveDescendant = (node) => {
        if (!node.children || node.children.length === 0) return false;
        for (const ch of node.children) {
            if (activeCategoryIds.includes(ch.id)) return true;
            if (hasActiveDescendant(ch)) return true;
        }
        return false;
    };

    const [expanded, setExpanded] = useState(() => hasActiveDescendant(category));

    useEffect(() => {
        if (hasActiveDescendant(category)) setExpanded(true);
    }, [activeCategoryIds]);

    const isLeaf = !category.children || category.children.length === 0;

    return (
        <li className="text-sm">
            <div
                className={`flex items-center py-1 rounded-sm cursor-pointer transition-colors 
                           ${isActive && isLeaf
                                ? 'font-bold text-gray-900 bg-gray-100'
                                : 'font-normal text-gray-700 hover:bg-gray-100'
                            }`}
                style={{ paddingLeft: paddingLeft }}
            >
                
                {category.children && category.children.length > 0 ? (
                    <button
                        onClick={(e) => { e.stopPropagation(); setExpanded(prev => !prev); }}
                        className={`mr-2 text-gray-500 transform transition-transform duration-150 ${expanded ? 'rotate-90' : ''}`}
                        aria-label={expanded ? 'collapse' : 'expand'}
                    >
                        ▶
                    </button>
                ) : (
                    <span className="w-5 mr-2" />
                )}

                
                <div
                    onClick={() => {
                        if (category.children && category.children.length > 0) {
                            setExpanded(prev => !prev);
                        } else {
                            onFilterChange(category.id);
                        }
                    }}
                    className="flex-1"
                    role={category.children && category.children.length > 0 ? 'button' : undefined}
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            if (category.children && category.children.length > 0) {
                                setExpanded(prev => !prev);
                            } else {
                                onFilterChange(category.id);
                            }
                        }
                    }}
                >
                    <span>{category.name}</span>
                </div>
            </div>

            
            {category.children && category.children.length > 0 && expanded && (
                <ul className="pl-0 border-l border-gray-200">
                    {category.children.map(child => (
                        <CategoryNode
                            key={child.id}
                            category={child}
                            onFilterChange={onFilterChange}
                            onParentFilterChange={onParentFilterChange}
                            activeCategoryIds={activeCategoryIds}
                            level={level + 1}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
};

const HierarchicalCategoryFilter = ({ categories, onFilterChange, onParentFilterChange, activeCategoryIds }) => {
    const ids = activeCategoryIds || [];
    
    return (
        <div className="filter-section">
            <h3 className="text-base font-semibold mb-3 text-gray-700">Категорії</h3>
            <ul className="space-y-0.5">
                {categories.map(category => (
                    <CategoryNode 
                        key={category.id}
                        category={category}
                        onFilterChange={onFilterChange}
                        onParentFilterChange={onParentFilterChange}
                        activeCategoryIds={ids}
                    />
                ))}
            </ul>
        </div>
    );
};

export default HierarchicalCategoryFilter;