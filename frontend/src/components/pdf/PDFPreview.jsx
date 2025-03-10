import React from 'react';

function PDFPreview({ pdfUrl, onClose }) {
    return (
        <div className="card mt-4">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="card-title mb-0">PDF Preview</h4>
                    <button 
                        className="btn btn-secondary"
                        onClick={onClose}
                    >
                        Close Preview
                    </button>
                </div>
                <iframe
                    src={pdfUrl}
                    width="100%"
                    height="600px"
                    title="PDF Preview"
                    className="border-0"
                />
            </div>
        </div>
    );
}

export default PDFPreview;