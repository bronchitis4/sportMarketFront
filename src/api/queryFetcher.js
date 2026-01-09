import { store } from '../store/store'; 
import { refreshAccessToken } from '../services/authService';
import { logout } from '../store/authSlice'; 

const API_BASE_URL = 'https://sportmarketback.onrender.com'; 

let isRefreshing = false;
let failedQueue = [];

const getAccessToken = () => {
    return localStorage.getItem('accessToken');
};

const performFetch = async (endpoint, currentOptions, currentToken) => {
    const finalOptions = {
        signal: currentOptions.signal,
        credentials: 'include',
        ...currentOptions,
        headers: {
            'Content-Type': 'application/json',
            ...currentOptions.headers,
        }
    };

    if (currentToken) {
        finalOptions.headers.Authorization = `Bearer ${currentToken}`;
    }
    
    return fetch(`${API_BASE_URL}${endpoint}`, finalOptions);
};

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

export const queryFetcher = async ({ queryKey, signal }) => {
    const [endpoint, options = {}] = queryKey; 
    
    // Публічні endpoints, які не потребують авторизації
    const publicEndpoints = ['/auth/login', '/auth/register', '/auth/refresh'];
    const isPublicEndpoint = publicEndpoints.some(ep => endpoint.includes(ep));
    
    let token = isPublicEndpoint ? null : getAccessToken();

    let response = await performFetch(endpoint, options, token);

    if (response.status === 401 && !isPublicEndpoint) {
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then(newToken => {
                return performFetch(endpoint, options, newToken);
            }).then(retryResponse => {
                if (!retryResponse.ok) {
                    throw new Error(`HTTP error! status: ${retryResponse.status}`);
                }
                return retryResponse.json();
            });
        }
        
        isRefreshing = true;
        let newToken = null;

        try {
            newToken = await refreshAccessToken();
            localStorage.setItem('accessToken', newToken);
            processQueue(null, newToken); 
            response = await performFetch(endpoint, options, newToken);
            
            if (response.status === 401) {
                throw new Error('Failed to refresh token');
            }

        } catch (refreshError) {
            processQueue(refreshError);
            // Якщо не вдалося оновити токен, вилогінюємо користувача
            store.dispatch(logout());
            throw new Error(refreshError.message); 
        } finally {
            isRefreshing = false;
        }
    }

    if (!response.ok) {
        let errorData = {};
        try {
            errorData = await response.json();
        } catch (e) {
        }
        
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
};