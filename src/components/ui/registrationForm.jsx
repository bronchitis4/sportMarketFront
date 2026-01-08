import { useState } from "react";
import React from "react";
import { queryFetcher } from "../../api/queryFetcher";
import { setCredentials } from "../../store/authSlice";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
const RegistrationBlock = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const validate = () => {
        if (!username || !email || !password) {
            setError('Будь ласка, заповніть усі поля.');
            return false;
        }
        if (password.length < 6) {
            setError('Пароль має містити щонайменше 6 символів.');
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

        const userData = { username, email, password };
        const endpoint = '/auth/registration'; 
        const options = {
            method: 'POST',
            body: JSON.stringify(userData),
        };
        const queryKey = [endpoint, options];

        try {
            const result = await queryFetcher({ queryKey });
            
            localStorage.setItem('accessToken', result.acessToken);
            localStorage.setItem('refreshToken', result.refreshToken);
            localStorage.setItem('role', result.role);
            
            dispatch(setCredentials({ 
                accessToken: result.acessToken,
                refreshToken: result.refreshToken,
                role: result.role
            }));

            setSuccess(true);
            setUsername('');
            setEmail('');
            setPassword('');
            setError(null);
            
            setTimeout(() => {
                navigate('/');
            }, 1000);
        } catch (err) {
            console.error('Помилка реєстрації:', err);
            setError(err.message || 'Не вдалося зареєструватися. Спробуйте пізніше.');
            setSuccess(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl border border-gray-200">
                <h2 className="text-3xl font-bold text-center text-gray-800">
                    Реєстрація
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                        onChange={(e) => setUsername(e.target.value)} 
                        type="text"
                        placeholder="Ім'я користувача"
                        value={username}
                        disabled={isSubmitting || success}
                        className="w-full px-4 py-2 text-gray-800 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:opacity-60"
                    />
                    
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
                            ✅ Реєстрація пройшла успішно!
                        </p>
                    )}
                    
                    <button 
                        type="submit"
                        disabled={isSubmitting || success}
                        className="w-full py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {isSubmitting ? 'Реєстрація...' : 'Зареєструватися'}
                    </button>
                </form>
                <Link to="/login" className="text-sm text-blue-600 hover:underline">
                    Вже маєте акаунт? Увійдіть
                </Link>
            </div>
        </div>
    ); 
}

export default RegistrationBlock;