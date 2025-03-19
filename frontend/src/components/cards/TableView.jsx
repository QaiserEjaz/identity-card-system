import React from 'react';
import { Link } from 'react-router-dom';

function TableView({ cards, onDelete, showActions, handleProtectedAction }) {
    return (
        <div className="card">
            <div className="table-responsive">
                <table className="table table-hover mb-0">
                    <thead>
                        <tr>
                            <th className="text-center">#</th>
                            <th>Photo</th>
                            <th>Name</th>
                            <th>Father's Name</th>
                            <th>CNIC</th>
                            <th>DOB</th>
                            <th>Address</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cards.map((card, index) => (
                            <tr key={card._id}>
                                <td className="text-center align-middle">{index + 1}</td>
                                <td>
                                    <div className="avatar">
                                        <img 
                                            src={card.photo} 
                                            alt="ID" 
                                            className="rounded-circle"
                                            style={{ 
                                                width: '45px', 
                                                height: '45px', 
                                                objectFit: 'cover',
                                                border: '2px solid #e2e8f0'
                                            }} 
                                        />
                                    </div>
                                </td>
                                <td className="align-middle font-weight-medium">{card.name}</td>
                                <td className="align-middle">{card.fathername}</td>
                                <td className="align-middle">{card.cnic.replace(/(\d{5})(\d{7})(\d{1})/, '$1-$2-$3')}</td>
                                <td className="align-middle">{new Date(card.dob).toLocaleDateString()}</td>
                                <td className="align-middle text-break">{card.address}</td>
                                <td>
                                    <div className="d-flex gap-2 justify-content-center">
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