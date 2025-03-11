import React, { useEffect, useState } from 'react';
import Search from '../components/common/Search';
import Pagination from '../components/common/Pagination';
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
    const cardsPerPage = 10;
    
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
            const res = await api.get('/cards');
            const cardsData = Array.isArray(res.data) ? res.data : res.data.cards || [];
            setCards(cardsData);
            setFilteredCards(cardsData);
        } catch (error) {
            console.error('Error fetching data:', error);
            if (error.response?.status === 429) {
                alert('Too many requests. Please wait a moment and try again.');
            }
            setCards([]);
            setFilteredCards([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCards();
    }, []); // Remove cards dependency to prevent infinite loop

    const handleSearch = (term) => {
        setSearchTerm(term);
        const filtered = cards.filter(card => 
            card.name.toLowerCase().includes(term.toLowerCase()) ||
            card.cnic.includes(term) ||
            card.address.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredCards(filtered);
        setCurrentPage(1);
    };
    
    // Calculate pagination
    const indexOfLastCard = currentPage * cardsPerPage;
    const indexOfFirstCard = indexOfLastCard - cardsPerPage;
    const currentCards = filteredCards.slice(indexOfFirstCard, indexOfLastCard);
    const totalPages = Math.ceil(filteredCards.length / cardsPerPage);

    const handleDelete = async (id) => {
        if (!token) {
            alert('Please login to delete cards');
            return;
        }

        if (window.confirm('Are you sure you want to delete this card?')) {
            try {
                await api.delete(`/api/cards/${id}`);
                alert('Card deleted successfully');
                fetchCards();
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
                didDrawCell: function(data) {
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
                willDrawCell: function(data) {
                    // Check if row would split across pages
                    if (data.row.index > 0 && data.cell.y + data.cell.height > doc.internal.pageSize.height - 10) {
                        doc.addPage();
                        data.cell.y = 15;
                    }
                },
                didParseCell: function(data) {
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
                <h2 className="mb-0">Identity Cards</h2>
                <div className="d-flex flex-column flex-sm-row gap-2 w-100 w-md-auto">
                    <div className="btn-group w-100 w-sm-auto">
                        <button 
                            className="btn btn-success text-nowrap"
                            onClick={downloadAllUsersPDF}
                        >
                            <i className="fas fa-download me-1"></i> Download List
                        </button>
                        <button 
                            className="btn btn-info text-nowrap"
                            onClick={generatePreviewPDF}
                        >
                            <i className="fas fa-eye me-1"></i> Preview List
                        </button>
                    </div>
                    <div className="btn-group w-100 w-sm-auto">
                        <button 
                            className={`btn ${viewMode === 'table' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setViewMode('table')}
                        >
                            <i className="fas fa-list me-1"></i> Table
                        </button>
                        <button 
                            className={`btn ${viewMode === 'card' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setViewMode('card')}
                        >
                            <i className="fas fa-th-large me-1"></i> Cards
                        </button>
                    </div>
                </div>
            </div>
            {pdfUrl && (
                <div className="card mb-4">
                    <div className="card-body p-0">  {/* Removed padding */}
                        <div className="d-flex justify-content-between align-items-center p-3">  {/* Added padding to header */}
                            <h4 className="card-title mb-0">PDF Preview</h4>
                            <button 
                                className="btn btn-secondary"
                                onClick={() => setPdfUrl(null)}
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
            
            {isLoading ? <LoadingSpinner /> : (
                <>
                    {viewMode === 'table' ? (
                        <TableView 
                            cards={currentCards} 
                            onDelete={(id) => handleProtectedAction('delete', id)}
                            onView={(id) => handleProtectedAction('view', id)}
                            handleProtectedAction={handleProtectedAction}
                            showActions={true}  // Force show actions
                        />
                    ) : (
                        <CardView 
                            cards={currentCards} 
                            onDelete={(id) => handleProtectedAction('delete', id)}
                            onView={(id) => handleProtectedAction('view', id)}
                            handleProtectedAction={handleProtectedAction}
                            showActions={true}  // Force show actions
                        />
                    )}
                    
                    {totalPages > 1 && (
                        <Pagination 
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </>
            )}
        </div>
    );
}

export default ViewData;