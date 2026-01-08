const API_BASE_URL = 'https://sportmarketback.onrender.com';

export const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
        throw new Error('No refresh token available');
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
        throw new Error('Failed to refresh token. Session expired.');
    }

    const data = await response.json();
    
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    
    return data.accessToken;
};

export const logoutUser = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
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