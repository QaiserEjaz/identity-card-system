import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';

function Navbar() {
    const dispatch = useDispatch();
    const { token } = useSelector(state => state.auth);
    
    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-gradient" style={{ backgroundColor: '#1a237e' }}>
            <div className="container">
                <Link className="navbar-brand d-flex align-items-center" to="/">
                    <i className="fas fa-id-card me-2"></i>
                    Identity Card System
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">
                                <i className="fas fa-th-list me-1"></i> View Cards
                            </Link>
                        </li>
                        {token ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/add">
                                        <i className="fas fa-plus-circle me-1"></i> New Card
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <button 
                                        className="nav-link btn btn-link" 
                                        onClick={handleLogout}
                                    >
                                        <i className="fas fa-sign-out-alt me-1"></i> Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item">
                                <Link className="nav-link" to="/admin">
                                    <i className="fas fa-lock me-1"></i> Admin Login
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;