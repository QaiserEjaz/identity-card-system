import React from 'react';
import { Link } from 'react-router-dom';

function TableView({ cards, onDelete, showActions, handleProtectedAction }) {
    // Helper function to format CNIC
    const formatCNIC = (cnic) => cnic.replace(/(\d{5})(\d{7})(\d{1})/, '$1-$2-$3');

    return (
        <div className="card">
            <div className="table-responsive">
                <table className="table table-hover mb-0">
                    <thead>
                        <tr>
                            <th className="text-center d-none d-sm-table-cell">#</th>
                            <th>Photo</th>
                            <th>Name</th>
                            <th className="d-none d-md-table-cell">Father's Name</th>
                            <th className="d-none d-lg-table-cell">CNIC</th>
                            <th className="d-none d-xl-table-cell">DOB</th>
                            <th className="d-none d-lg-table-cell">Address</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cards.map((card, index) => (
                            <tr key={card._id}>
                                <td className="text-center align-middle d-none d-sm-table-cell">{index + 1}</td>
                                <td>
                                    <div className="avatar">
                                        <img 
                                            src={card.photo} 
                                            alt={card.name} 
                                            className="rounded-circle"
                                            style={{ 
                                                width: '40px', 
                                                height: '40px', 
                                                objectFit: 'cover',
                                                border: '2px solid #e2e8f0'
                                            }} 
                                        />
                                    </div>
                                </td>
                                <td className="align-middle">
                                    <div>{card.name}</div>
                                    <small className="text-muted d-md-none">{card.fathername}</small>
                                </td>
                                <td className="align-middle d-none d-md-table-cell">{card.fathername}</td>
                                <td className="align-middle d-none d-lg-table-cell">{formatCNIC(card.cnic)}</td>
                                <td className="align-middle d-none d-xl-table-cell">
                                    {new Date(card.dob).toLocaleDateString()}
                                </td>
                                <td className="align-middle text-break d-none d-lg-table-cell">{card.address}</td>
                                <td>
                                    <div className="d-flex gap-1 justify-content-center">
                                        <Link 
                                            to={`/view/${card._id}`} 
                                            className="btn btn-sm px-2 py-1"
                                            style={{
                                                background: 'linear-gradient(135deg, #006A4E, #00bf8f)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '6px'
                                            }}
                                            title="View Details"
                                        >
                                            <i className="fas fa-eye"></i>
                                        </Link>
                                        {showActions && (
                                            <>
                                                <button 
                                                    onClick={() => handleProtectedAction('edit', card._id)} 
                                                    className="btn btn-sm px-2 py-1"
                                                    style={{
                                                        background: '#f59e0b',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '6px'
                                                    }}
                                                    title="Edit"
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button 
                                                    onClick={() => handleProtectedAction('delete', card._id)} 
                                                    className="btn btn-sm px-2 py-1"
                                                    style={{
                                                        background: '#dc2626',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '6px'
                                                    }}
                                                    title="Delete"
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TableView;