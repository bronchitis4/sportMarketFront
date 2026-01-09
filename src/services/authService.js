const API_BASE_URL = 'https://sportmarketback.onrender.com';

export const refreshAccessToken = async () => {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });

    if (!response.ok) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('role');
        throw new Error('Failed to refresh token. Session expired.');
    }

    const data = await response.json();
    
    const newAccessToken = data.acessToken || data.accessToken;
    const newRefreshToken = data.refreshToken;
    
    if (newAccessToken) {
        localStorage.setItem('accessToken', newAccessToken);
    }
    if (newRefreshToken) {
        localStorage.setItem('refreshToken', newRefreshToken);
    }
    
    return newAccessToken;
};

export const logoutUser = async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to logout');
    }

    const contentLength = response.headers.get('content-length');
    if (contentLength === '0' || !contentLength) {
        return { success: true };
    }

    return response.json();
};