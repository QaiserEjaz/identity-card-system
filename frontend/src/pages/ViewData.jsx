import React, { useEffect, useState } from 'react';
import Search from '../components/common/Search';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import TableView from '../components/cards/TableView.jsx';
import CardView from '../components/cards/CardView.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import api from '../utils/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ViewData() {
    const [cards, setCards] = useState([]);
    const [filteredCards, setFilteredCards] = useState([]);
    const [viewMode, setViewMode] = useState('table');
    const [pdfUrl, setPdfUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [paginationInfo, setPaginationInfo] = useState({
        currentPage: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false
    });
    const cardsPerPage = 6;

    const navigate = useNavigate();
    const location = useLocation();
    const { token, user } = useSelector(state => state.auth);
    const isAdmin = true; // Change this line to always show edit and delete buttons

    const handleProtectedAction = (action, id) => {
        if (action === 'view') {
            navigate(`/view/${id}`);
            return;
        }

        if (action === 'edit' || action === 'delete') {
            if (!token) {
                navigate('/admin', {
                    state: {
                        from: location.pathname,
                        message: 'Please login as admin to perform this action'
                    }
                });
                return;
            }

            if (action === 'delete') {
                handleDelete(id);
            } else {
                navigate(`/edit/${id}`);
            }
        }
    };

    // Update fetchCards to use api instance
    // Replace axios.get with api.get
    const fetchCards = async () => {
        try {
            setIsLoading(true);
            const res = await api.get(`/cards?page=${currentPage}&limit=${cardsPerPage}&loadMore=true`);
            const { cards: newCards, pagination } = res.data;

            await new Promise(resolve => setTimeout(resolve, 100)); // Small delay for smooth transition

            setCards(prevCards => {
                if (currentPage === 1) return newCards;
                return [...prevCards, ...newCards];
            });

            setFilteredCards(prevFiltered => {
                if (currentPage === 1) return newCards;
                return [...prevFiltered, ...newCards];
            });

            setPaginationInfo(pagination);
        } catch (error) {
            console.error('Error fetching data:', error);
            if (error.response?.status === 429) {
                alert('Too many requests. Please wait a moment and try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCards();
    }, [currentPage]); // Add currentPage as dependency

    const handleSearch = (term) => {
        setSearchTerm(term);
        const filtered = cards.filter(card =>
            card.name.toLowerCase().includes(term.toLowerCase()) ||
            card.cnic.includes(term) ||
            card.address.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredCards(filtered);
        // setCurrentPage(1);
    };


    const handleDelete = async (id) => {
        if (!token) {
            alert('Please login to delete cards');
            return;
        }

        if (window.confirm('Are you sure you want to delete this card?')) {
            try {
                await api.delete(`/cards/${id}`);

                // Remove the deleted card from both states
                setCards(prevCards => prevCards.filter(card => card._id !== id));
                setFilteredCards(prevFiltered => prevFiltered.filter(card => card._id !== id));

                // Reset to page 1 if current page becomes empty
                if (filteredCards.length <= cardsPerPage && currentPage > 1) {
                    setCurrentPage(1);
                }

                alert('Card deleted successfully');
                // fetchCards();
            } catch (error) {
                console.error('Error deleting card:', error);
                alert('Error deleting card');
            }
        }
    };

    const generatePDF = (forDownload = false) => {
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text('Identity Cards List', 14, 15);

        const processImages = cards.map(async (card) => {
            if (!card.photo) return { ...card, imageData: null };

            try {
                const response = await fetch(card.photo);
                if (!response.ok) throw new Error('Failed to fetch image');
                const blob = await response.blob();
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve({
                        ...card,
                        imageData: reader.result
                    });
                    reader.readAsDataURL(blob);
                });
            } catch (error) {
                console.error('Error loading image:', error);
                return { ...card, imageData: null };
            }
        });

        Promise.all(processImages).then(cardsWithImages => {
            doc.autoTable({
                head: [['#', 'Photo', 'Name', 'Father\'s Name', 'CNIC', 'DOB', 'Address']],
                body: cardsWithImages.map((card, index) => [
                    index + 1,
                    card.imageData ? { content: '', image: card.imageData } : 'No Image',
                    card.name,
                    card.fathername,
                    card.cnic.replace(/(\d{5})(\d{7})(\d{1})/, '$1-$2-$3'),
                    new Date(card.dob).toLocaleDateString('en-GB'),
                    card.address
                ]),
                startY: 25,
                theme: 'grid',
                styles: {
                    lineColor: [0, 0, 0],
                    fontSize: 10,
                    // cellPadding: 3,
                    valign: 'middle'
                },
                columnStyles: {
                    0: { cellWidth: 10 },
                    1: { cellWidth: 28 },
                    2: { cellWidth: 20 },
                    3: { cellWidth: 20 },
                    4: { cellWidth: 32 },
                    5: { cellWidth: 'auto' }
                },
                bodyStyles: {
                    minCellHeight: 30 // Increased row height for better image display
                },
                didDrawCell: function (data) {
                    if (data.column.index === 1 && data.cell.raw?.image) {
                        const img = data.cell.raw.image;
                        const imgWidth = data.cell.width - 4; // Use full cell width
                        const imgHeight = data.cell.height - 4; // Use full cell height
                        doc.addImage(
                            img,
                            'JPEG',
                            data.cell.x + 2,
                            data.cell.y + 2,
                            imgWidth,
                            imgHeight,
                            null,
                            'FAST'
                        );
                    }
                },
                willDrawCell: function (data) {
                    // Check if row would split across pages
                    if (data.row.index > 0 && data.cell.y + data.cell.height > doc.internal.pageSize.height - 10) {
                        doc.addPage();
                        data.cell.y = 15;
                    }
                },
                didParseCell: function (data) {
                    // Prevent column splitting
                    if (data.row.index > 0 && data.cell.raw === 'No Image') {
                        data.cell.styles.minCellHeight = 30;
                    }
                    // Force page break if cell would split
                    if (data.cell.y + data.cell.height > doc.internal.pageSize.height - 10) {
                        data.cell.pageBreak = 'always';
                    }
                }
            });

            if (forDownload) {
                doc.save('Identity_Cards_List.pdf');
            } else {
                const pdfBlob = doc.output('blob');
                const url = URL.createObjectURL(pdfBlob);
                setPdfUrl(url);
            }
        });
    };

    const downloadAllUsersPDF = () => generatePDF(true);
    const generatePreviewPDF = () => generatePDF(false);

    return (
        <div className="container">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
                <div className="d-flex flex-column flex-sm-row gap-2 w-100 w-md-auto mt-2">
                    {/* <h2 className="mb-0">Identity Cards</h2> */}
                    <div className="btn-group w-100 w-sm-auto gap-2">
                        <button
                            className="btn text-white"
                            onClick={downloadAllUsersPDF}
                            style={{
                                background: 'linear-gradient(90deg, #001510 0%, #00bf8f 100%)',
                                border: 'none',
                                borderRadius:'12px',
                                padding: '0.5rem 1rem',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                transform: 'translateY(0)',
                                ':hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                                }
                            }}
                            onMouseOver={e => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                            }}
                        >
                            <i className="fas fa-download me-1"></i> Download List
                        </button>
                        <button
                            className="btn text-white"
                            onClick={generatePreviewPDF}
                            style={{
                                background: 'linear-gradient(90deg, #00bf8f 0%, #001510 100%)',
                                border: 'none',
                                borderRadius:'12px',
                                padding: '0.5rem 1rem',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                transform: 'translateY(0)',
                                ':hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                                }
                            }}
                            onMouseOver={e => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                            }}
                        >
                            <i className="fas fa-eye me-1"></i> Preview List
                        </button>
                    </div>
                    <div className="btn-group w-100 w-sm-auto gap-2">
                        <button
                            className="btn"
                            onClick={() => setViewMode('table')}
                            style={{
                                background: viewMode === 'table' 
                                    ? 'linear-gradient(90deg, #001510 0%, #00bf8f 100%)'
                                    : 'transparent',
                                color: viewMode === 'table' ? '#ffffff' : '#00bf8f',
                                border: '1px solid #00bf8f',
                                borderRadius:'12px',
                                padding: '0.5rem 1rem',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                transform: 'translateY(0)',
                                ':hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                                }
                            }}
                            onMouseOver={e => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                            }}
                        >
                            <i className="fas fa-list me-1"></i> Table
                        </button>
                        <button
                            className="btn"
                            onClick={() => setViewMode('card')}
                            style={{
                                background: viewMode === 'card' 
                                    ? 'linear-gradient(90deg, #001510 0%, #00bf8f 100%)'
                                    : 'transparent',
                                color: viewMode === 'card' ? '#ffffff' : '#00bf8f',
                                border: '1px solid #00bf8f',
                                borderRadius:'12px',
                                padding: '0.5rem 1rem',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                transform: 'translateY(0)',
                                ':hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                                }
                            }}
                            onMouseOver={e => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                            }}
                        >
                            <i className="fas fa-th-large me-1"></i> Cards
                        </button>
                    </div>
                </div>
            </div>
            {pdfUrl && (
                <div className="card mb-4">
                    <div className="card-body p-0">
                        <div className="d-flex justify-content-between align-items-center p-3">
                            <h4 className="card-title mb-0">PDF Preview</h4>
                            <button
                                className="btn text-white"
                                onClick={() => setPdfUrl(null)}
                                style={{
                                    background: 'linear-gradient(90deg, #001510 0%, #00bf8f 100%)',
                                    border: 'none',
                                    padding: '0.5rem 1rem',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                transform: 'translateY(0)',
                                ':hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                                }
                            }}
                            onMouseOver={e => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                                }}
                            >
                                <i className="fas fa-times me-1"></i> Close Preview
                            </button>
                        </div>
                        <iframe
                            src={pdfUrl}
                            width="100%"
                            height="800px"
                            title="PDF Preview"
                            className="border-0"
                            style={{
                                minHeight: '800px',
                                width: '100%',
                                display: 'block',
                                backgroundColor: '#f8f9fa'
                            }}
                        />
                    </div>
                </div>
            )}

            <Search onSearch={handleSearch} />

            {isLoading && currentPage === 1 ? (
                <LoadingSpinner />
            ) : (
                <>
                    {viewMode === 'table' ? (
                        <TableView
                            cards={filteredCards} // Changed from currentCards
                            onDelete={(id) => handleProtectedAction('delete', id)}
                            onView={(id) => handleProtectedAction('view', id)}
                            handleProtectedAction={handleProtectedAction}
                            showActions={true}
                        />
                    ) : (
                        <CardView
                            cards={filteredCards} // Changed from currentCards
                            onDelete={(id) => handleProtectedAction('delete', id)}
                            onView={(id) => handleProtectedAction('view', id)}
                            handleProtectedAction={handleProtectedAction}
                            showActions={true}
                        />
                    )}

                    {paginationInfo.hasNextPage && (
                        <div className="text-center mt-3">
                            <button
                                className="btn text-white"
                                onClick={() => setCurrentPage(prev => prev + 1)}
                                disabled={isLoading}
                                style={{
                                    background: 'linear-gradient(90deg, #001510 0%, #00bf8f 100%)',
                                    border: 'none',
                                    borderRadius: '12px',
                                    padding: '0.5rem 2rem',
                                    transition: 'all 0.3s ease',
                                    opacity: isLoading ? 0.7 : 1,
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                transform: 'translateY(0)',
                                ':hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                                }
                            }}
                            onMouseOver={e => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                                }}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Loading...
                                    </>
                                ) : (
                                    'Load More'
                                )}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default ViewData;
