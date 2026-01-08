import { useState } from "react";
import React from "react";
import { queryFetcher } from "../../api/queryFetcher";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/authSlice";

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const validate = () => {
        if (!email || !password) {
            setError('Будь ласка, заповніть усі поля.');
            return false;
        }
        setError(null);
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setIsSubmitting(true);
        setError(null);
        setSuccess(false);

        const userData = { email, password };
        const endpoint = '/auth/login';
        const options = {
            method: 'POST',
            body: JSON.stringify(userData),
        };
        const queryKey = [endpoint, options];

        try {
            const result = await queryFetcher({ queryKey });
            
            localStorage.setItem('accessToken', result.accessToken);
            localStorage.setItem('refreshToken', result.refreshToken);
            localStorage.setItem('role', result.role);

            dispatch(setCredentials({ 
                accessToken: result.accessToken,
                refreshToken: result.refreshToken,
                role: result.role
            }));

            setSuccess(true);
            setEmail('');
            setPassword('');
            setError(null);
            
            setTimeout(() => {
                navigate('/catalog');
            }, 500);

        } catch (err) {
            console.error('Помилка входу:', err);
            setError(err.message || 'Невірний email або пароль.');
            setSuccess(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl border border-gray-200">
                <h2 className="text-3xl font-bold text-center text-gray-800">
                    Вхід
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                        onChange={(e) => setEmail(e.target.value)} 
                        type="email"
                        placeholder="Email"
                        value={email}
                        disabled={isSubmitting || success}
                        className="w-full px-4 py-2 text-gray-800 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:opacity-60"
                    />
                    
                    <input 
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        disabled={isSubmitting || success}
                        className="w-full px-4 py-2 text-gray-800 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:opacity-60"
                    />

                    {error && (
                        <p className="p-2 text-sm text-red-700 bg-red-100 border border-red-300 rounded-md">
                            ⚠️ {error}
                        </p>
                    )}
                    
                    {success && (
                        <p className="p-2 text-sm text-green-700 bg-green-100 border border-green-300 rounded-md">
                            ✅ Успішний вхід!
                        </p>
                    )}
                    
                    <button 
                        type="submit"
                        disabled={isSubmitting || success}
                        className="w-full py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {isSubmitting ? 'Вхід...' : 'Увійти'}
                    </button>
                </form>
                <Link to="/registration" className="text-sm text-blue-600 hover:underline">
                    Не маєте акаунту? Зареєструйтесь
                </Link>
            </div>
        </div>
    ); 
}

export default LoginForm;