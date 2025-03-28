import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';

function Navbar() {
    const dispatch = useDispatch();
    const { token, user } = useSelector(state => state.auth);
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Add this check to hide navbar on login page
    if (location.pathname === '/admin') {
        return null;
    }
    
    const handleLogout = () => {
        dispatch(logout());
        setIsMenuOpen(false);
    };

    const isCurrentPath = (path) => {
        return location.pathname === path;
    };

    return (
        <nav className="navbar navbar-expand-lg mx-2 mx-sm-3 mt-2 mt-sm-3" style={{
            background: 'linear-gradient(90deg, rgba(0, 21, 16, 0.9) 0%, rgba(0, 191, 143, 0.9) 100%)',
            padding: '0.75rem 0',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            position: 'sticky',
            top: '15px',
            zIndex: 1000,
            borderRadius: '12px',
            // border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
            <div className="container">
                <Link className="navbar-brand d-flex align-items-center" to="/" style={{
                    color: '#ffffff',
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease'
                }}>
                    <i className="fas fa-id-card me-2" style={{ fontSize: '1.4rem' }}></i>
                    Identity Card System
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    style={{
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        padding: '0.5rem',
                        color: '#ffffff',
                    }}
                >
                    {isMenuOpen ? (
                        <i className="fas fa-times" style={{ fontSize: '1.6rem', width:'22px' }}></i>
                    ) : (
                        <i className='fas fa-bars' style={{ fontSize: '1.6rem', width:'22px' }}></i>
                    )}
                </button>
                <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
                    <ul className="navbar-nav ms-auto " style={{ gap: '1rem' }}>
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

                                {token && !isCurrentPath('/dashboard') && (
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/dashboard" style={{
                                            color: 'rgba(255, 255, 255, 0.9)',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '8px',
                                            transition: 'all 0.3s ease'
                                        }}>
                                            <i className="fas fa-chart-line me-1"></i> Dashboard
                                        </Link>
                                    </li>
                                )}
                                <li className="nav-item">
                                    <div style={{
                                        color: '#ffffff',
                                        padding: '0.5rem 1rem',
                                        border: '0px solid rgba(255, 255, 255, 0.2)',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        background: 'transparent',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}>
                                        <i className="fas fa-user-circle" style={{ fontSize: '1.2rem' }}></i>
                                        <span>{user?.name || 'Admin'}</span>
                                    </div>
                                </li>

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
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
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
                    @media (max-width: 576px) {
                        .navbar {
                            margin: 0.5rem !important;
                            border-radius: 10px;
                        }
                        .navbar-brand {
                            font-size: 1rem !important;
                        }
                        .navbar-brand i {
                            font-size: 1.2rem !important;
                        }
                    }

                    @media (min-width: 992px) {
                        .navbar {
                            max-width: 95%;
                            margin-left: auto !important;
                            margin-right: auto !important;
                        }
                        .nav-link {
                            margin: 0 0.25rem;
                        }
                    }

                    @media (min-width: 1200px) {
                        .navbar {
                            max-width: 90%;
                        }
                    }

                    @media (max-width: 991px) {
                        .navbar-collapse {
                            
                            padding: 1rem;
                            border-radius: 8px;
                            margin-top: 0.5rem;
                            
                        }
                        .navbar-nav {
                            gap: 0.5rem !important;
                        }
                        .nav-link {
                            padding-left: 1rem !important;
                            padding-right: 1rem !important;
                        }
                    }

                    .nav-link:hover {
                        background: rgba(255, 255, 255, 0.1) !important;
                        color: #ffffff !important;
                        transform: translateY(-1px);
                    }

                    .navbar-toggler:focus {
                        box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
                    }

                    .navbar-toggler {
                        border: none !important;
                        padding: 0.5rem !important;
                        transition: all 0.3s ease;
                    }

                    .navbar-toggler:hover {
                        background: rgba(255, 255, 255, 0.1);
                        border-radius: 8px;
                    }
                    @media (max-width: 991px) {
                        .navbar-collapse {
                            padding: 1rem;
                            border-radius: 0 0 12px 12px;
                            margin-top: 0.5rem;
                        }
                        .navbar-nav {
                            gap: 0.5rem !important;
                        }
                    }
                `}
            </style>
        </nav>
    );
}

export default Navbar;