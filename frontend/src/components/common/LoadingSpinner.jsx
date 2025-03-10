import React from 'react';

function LoadingSpinner() {
    return (
        <div className="d-flex justify-content-center my-4">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
}

export default LoadingSpinner;