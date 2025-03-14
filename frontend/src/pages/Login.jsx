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
    <>
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, #001510 0%, #00bf8f 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
        }}>
            {/* Animated Background Lines */}
            <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                background: `
                    linear-gradient(90deg, rgba(0,255,150,0.1) 1px, transparent 1px),
                    linear-gradient(0deg, rgba(0,255,150,0.1) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px',
                animation: 'moveGrid 20s linear infinite',
                opacity: 0.5
            }}></div>
    
            {/* Glowing Orbs */}
            <div style={{
                position: 'absolute',
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(0,255,150,0.1) 0%, transparent 70%)',
                top: '20%',
                left: '20%',
                filter: 'blur(50px)',
                animation: 'float 6s ease-in-out infinite'
            }}></div>
    
            {/* Login Card */}
            <div style={{
                width: '100%',
                maxWidth: '420px',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
                padding: '40px',
                position: 'relative',
                zIndex: 1,
                margin: '20px'
            }}>
                <h3 style={{
                    color: '#ffffff',
                    textAlign: 'center',
                    fontSize: '28px',
                    fontWeight: '600',
                    marginBottom: '30px',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    textShadow: '0 2px 10px rgba(0,255,150,0.3)'
                }}>Admin Login</h3>
    
                {error && (
                    <div style={{
                        background: 'rgba(255,82,82,0.1)',
                        border: '1px solid rgba(255,82,82,0.3)',
                        borderRadius: '12px',
                        padding: '12px',
                        marginBottom: '20px',
                        color: '#ffffff',
                        textAlign: 'center'
                    }}>{error}</div>
                )}
    
                <form onSubmit={handleSubmit} noValidate id="loginForm">
                    <div style={{ marginBottom: '24px' }}>
                    <label htmlFor="email" className="form-label" style={{color: '#ffffff'}}>Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            placeholder="Email"
                            value={credentials.email || ''}
                            onChange={(e) =>
                                 setFormCredentials((prev) => ({
                                ...prev,
                                email: e.target.value,
                            }))
                        }
                        autoComplete="username"
                        required
                            style={{
                                width: '100%',
                                padding: '16px 20px',
                                background: 'rgba(255,255,255,0.1)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                borderRadius: '12px',
                                color: '#ffffff',
                                fontSize: '16px',
                                transition: 'all 0.3s ease',
                                outline: 'none'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '32px' }}>
                    <label htmlFor="password" className="form-label" style={{color: '#ffffff'}}>Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            placeholder="Password"
                            value={credentials.password || ''}
                            onChange={(e) =>
                                setFormCredentials((prev) => ({
                                ...prev,
                                password: e.target.value,
                            }))
                        }
                            autoComplete="current-password"
                            required
                            style={{
                                width: '100%',
                                padding: '16px 20px',
                                background: 'rgba(255,255,255,0.1)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                borderRadius: '12px',
                                color: '#ffffff',
                                fontSize: '16px',
                                transition: 'all 0.3s ease',
                                outline: 'none'
                            }}
                        />
                    </div>
    
                    <button
                        type="submit"
                        id="loginButton"
                        style={{
                            width: '100%',
                            padding: '16px',
                            background: 'linear-gradient(45deg, #00bf8f, #00ff95)',
                            border: 'none',
                            borderRadius: '12px',
                            color: '#001510',
                            fontSize: '16px',
                            fontWeight: '600',
                            letterSpacing: '1px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 15px rgba(0,191,143,0.3)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        Login as Admin
                    </button>
                </form>
            </div>
    
            <style>
                {`
                    body {
                        margin: 0;
                        padding: 0;
                        overflow: hidden;
                    }
                    #root {
                        height: 100vh;
                        width: 100vw;
                        margin: 0;
                        padding: 0;
                    }
                    @keyframes moveGrid {
                        0% { transform: translateY(0); }
                        100% { transform: translateY(50px); }
                    }
                    @keyframes float {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-20px); }
                    }
                    input::placeholder {
                        color: rgba(255,255,255,0.5);
                    }
                    input:focus {
                        border-color: #00bf8f;
                        box-shadow: 0 0 15px rgba(0,191,143,0.3);
                    }
                    button:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 6px 20px rgba(0,191,143,0.4);
                    }
                `}
            </style>
        </div>
    </>
);
}

export default Login;