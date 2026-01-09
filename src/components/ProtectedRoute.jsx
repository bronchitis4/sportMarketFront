import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ children }) {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    
    const hasToken = localStorage.getItem('accessToken');
    
    console.log('ProtectedRoute check:', { isAuthenticated, hasToken: !!hasToken });

    if (!isAuthenticated && !hasToken) {
        console.log('ProtectedRoute: redirecting to login');
        return <Navigate to="/login" replace />;
    }

    return children;
}
