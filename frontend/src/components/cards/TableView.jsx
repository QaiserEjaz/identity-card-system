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
                                <td className="align-middle">{card.cnic}</td>
                                <td className="align-middle">{new Date(card.dob).toLocaleDateString()}</td>
                                <td className="align-middle text-break">{card.address}</td>
                                <td>
                                    <div className="d-flex gap-2 justify-content-center">
                                        <Link 
                                            to={`/view/${card._id}`} 
                                            className="btn btn-info btn-sm"
                                            title="View Details"
                                        >
                                            <i className="fas fa-eye"></i>
                                        </Link>
                                        {showActions && (
                                            <>
                                                <button 
                                                    onClick={() => handleProtectedAction('edit', card._id)} 
                                                    className="btn btn-warning btn-sm"
                                                    title="Edit"
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button 
                                                    onClick={() => handleProtectedAction('delete', card._id)} 
                                                    className="btn btn-danger btn-sm"
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

// Remove any other export default statements in the file
// Keep only this one at the end
export default TableView;