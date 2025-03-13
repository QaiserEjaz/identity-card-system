import React from 'react';
import { Link } from 'react-router-dom';

function CardView({ cards, onDelete, showActions, onView, handleProtectedAction }) {
    return (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {cards.map((card, index) => (
                <div key={card._id} className="col">
                    <div className="card h-100 shadow-sm">
                        <div className="position-absolute top-0 start-0 bg-primary text-white px-2 py-1 rounded-end">
                            #{index + 1}
                        </div>
                        <img 
                            src={card.photo} 
                            className="card-img-top" 
                            alt="ID" 
                            style={{ 
                                height: '200px', 
                                objectFit: 'cover',
                                objectPosition: 'center' 
                            }} 
                        />
                        <div className="card-body">
                            <h5 className="card-title text-truncate">{card.name}</h5>
                            <div className="small text-muted mb-3">
                                <div className="text-truncate"><strong>Father:</strong> {card.fathername}</div>
                                <div><strong>CNIC:</strong> {card.cnic.replace(/(\d{5})(\d{7})(\d{1})/, '$1-$2-$3')}</div>
                                <div><strong>DOB:</strong> {new Date(card.dob).toLocaleDateString()}</div>
                                <div className="text-truncate"><strong>Address:</strong> {card.address}</div>
                            </div>
                            <div className="d-flex gap-2 flex-wrap justify-content-center">
                                <Link to={`/view/${card._id}`} className="btn btn-info btn-sm">View</Link>
                                {showActions && (
                                    <>
                                        <button onClick={() => handleProtectedAction('edit', card._id)} className="btn btn-warning btn-sm">Edit</button>
                                        <button onClick={() => handleProtectedAction('delete', card._id)} className="btn btn-danger btn-sm">Delete</button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default CardView;