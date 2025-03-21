import React from 'react';

function Search({ onSearch }) {
    return (
        <div className="mb-3">
            <div className="input-group">
                <span className="input-group-text">
                    <i className="fas fa-search"></i>
                </span>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by name, CNIC, address, or religion..."
                    onChange={(e) => onSearch(e.target.value)}
                />
            </div>
        </div>
    );
}

export default Search;