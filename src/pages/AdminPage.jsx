import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { MdInventory2, MdPeople, MdShoppingCart, MdLogout, MdExpandMore, MdExpandLess } from 'react-icons/md';

function OrderStoreDropdown({ storeName, storeAddress, storeCity, orders, onStatusChange, isLoading }) {
    const [isOpen, setIsOpen] = useState(false);
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden">
            {/* Header дропдауна */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-between transition"
            >
                <div className="text-left">
                    <div className="text-lg">{storeName}</div>
                    <div className="text-sm text-blue-100 mt-1">
                        {storeAddress} • {storeCity} • {orders.length} замовлень(я)
                    </div>
                </div>
                {isOpen ? <MdExpandLess size={24} /> : <MdExpandMore size={24} />}
            </button>

            {/* Список замовлень */}
            {isOpen && (
                <div className="bg-gray-50 border-t border-gray-300">
                    {orders.map((order, idx) => (
                        <div key={order.id} className={idx !== orders.length - 1 ? 'border-b border-gray-300' : ''}>
                            {/* Рядок замовлення */}
                            <div
                                className="px-6 py-4 bg-white hover:bg-gray-50 cursor-pointer transition flex items-center justify-between"
                                onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <div className="font-mono text-sm text-gray-900 font-semibold">
                                                #{order.id} • {order.order_number}
                                            </div>
                                            <div className="text-xs text-gray-600 mt-1">
                                                Користувач: {order.user_id} • {order.items?.length || 0} товар(ів) • {parseFloat(order.total_amount).toFixed(2)} грн
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-600">
                                            {new Date(order.createdAt).toLocaleDateString('uk-UA')}
                                        </div>
                                        <div className="px-3 py-1 rounded-full text-xs font-semibold" style={{
                                            backgroundColor: order.status === 'completed' ? '#dcfce7' :
                                                order.status === 'pending' ? '#fef3c7' :
                                                order.status === 'cancelled' ? '#fee2e2' :
                                                order.status === 'processing' ? '#dbeafe' : '#f3f4f6',
                                            color: order.status === 'completed' ? '#166534' :
                                                order.status === 'pending' ? '#92400e' :
                                                order.status === 'cancelled' ? '#991b1b' :
                                                order.status === 'processing' ? '#1e40af' : '#374151'
                                        }}>
                                            {order.status}
                                        </div>
                                        <select
                                            value={order.status}
                                            onChange={(e) => {
                                                e.stopPropagation();
                                                onStatusChange(order.id, e.target.value);
                                            }}
                                            disabled={isLoading}
                                            className="p-1 border border-gray-300 rounded cursor-pointer disabled:opacity-60 text-xs ml-2 text-gray-900 font-medium"
                                        >
                                            <option value="pending" className="text-gray-900">Очікує</option>
                                            <option value="processing" className="text-gray-900">Обробляється</option>
                                            <option value="completed" className="text-gray-900">Завершено</option>
                                            <option value="cancelled" className="text-gray-900">Скасовано</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    {expandedOrderId === order.id ? <MdExpandLess size={20} /> : <MdExpandMore size={20} />}
                                </div>
                            </div>

                            {/* Деталі замовлення (розгортається) */}
                            {expandedOrderId === order.id && (
                                <div className="bg-blue-50 border-t border-gray-300 p-6">
                                    <h4 className="font-semibold text-gray-900 mb-4">Товари в замовленні:</h4>
                                    <div className="space-y-3">
                                        {order.items?.map((item, itemIdx) => (
                                            <div key={item.id} className="bg-white p-4 rounded-lg border border-gray-200">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <div className="font-semibold text-gray-900">
                                                            ID товару: {item.product_id}
                                                        </div>
                                                        {item.product?.name && (
                                                            <div className="text-sm text-gray-700 mt-1">
                                                                <span className="font-medium">Назва:</span> {item.product.name}
                                                            </div>
                                                        )}
                                                        <div className="text-sm text-gray-700 mt-2">
                                                            <span className="font-medium">Кількість:</span> {item.quantity} шт.
                                                        </div>
                                                        <div className="text-sm text-gray-700">
                                                            <span className="font-medium">Ціна за одиницю:</span> {parseFloat(item.unit_price).toFixed(2)} грн
                                                        </div>
                                                        <div className="text-sm font-semibold text-gray-900 mt-2">
                                                            <span className="font-medium">Сума:</span> {parseFloat(item.total_price).toFixed(2)} грн
                                                        </div>
                                                    </div>
                                                    {item.product && (
                                                        <div className="ml-4 text-right text-xs text-gray-600 bg-gray-50 p-3 rounded">
                                                            <div className="text-gray-900">Поточна ціна: <span className="font-semibold">{item.product.price} грн</span></div>
                                                            {item.product.old_price && (
                                                                <div className="text-gray-600 line-through">Стара ціна: {item.product.old_price} грн</div>
                                                            )}
                                                            <div className={`mt-2 font-semibold ${item.product.is_active ? 'text-green-600' : 'text-red-600'}`}>
                                                                {item.product.is_active ? '✓ Активний' : '✗ Неактивний'}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Інформація про доставку */}
                                    {order.shippingInfos && (
                                        <div className="mt-6 pt-6 border-t border-gray-300">
                                            <h4 className="font-semibold text-gray-900 mb-3">Інформація про доставку:</h4>
                                            <div className="bg-white p-4 rounded-lg border border-gray-200 text-sm">
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <span className="font-medium">Статус доставки:</span> {order.shippingInfos.shipping_status}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Вартість доставки:</span> {parseFloat(order.shippingInfos.shipping_cost).toFixed(2)} грн
                                                    </div>
                                                    {order.shippingInfos.tracking_number && (
                                                        <div>
                                                            <span className="font-medium">Номер відслідковування:</span> {order.shippingInfos.tracking_number}
                                                        </div>
                                                    )}
                                                    {order.shippingInfos.estimated_delivery_date && (
                                                        <div>
                                                            <span className="font-medium">Приблизна дата доставки:</span> {new Date(order.shippingInfos.estimated_delivery_date).toLocaleDateString('uk-UA')}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function AdminPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, user, accessToken } = useSelector(state => state.auth);
    const [activeTab, setActiveTab] = useState('products');
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        old_price: '',
        brand_id: '',
        category_ids: [],
        images: [],
    });

    const [imagePreview, setImagePreview] = useState([]);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        console.log('User:', user);
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        try {
            const [categoriesData, brandsData] = await Promise.all([
                adminService.getCategories(),
                adminService.getBrands(),
            ]);
            setCategories(categoriesData || []);
            setBrands(brandsData || []);

            if (activeTab === 'products') {
                await loadProducts();
            } else if (activeTab === 'users') {
                await loadUsers();
            } else if (activeTab === 'orders') {
                await loadOrders();
            }
        } catch (err) {
            console.error('Error loading data:', err);
            setError('Помилка при завантаженні даних');
        }
    };

    const loadProducts = async () => {
        try {
            const productsData = await adminService.getProducts();
            setProducts(productsData || []);
        } catch (err) {
            console.error('Error loading products:', err);
            setError('Помилка при завантаженні товарів');
        }
    };

    const loadUsers = async () => {
        try {
            const usersData = await adminService.getUsers();
            console.log('Users data:', usersData);
            console.table(usersData);
            setUsers(usersData || []);
        } catch (err) {
            console.error('Error loading users:', err);
            setError('Помилка при завантаженні користувачів');
        }
    };

    const loadOrders = async () => {
        try {
            const ordersData = await adminService.getAllOrders();
            console.log('Orders data:', ordersData);
            console.table(ordersData);
            setOrders(ordersData || []);
        } catch (err) {
            console.error('Error loading orders:', err);
            setError('Помилка при завантаженні замовлень');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCategoryChange = (categoryId) => {
        setFormData(prev => {
            const newCategories = prev.category_ids.includes(categoryId)
                ? prev.category_ids.filter(id => id !== categoryId)
                : [...prev.category_ids, categoryId];
            return {
                ...prev,
                category_ids: newCategories,
            };
        });
    };

    const handleImageUrlChange = (index, url) => {
        setFormData(prev => {
            const newImages = [...prev.images];
            newImages[index] = url;
            return {
                ...prev,
                images: newImages.filter(img => img.trim() !== ''),
            };
        });
        setImagePreview(prev => {
            const newPreviews = [...prev];
            newPreviews[index] = url;
            return newPreviews.filter(img => img.trim() !== '');
        });
    };

    const addImageUrlField = () => {
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ''],
        }));
        setImagePreview(prev => [...prev, '']);
    };

    const removeImageUrlField = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
        setImagePreview(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setError('');

        try {
            if (!formData.name || !formData.price || !formData.brand_id) {
                setError('Будь ласка, заповніть обов\'язкові поля: назва, ціна, бренд');
                setIsLoading(false);
                return;
            }

            if (formData.category_ids.length === 0) {
                setError('Будь ласка, виберіть хоча б одну категорію');
                setIsLoading(false);
                return;
            }

            if (formData.images.length === 0) {
                setError('Будь ласка, виберіть хоча б одне зображення');
                setIsLoading(false);
                return;
            }

            const productData = {
                name: formData.name,
                description: formData.description || '',
                price: formData.price,
                old_price: formData.old_price || '',
                brand_id: formData.brand_id,
                category_ids: formData.category_ids,
                image_urls: formData.images.filter(url => url.trim() !== ''),
            };

            const result = await adminService.createProduct(productData);
            console.log('Product created:', result);

            setMessage('Товар успішно додано!');
            
            setFormData({
                name: '',
                description: '',
                price: '',
                old_price: '',
                brand_id: '',
                category_ids: [],
                images: [],
            });
            setImagePreview([]);

            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            console.error('Error creating product:', err);
            setError(err.message || 'Помилка при додаванні товару');
        } finally {
            setIsLoading(false);
        }
    };

    // Users Management Functions
    const handleBanUser = async (userId, currentActiveStatus) => {
        if (!window.confirm(`Ви впевнені що хочете ${currentActiveStatus ? 'заблокувати' : 'розблокувати'} цього користувача?`)) {
            return;
        }

        try {
            setIsLoading(true);
            setError('');
            console.log(`Sending ban request for user ${userId}`);
            await adminService.banUser(userId);
            
            setMessage(`Користувач успішно ${currentActiveStatus ? 'заблокований' : 'розблокований'}!`);
            await loadUsers();
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            console.error('Error banning user:', err);
            setError(err.message || 'Помилка при блокуванні користувача');
        } finally {
            setIsLoading(false);
        }
    };

    // Orders Management Functions
    const handleChangeOrderStatus = async (orderId, newStatus) => {
        try {
            setIsLoading(true);
            setError('');
            await adminService.updateOrderStatus(orderId, newStatus);
            
            setMessage('Статус замовлення успішно оновлено!');
            await loadOrders();
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            console.error('Error updating order status:', err);
            setError(err.message || 'Помилка при оновленні статусу замовлення');
        } finally {
            setIsLoading(false);
        }
    };

    // Products Management Functions
    const handleDeleteProduct = async (productId) => {
        if (!window.confirm('Ви впевнені що хочете видалити цей товар?')) {
            return;
        }

        try {
            setIsLoading(true);
            setError('');
            await adminService.deleteProduct(productId);
            
            setMessage('Товар успішно видалено!');
            await loadProducts();
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            console.error('Error deleting product:', err);
            setError(err.message || 'Помилка при видаленні товару');
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleProduct = async (productId, currentState) => {
        try {
            setIsLoading(true);
            setError('');
            await adminService.toggleProductEnabled(productId, !currentState);
            
            setMessage(`Товар успішно ${!currentState ? 'активовано' : 'деактивовано'}!`);
            await loadProducts();
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            console.error('Error toggling product:', err);
            setError(err.message || 'Помилка при зміні стану товару');
        } finally {
            setIsLoading(false);
        }
    };

    const tabs = [
        { 
            id: 'products', 
            label: 'Товари',
            icon: MdInventory2
        },
        { 
            id: 'users', 
            label: 'Користувачі',
            icon: MdPeople
        },
        { 
            id: 'orders', 
            label: 'Замовлення',
            icon: MdShoppingCart
        },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50 pt-16">
            {/* SIDEBAR */}
            <aside className="w-64 bg-white shadow-lg fixed left-0 top-16 h-full">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">CRM</h2>
                    <p className="text-sm text-gray-600 mb-8">Система управління</p>
                    
                    <nav className="space-y-2">
                        {tabs.map(tab => {
                            const IconComponent = tab.icon;
                            return (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    setMessage('');
                                    setError('');
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all cursor-pointer ${
                                    activeTab === tab.id
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <IconComponent className="text-xl" />
                                <span>{tab.label}</span>
                            </button>
                            );
                        })}
                    </nav>

                    {/* Logout Button */}
                    <div className="mt-12 pt-6 border-t border-gray-200">
                        <button
                            onClick={() => {
                                localStorage.removeItem('token');
                                navigate('/login');
                            }}
                            className="w-full flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-semibold transition-colors cursor-pointer"
                        >
                            <MdLogout className="text-xl" />
                            <span>Вийти</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="ml-64 flex-1 p-8">
                {/* HEADER */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">Адміністративна панель</h1>
                    <p className="text-gray-600 mt-2">Керуй товарами, користувачами та замовленнями</p>
                </div>

                {/* ALERTS */}
                {message && (
                    <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-r-lg">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg">
                        {error}
                    </div>
                )}

                {/* CONTENT */}
                <div>
            {activeTab === 'products' && (
                <div className="space-y-8">
                    {/* ADD PRODUCT FORM */}
                    <div className="bg-white p-8 rounded-lg shadow">
                        <h2 className="text-2xl font-bold mb-6 text-gray-900">Додавання нових товарів</h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Назва товару <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border-2 border-gray-300 rounded focus:border-blue-600 focus:outline-none text-black"
                                    placeholder="Введіть назву товару"
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Опис</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border-2 border-gray-300 rounded focus:border-blue-600 focus:outline-none text-black"
                                    placeholder="Введіть опис товару"
                                    rows="4"
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Ціна <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border-2 border-gray-300 rounded focus:border-blue-600 focus:outline-none text-black"
                                        placeholder="Введіть ціну"
                                        step="0.01"
                                        disabled={isLoading}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">Стара ціна</label>
                                    <input
                                        type="number"
                                        name="old_price"
                                        value={formData.old_price}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border-2 border-gray-300 rounded focus:border-blue-600 focus:outline-none text-black"
                                        placeholder="Введіть стару ціну"
                                        step="0.01"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Бренд <span className="text-red-600">*</span>
                                </label>
                                <select
                                    name="brand_id"
                                    value={formData.brand_id}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border-2 border-gray-300 rounded focus:border-blue-600 focus:outline-none text-black"
                                    disabled={isLoading}
                                >
                                    <option value="">-- Виберіть бренд --</option>
                                    {brands.map(brand => (
                                        <option key={brand.id} value={brand.id}>
                                            {brand.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-3">
                                    Категорії <span className="text-red-600">*</span>
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {categories.map(category => (
                                        <label key={category.id} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.category_ids.includes(category.id)}
                                                onChange={() => handleCategoryChange(category.id)}
                                                className="w-4 h-4"
                                                disabled={isLoading}
                                            />
                                            <span className="text-gray-700">{category.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    URL зображень <span className="text-red-600">*</span>
                                </label>
                                <div className="space-y-3">
                                    {formData.images.length === 0 ? (
                                        <button
                                            type="button"
                                            onClick={addImageUrlField}
                                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-semibold"
                                            disabled={isLoading}
                                        >
                                            Додати URL зображення
                                        </button>
                                    ) : (
                                        formData.images.map((url, index) => (
                                            <div key={index} className="flex gap-2">
                                                <input
                                                    type="url"
                                                    value={url}
                                                    onChange={(e) => handleImageUrlChange(index, e.target.value)}
                                                    placeholder="https://example.com/image.jpg"
                                                    className="flex-1 p-3 border-2 border-gray-300 rounded focus:border-blue-600 focus:outline-none text-black"
                                                    disabled={isLoading}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImageUrlField(index)}
                                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-semibold"
                                                    disabled={isLoading}
                                                >
                                                    Видалити
                                                </button>
                                            </div>
                                        ))
                                    )}
                                    {formData.images.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={addImageUrlField}
                                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-semibold"
                                            disabled={isLoading}
                                        >
                                            Додати ще одне зображення
                                        </button>
                                    )}
                                </div>
                                {imagePreview.length > 0 && imagePreview.some(url => url.trim() !== '') && (
                                    <div className="mt-4 grid grid-cols-4 gap-3">
                                        {imagePreview.filter(url => url.trim() !== '').map((preview, index) => (
                                            <img
                                                key={index}
                                                src={preview}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-24 object-cover rounded border border-gray-300"
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:opacity-60 cursor-pointer transition-colors"
                            >
                                {isLoading ? 'Додавання товару...' : 'Додати товар'}
                            </button>
                        </form>
                    </div>

                    {/* PRODUCTS LIST */}
                    <div className="bg-white p-8 rounded-lg shadow">
                        <h2 className="text-2xl font-bold mb-6 text-gray-900">Усі товари</h2>
                        
                        {products.length === 0 ? (
                            <p className="text-gray-600 text-center py-8">Немає товарів</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-300">
                                            <th className="text-left p-3 font-semibold text-gray-900">ID</th>
                                            <th className="text-left p-3 font-semibold text-gray-900">Назва</th>
                                            <th className="text-left p-3 font-semibold text-gray-900">Ціна</th>
                                            <th className="text-left p-3 font-semibold text-gray-900">Бренд</th>
                                            <th className="text-left p-3 font-semibold text-gray-900">Статус</th>
                                            <th className="text-left p-3 font-semibold text-gray-900">Дія</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((product) => (
                                            <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                                                <td className="p-3 text-gray-700">{product.id}</td>
                                                <td className="p-3 text-gray-700">{product.name}</td>
                                                <td className="p-3 text-gray-700">{product.price} грн</td>
                                                <td className="p-3 text-gray-700">{product.brand?.name || '-'}</td>
                                                <td className="p-3">
                                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                                        product.is_enabled 
                                                            ? 'bg-green-100 text-green-700' 
                                                            : 'bg-red-100 text-red-700'
                                                    }`}>
                                                        {product.is_enabled ? 'Активний' : 'Деактивований'}
                                                    </span>
                                                </td>
                                                <td className="p-3 flex gap-2">
                                                    <button
                                                        onClick={() => handleToggleProduct(product.id, product.is_enabled)}
                                                        disabled={isLoading}
                                                        className={`px-3 py-2 rounded-lg font-semibold text-sm cursor-pointer transition-colors ${
                                                            product.is_enabled
                                                                ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                                                                : 'bg-green-600 text-white hover:bg-green-700'
                                                        } disabled:bg-gray-400`}
                                                    >
                                                        {product.is_enabled ? 'Вимкнути' : 'Включити'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteProduct(product.id)}
                                                        disabled={isLoading}
                                                        className="px-3 py-2 bg-red-600 text-white rounded-lg font-semibold text-sm hover:bg-red-700 disabled:bg-gray-400 cursor-pointer transition-colors"
                                                    >
                                                        Видалити
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* USERS TAB */}
            {activeTab === 'users' && (
                <div className="bg-white p-8 rounded-lg shadow">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900">Управління користувачами</h2>
                    
                    {users.length === 0 ? (
                        <p className="text-gray-600 text-center py-8">Немає користувачів</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-300">
                                        <th className="text-left p-3 font-semibold text-gray-900">ID</th>
                                        <th className="text-left p-3 font-semibold text-gray-900">Email</th>
                                        <th className="text-left p-3 font-semibold text-gray-900">Ім'я</th>
                                        <th className="text-left p-3 font-semibold text-gray-900">Статус</th>
                                        <th className="text-left p-3 font-semibold text-gray-900">Дія</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="p-3 text-gray-700">{user.id}</td>
                                            <td className="p-3 text-gray-700">{user.email}</td>
                                            <td className="p-3 text-gray-700">{user.username || '-'}</td>
                                            <td className="p-3">
                                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                                    user.is_active 
                                                        ? 'bg-green-100 text-green-700' 
                                                        : 'bg-red-100 text-red-700'
                                                }`}>
                                                    {user.is_active ? 'Активний' : 'Заблокований'}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                <button
                                                    onClick={() => handleBanUser(user.id, user.is_active)}
                                                    disabled={isLoading}
                                                    className={`px-4 py-2 rounded-lg font-semibold cursor-pointer transition-colors ${
                                                        user.is_active
                                                            ? 'bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400'
                                                            : 'bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400'
                                                    }`}
                                                >
                                                    {user.is_active ? 'Заблокувати' : 'Розблокувати'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
                <div className="bg-white p-8 rounded-lg shadow">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900">Замовлення від користувачів</h2>
                    
                    {orders.length === 0 ? (
                        <p className="text-gray-600 text-center py-8">Немає замовлень</p>
                    ) : (
                        <div className="space-y-4">
                            {(() => {
                                const groupedByStore = {};
                                orders.forEach(order => {
                                    const storeName = order.shippingInfos?.store?.name || 'Без магазину';
                                    const storeId = order.shippingInfos?.store?.id || 0;
                                    const storeKey = `${storeId}-${storeName}`;
                                    
                                    if (!groupedByStore[storeKey]) {
                                        groupedByStore[storeKey] = {
                                            storeName,
                                            storeAddress: order.shippingInfos?.store?.address || '',
                                            storeCity: order.shippingInfos?.store?.city || '',
                                            orders: []
                                        };
                                    }
                                    groupedByStore[storeKey].orders.push(order);
                                });

                                return Object.entries(groupedByStore).map(([storeKey, storeData]) => (
                                    <OrderStoreDropdown
                                        key={storeKey}
                                        storeName={storeData.storeName}
                                        storeAddress={storeData.storeAddress}
                                        storeCity={storeData.storeCity}
                                        orders={storeData.orders}
                                        onStatusChange={handleChangeOrderStatus}
                                        isLoading={isLoading}
                                    />
                                ));
                            })()}
                        </div>
                    )}
                </div>
            )}
                </div>
            </main>
        </div>
    );
}
