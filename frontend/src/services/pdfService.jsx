import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateListPDF = (cards) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Users List', 14, 20);

    const tableColumn = ['Name', "Father's Name", 'CNIC', 'DOB', 'Address'];
    const tableRows = cards.map((card) => [
        card.name,
        card.fathername,
        card.cnic,
        card.dob,
        card.address
    ]);

    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 30,
        styles: { fontSize: 10 },
        columnStyles: {
            0: { cellWidth: 30 },
            1: { cellWidth: 40 },
            2: { cellWidth: 30 },
            3: { cellWidth: 30 },
            4: { cellWidth: 50 }
        }
    });

    return doc;
};

export const generateCardPDF = (card) => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('PAKISTAN', 70, 20);
    doc.setFontSize(16);
    doc.text('National Identity Card', 70, 30);
    doc.setFontSize(14);
    doc.text('ISLAMIC REPUBLIC OF PAKISTAN', 70, 40);

    doc.setFontSize(12);
    doc.text('Name', 20, 60);
    doc.text(card.name, 20, 70);
    
    doc.text('Father\'s Name', 20, 85);
    doc.text(card.fathername, 20, 95);
    
    doc.text('Identity Number', 20, 110);
    doc.text(card.cnic, 20, 120);
    
    doc.text('Date of Birth', 120, 110);
    doc.text(card.dob, 120, 120);

    doc.text('Address', 20, 135);
    doc.text(card.address, 20, 145, { maxWidth: 170 });

    return doc;
};