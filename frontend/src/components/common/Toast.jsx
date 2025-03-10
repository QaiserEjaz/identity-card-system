import React from 'react';

function Toast({ message, type = 'success', onClose }) {
    return (
        <div 
            className={`toast show position-fixed top-0 end-0 m-3`} 
            role="alert"
            style={{ zIndex: 1050 }}
        >
            <div className={`toast-header bg-${type} text-white`}>
                <strong className="me-auto">
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                </strong>
                <button 
                    type="button" 
                    className="btn-close btn-close-white" 
                    onClick={onClose}
                ></button>
            </div>
            <div className="toast-body">
                {message}
            </div>
        </div>
    );
}

export default Toast;