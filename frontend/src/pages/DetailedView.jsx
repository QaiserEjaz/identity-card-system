import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import Barcode from 'react-barcode';
import api from '../utils/api';

function DetailedView() {
    const { id } = useParams();
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get(`/cards/${id}`);
                setData(res.data);
            } catch (error) {
                console.error('Error fetching detailed data:', error);
            }
        };
        fetchData();
    }, [id]);

    if (!data) {
        return (
            <div
                className="d-flex justify-content-center align-items-center"
                style={{
                    background: 'linear-gradient(180deg, #e6f4ea, #d4edda)',
                    width: '100vw',
                    height: '100vh',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                }}
            >
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <div
            className="d-flex justify-content-center align-items-start"
            style={{
                background: 'linear-gradient(180deg, #e6f4ea, #d4edda)',
                minHeight: '100vh',
                width: '100vw',
                margin: 0,
                padding: 'clamp(0.5rem, 2vw, 1rem) clamp(0.25rem, 1vw, 0.5rem)',
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: -1,
                overflowY: 'auto',
            }}
        >
            <div
                className="card shadow-lg border-0 position-relative"
                style={{
                    background: 'linear-gradient(135deg, rgba(0,100,0,0.15) 0%, rgba(50,205,50,0.25) 100%)',
                    borderRadius: 'clamp(10px, 2vw, 20px)',
                    border: '1px solid rgba(50,205,50,0.5)',
                    boxShadow: '0 10px 30px rgba(0,100,0,0.3), 0 3px 10px rgba(0,0,0,0.15)',
                    width: '100%',
                    maxWidth: '600px',
                    height: 'auto',
                    marginTop: 'clamp(3rem, 8vw, 5rem)', // Increased top margin for header clearance
                    marginBottom: 'clamp(1rem, 3vw, 2rem)',
                }}
            >
                <div className="card-body p-2 d-flex flex-column">
                    <div className="id-card flex-grow-1 d-flex flex-column">
                        {/* Header Section with NFC */}
                        <div className="text-center mb-1 position-relative">
                            <div className="d-flex align-items-center justify-content-between flex-wrap gap-1">
                                <div
                                    className="security-strip"
                                    style={{
                                        height: 'clamp(15px, 3vw, 20px)',
                                        width: 'clamp(30px, 6vw, 40px)',
                                        background:
                                            'linear-gradient(45deg, #32CD32 20%, transparent 20%), linear-gradient(-45deg, #006400 20%, transparent 20%)',
                                        backgroundSize: '6px 6px',
                                        borderRadius: '4px',
                                        boxShadow: 'inset 0 0 6px rgba(0,100,0,0.4), 0 0 6px #32CD32',
                                        opacity: '0.9',
                                    }}
                                />
                                <div className="d-flex align-items-center gap-1">
                                    <h3
                                        className="mb-0"
                                        style={{
                                            background: 'linear-gradient(45deg, #006400, #32CD32)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            fontWeight: '800',
                                            letterSpacing: '2px',
                                            textShadow: '0 0 6px rgba(50,205,50,0.7)',
                                            fontSize: 'clamp(0.9rem, 2vw, 1.25rem)',
                                            lineHeight: 1.2, // Ensure text isn’t cut off
                                        }}
                                    >
                                        PAKISTAN
                                    </h3>
                                    <i
                                        className="fas fa-wifi"
                                        style={{
                                            color: '#32CD32',
                                            fontSize: 'clamp(0.7rem, 1.5vw, 0.9rem)',
                                            textShadow: '0 0 6px rgba(50,205,50,0.7)',
                                            animation: 'pulse 2s infinite',
                                        }}
                                        title="NFC Chip Simulation"
                                    />
                                </div>
                                <QRCodeSVG
                                    value={`ID:${data._id}-CNIC:${data.cnic}`}
                                    size={clamp(35, 45, id)}
                                    level="H"
                                    style={{
                                        padding: '3px',
                                        background: '#fff',
                                        borderRadius: '6px',
                                        boxShadow: '0 3px 10px rgba(0,100,0,0.3), 0 0 6px #32CD32',
                                        border: '1.5px solid #32CD32',
                                    }}
                                />
                            </div>
                            <h5
                                className="mt-1 mb-0"
                                style={{
                                    color: '#006400',
                                    fontWeight: '600',
                                    letterSpacing: '1px',
                                    textShadow: '0 0 3px rgba(50,205,50,0.5)',
                                    fontSize: 'clamp(0.7rem, 1.8vw, 0.9rem)',
                                    lineHeight: 1.2,
                                }}
                            >
                                National Identity Card
                            </h5>
                            <p
                                className="text-muted small"
                                style={{
                                    color: '#228B22',
                                    fontStyle: 'italic',
                                    fontSize: 'clamp(0.5rem, 1vw, 0.65rem)',
                                    lineHeight: 1.2,
                                }}
                            >
                                ISLAMIC REPUBLIC OF PAKISTAN
                            </p>
                        </div>

                        <div className="row g-1 flex-grow-1">
                            {/* Photo, Signature, Barcode Section */}
                            <div className="col-12 col-md-4 order-md-2 d-flex flex-column">
                                <div
                                    className="p-1 rounded-3 flex-grow-1 d-flex flex-column justify-content-between"
                                    style={{
                                        background: 'linear-gradient(145deg, rgba(255,255,255,0.85), rgba(240,255,240,0.75))',
                                        border: '1px solid rgba(50,205,50,0.4)',
                                        boxShadow: '0 4px 15px rgba(0,100,0,0.2)',
                                    }}
                                >
                                    {data.photo && (
                                        <div className="position-relative mb-1 d-flex justify-content-center">
                                            <img
                                                src={data.photo}
                                                alt={`${data.name}'s photo`}
                                                className="img-fluid rounded-3 shadow-sm"
                                                style={{
                                                    maxWidth: 'clamp(70px, 16vw, 100px)',
                                                    width: '100%',
                                                    border: '1.5px solid #32CD32',
                                                    boxShadow: '0 3px 10px rgba(0,100,0,0.3)',
                                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                                    imageRendering: 'auto', // Ensure sharp rendering
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.transform = 'scale(1.05)';
                                                    e.target.style.boxShadow = '0 6px 15px rgba(0,100,0,0.5)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.transform = 'scale(1)';
                                                    e.target.style.boxShadow = '0 3px 10px rgba(0,100,0,0.3)';
                                                }}
                                            />
                                        </div>
                                    )}
                                    <div className="signature-field bg-white rounded-3 p-1 mb-1">
                                        <label
                                            className="text-muted small mb-0"
                                            style={{ fontSize: 'clamp(0.45rem, 1vw, 0.6rem)' }}
                                        >
                                            <i className="fas fa-signature me-1" style={{ color: '#32CD32' }}></i>
                                            Signature
                                        </label>
                                        <div
                                            className="signature-container text-center"
                                            style={{
                                                minHeight: 'clamp(15px, 3.5vw, 20px)',
                                                borderBottom: '1.5px dashed #32CD32',
                                                padding: '0.15rem 0',
                                                background: 'rgba(255,255,255,0.95)',
                                                borderRadius: '4px',
                                                boxShadow: 'inset 0 0 3px rgba(0,100,0,0.15)',
                                                transition: 'box-shadow 0.3s ease',
                                            }}
                                            onMouseEnter={(e) =>
                                                (e.target.style.boxShadow =
                                                    'inset 0 0 6px rgba(0,100,0,0.3), 0 0 8px #32CD32')
                                            }
                                            onMouseLeave={(e) =>
                                                (e.target.style.boxShadow = 'inset 0 0 3px rgba(0,100,0,0.15)')
                                            }
                                        >
                                            <img
                                                src={data.signature || '/images/default-signature.png'}
                                                alt="Signature"
                                                style={{
                                                    maxHeight: 'clamp(12px, 3vw, 20px)',
                                                    opacity: '0.9',
                                                    width: 'auto',
                                                    maxWidth: '100%',
                                                    imageRendering: 'auto', // Ensure sharp rendering
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Barcode
                                            value={data.cnic}
                                            format="CODE128"
                                            width={0.9}
                                            height={clamp(12, 18, id)}
                                            displayValue={false}
                                            background="transparent"
                                            lineColor="#006400"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Personal Information Section */}
                            <div className="col-12 col-md-8 order-md-1">
                                <div className="row g-1" style={{ fontSize: 'clamp(0.6rem, 1.5vw, 0.75rem)' }}>
                                    <div className="col-12">
                                        <div className="data-field">
                                            <label className="text-muted small">
                                                <i className="fas fa-user me-1" style={{ color: '#006400' }}></i>
                                                Full Name
                                            </label>
                                            <h6 className="mb-0">{data.name}</h6>
                                        </div>
                                    </div>

                                    <div className="col-7">
                                        <div className="data-field">
                                            <label className="text-muted small">
                                                <i className="fas fa-user-tie me-1" style={{ color: '#006400' }}></i>
                                                Father Name
                                            </label>
                                            <h6 className="mb-0">{data.fathername}</h6>
                                        </div>
                                    </div>

                                    <div className="col-5">
                                        <div className="data-field">
                                            <label className="text-muted small">
                                                <i className="fas fa-id-card me-1" style={{ color: '#006400' }}></i>
                                                CNIC
                                            </label>
                                            <h6
                                                className="mb-0"
                                                style={{ fontFamily: 'monospace' }}
                                            >
                                                {data.cnic.replace(/(\d{5})(\d{7})(\d{1})/, '$1-$2-$3')}
                                            </h6>
                                        </div>
                                    </div>

                                    <div className="col-4">
                                        <div className="data-field">
                                            <label className="text-muted small">
                                                <i className="fas fa-calendar-alt me-1" style={{ color: '#006400' }}></i>
                                                Date of Birth
                                            </label>
                                            <h6 className="mb-0">{formatDate(data.dob)}</h6>
                                        </div>
                                    </div>

                                    <div className="col-4">
                                        <div className="data-field">
                                            <label className="text-muted small">
                                                <i className="fas fa-pray me-1" style={{ color: '#006400' }}></i>
                                                Religion
                                            </label>
                                            <h6 className="mb-0">{data.religion || 'N/A'}</h6>
                                        </div>
                                    </div>

                                    <div className="col-4">
                                        <div className="data-field">
                                            <label className="text-muted small">
                                                <i className="fas fa-tint me-1" style={{ color: '#006400' }}></i>
                                                Blood Group
                                            </label>
                                            <h6 className="mb-0 text-success fw-bold">{data.bloodGroup || 'N/A'}</h6>
                                        </div>
                                    </div>

                                    <div className="col-4">
                                        <div className="data-field">
                                            <label className="text-muted small">
                                                <i className="fas fa-venus-mars me-1" style={{ color: '#006400' }}></i>
                                                Gender
                                            </label>
                                            <h6 className="mb-0">
                                                <i
                                                    className={`fas fa-${data.gender === 'male' ? 'mars' : 'venus'
                                                        } me-1`}
                                                    style={{ color: '#32CD32' }}
                                                ></i>
                                                {data.gender?.charAt(0).toUpperCase() + data.gender?.slice(1)}
                                            </h6>
                                        </div>
                                    </div>

                                    <div className="col-4">
                                        <div className="data-field">
                                            <label className="text-muted small">
                                                <i className="fas fa-ring me-1" style={{ color: '#006400' }}></i>
                                                Marital Status
                                            </label>
                                            <h6 className="mb-0">
                                                <i
                                                    className={`fas fa-${data.maritalStatus === 'married' ? 'ring' : 'user'
                                                        } me-1`}
                                                    style={{ color: '#32CD32' }}
                                                ></i>
                                                {data.maritalStatus?.charAt(0).toUpperCase() +
                                                    data.maritalStatus?.slice(1) || 'N/A'}
                                            </h6>
                                        </div>
                                    </div>

                                    <div className="col-4">
                                        <div className="data-field">
                                            <label className="text-muted small">
                                                <i className="fas fa-briefcase me-1" style={{ color: '#006400' }}></i>
                                                Profession
                                            </label>
                                            <h6 className="mb-0">{data.profession || 'N/A'}</h6>
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="data-field">
                                            <label className="text-muted small">
                                                <i className="fas fa-home me-1" style={{ color: '#006400' }}></i>
                                                Permanent Address
                                            </label>
                                            <h6
                                                className="mb-0"
                                                style={{ fontSize: 'clamp(0.55rem, 1.4vw, 0.7rem)' }}
                                            >
                                                {data.address}
                                            </h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Inline CSS for Responsive Design */}
            <style>{`
                .data-field {
                    background: linear-gradient(145deg, rgba(255,255,255,0.8), rgba(235,250,235,0.7));
                    padding: clamp(0.25rem, 0.8vw, 0.4rem);
                    border-radius: 5px;
                    border: 1px solid rgba(50,205,50,0.4);
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 6px rgba(0,100,0,0.15);
                }

                .data-field:hover {
                    background: linear-gradient(145deg, rgba(255,255,255,0.9), rgba(240,255,240,0.85));
                    border-color: #32CD32;
                    box-shadow: 0 4px 12px rgba(0,100,0,0.25), 0 0 10px rgba(50,205,50,0.3);
                }

                .data-field label {
                    color: #006400;
                    font-weight: 500;
                    margin-bottom: 0.05rem;
                    text-shadow: 0 0 3px rgba(50,205,50,0.3);
                    font-size: clamp(0.5rem, 1.1vw, 0.65rem);
                }

                .data-field h6 {
                    color: #222;
                    font-weight: 500;
                    font-family: 'Courier New', monospace;
                    text-shadow: 0 0 2px rgba(0,100,0,0.2);
                    font-size: clamp(0.6rem, 1.5vw, 0.75rem);
                }

                .id-card {
                    position: relative;
                    overflow: hidden;
                }

                .id-card::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: radial-gradient(circle, rgba(50,205,50,0.15) 0%, transparent 60%);
                    animation: glow 10s infinite ease-in-out;
                    pointer-events: none;
                    z-index: 0;
                }

                .id-card > * {
                    position: relative;
                    z-index: 1;
                }

                @keyframes glow {
                    0% { transform: rotate(0deg); opacity: 0.4; }
                    50% { transform: rotate(180deg); opacity: 0.6; }
                    100% { transform: rotate(360deg); opacity: 0.4; }
                }

                @keyframes pulse {
                    0% { transform: scale(1); opacity: 0.7; }
                    50% { transform: scale(1.1); opacity: 1; }
                    100% { transform: scale(1); opacity: 0.7; }
                }

                /* Media Queries for Smaller Screens */
                @media (max-width: 768px) {
                    .card {
                        width: 98vw;
                        height: auto;
                        min-height: fit-content;
                        margin-top: clamp(2.5rem, 7vw, 4rem); /* Adjusted for header */
                        margin-bottom: clamp(0.75rem, 2vw, 1.5rem);
                        backdrop-filter: blur(8px); /* Reduced blur */
                    }
                    .card-body {
                        padding: clamp(0.5rem, 1.5vw, 0.75rem);
                    }
                    .row.g-1 {
                        gap: 0.2rem !important;
                    }
                    .data-field {
                        padding: clamp(0.2rem, 0.6vw, 0.3rem);
                        backdrop-filter: none; /* Remove blur for clarity */
                    }
                    .col-12.col-md-4 {
                        order: 2 !important;
                    }
                    .col-12.col-md-8 {
                        order: 1 !important;
                    }
                }

                @media (max-width: 576px) {
                    .card {
                        width: 100%;
                        margin-top: clamp(2rem, 6vw, 3.5rem); /* Further adjusted */
                        margin-bottom: clamp(0.5rem, 1.5vw, 1rem);
                        border-radius: clamp(8px, 1.5vw, 12px);
                        backdrop-filter: blur(5px); /* Further reduced blur */
                    }
                    .row.g-1 {
                        gap: 0.15rem !important;
                    }
                    .security-strip {
                        height: clamp(12px, 2.5vw, 15px);
                        width: clamp(25px, 5vw, 30px);
                    }
                    .signature-container {
                        min-height: clamp(12px, 3vw, 15px);
                    }
                }

                @media (max-height: 600px) {
                    .card {
                        height: auto;
                        max-height: 90vh;
                        overflow-y: auto;
                        margin-top: clamp(2rem, 5vw, 3rem); /* Adjusted for low height */
                    }
                    .data-field {
                        margin-bottom: 0.05rem;
                        backdrop-filter: none; /* Remove blur */
                    }
                }
            `}</style>
        </div>
    );
}

// Helper function to calculate clamp values dynamically
function clamp(min, max, id) {
    const screenWidth = window.innerWidth;
    const minPx = min;
    const maxPx = max;
    const vw = (screenWidth / 100) * 2;
    return Math.min(Math.max(minPx, vw), maxPx);
}

export default DetailedView;