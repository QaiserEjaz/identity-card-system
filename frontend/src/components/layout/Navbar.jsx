import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';

function Navbar() {
    const dispatch = useDispatch();
    const { token } = useSelector(state => state.auth);
    const location = useLocation();
    
    const handleLogout = () => {
        dispatch(logout());
    };

    const isCurrentPath = (path) => {
        return location.pathname === path;
    };

    return (
        <nav className="navbar navbar-expand-lg" style={{
            background: 'linear-gradient(90deg, #001510 0%, #00bf8f 100%)',
            padding: '1rem 0',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
        }}>
            <div className="container">
                <Link className="navbar-brand d-flex align-items-center" to="/" style={{
                    color: '#ffffff',
                    fontSize: '1.3rem',
                    fontWeight: '600',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease'
                }}>
                    <i className="fas fa-id-card me-2"></i>
                    Identity Card System
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" style={{
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    padding: '0.5rem'
                }}>
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto" style={{ gap: '1rem' }}>
                        {!isCurrentPath('/') && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/" style={{
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '8px',
                                    transition: 'all 0.3s ease'
                                }}>
                                    <i className="fas fa-th-list me-1"></i> View Cards
                                </Link>
                            </li>
                        )}
                        {token ? (
                            <>
                                {!isCurrentPath('/add') && (
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/add" style={{
                                            color: 'rgba(255, 255, 255, 0.9)',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '8px',
                                            transition: 'all 0.3s ease'
                                        }}>
                                            <i className="fas fa-plus-circle me-1"></i> New Card
                                        </Link>
                                    </li>
                                )}
                                <li className="nav-item">
                                    <button 
                                        className="nav-link btn btn-link" 
                                        onClick={handleLogout}
                                        style={{
                                            color: 'rgba(255, 255, 255, 0.9)',
                                            padding: '0.5rem 1rem',
                                            border: '1px solid rgba(255, 255, 255, 0.2)',
                                            borderRadius: '8px',
                                            background: 'transparent',
                                            transition: 'all 0.3s ease',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <i className="fas fa-sign-out-alt me-1"></i> Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            !isCurrentPath('/admin') && (
                                <li className="nav-item">
                                    <Link className="nav-link" to="/admin" style={{
                                        color: 'rgba(255, 255, 255, 0.9)',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '8px',
                                        transition: 'all 0.3s ease'
                                    }}>
                                        <i className="fas fa-lock me-1"></i> Admin Login
                                    </Link>
                                </li>
                            )
                        )}
                    </ul>
                </div>
            </div>

            <style>
                {`
                    .nav-link:hover {
                        background: rgba(255, 255, 255, 0.1) !important;
                        color: #ffffff !important;
                    }
                    .navbar-toggler:focus {
                        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
                    }
                    .navbar-toggler-icon {
                        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%28255, 255, 255, 0.7%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
                    }
                `}
            </style>
        </nav>
    );
}

export default Navbar;