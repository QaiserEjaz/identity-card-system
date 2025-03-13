import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { setCredentials, selectIsAuthenticated } from '../redux/authSlice';
import api from '../utils/api';  // Add this import

function Login() {
    // Rename setCredentials to avoid conflict
    const [credentials, setFormCredentials] = useState({
        email: 'admin@qaiser.com',
        password: 'Admin@123',
        role: 'admin',
    });
    const [error, setError] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const from = location.state?.from || '/';

    React.useEffect(() => {
        if (isAuthenticated) {
            navigate(from);
        }
    }, [isAuthenticated, navigate, from]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', credentials);
            const data = response.data;
            
            if (response.status === 200 && data.success) {
                const { token, user } = data.data;
                if (token && user) {
                    dispatch(setCredentials({ token, user })); // Now uses Redux setCredentials
                    navigate(from);
                } else {
                    setError('Invalid response format from server');
                }
            } else {
                setError(data.message || 'Invalid credentials');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Login failed. Please try again.');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="card">
                        <div className="card-body">
                            <h3 className="card-title text-center mb-4">Admin Login</h3>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleSubmit} noValidate id="loginForm">
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        value={credentials.email || ''}
                                        onChange={(e) =>
                                            setFormCredentials((prev) => ({
                                                ...prev,
                                                email: e.target.value,
                                            }))
                                        }
                                        autoComplete="username"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        name="password"
                                        value={credentials.password || ''}
                                        onChange={(e) =>
                                            setFormCredentials((prev) => ({
                                                ...prev,
                                                password: e.target.value,
                                            }))
                                        }
                                        autoComplete="current-password"
                                        required
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    className="btn btn-primary w-100"
                                    id="loginButton"
                                >
                                    Login as Admin
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;