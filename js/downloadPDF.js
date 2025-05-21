function downloadPDF(studentId, cgpa, studentName, selectedSemesterName, departmentName, batchNo) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Set up colors
    const colors = {
        primary: [99, 102, 241],    // Indigo
        secondary: [139, 92, 246],  // Purple
        text: [30, 41, 59],         // Slate 800
        lightText: [100, 116, 139], // Slate 500
        border: [226, 232, 240],    // Slate 200
        background: [248, 250, 252] // Slate 50
    };

    // Add header with gradient background
    doc.setFillColor(...colors.primary);
    doc.rect(0, 0, 210, 20, 'F');
    
    // Add DIU logo or text
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("DIU Result", 105, 12, { align: "center" });

    // Add student info card with modern design
    const cardX = 14;
    const cardY = 30;
    const cardWidth = 180;
    const cardHeight = 60;

    // Card background with gradient
    doc.setFillColor(...colors.background);
    doc.roundedRect(cardX, cardY, cardWidth, cardHeight, 3, 3, 'F');
    
    // Card border
    doc.setDrawColor(...colors.border);
    doc.setLineWidth(0.5);
    doc.roundedRect(cardX, cardY, cardWidth, cardHeight, 3, 3);

    // Card header
    doc.setFillColor(...colors.primary);
    doc.roundedRect(cardX, cardY, cardWidth, 10, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Student Information", cardX + 5, cardY + 7);

    // Student details
    const fields = [
        { label: "Student Name", value: studentName || 'N/A' },
        { label: "Student ID", value: studentId },
        { label: "Semester", value: selectedSemesterName || 'N/A' },
        { label: "Department", value: departmentName || 'N/A' },
        { label: "Batch No", value: batchNo || 'N/A' }
    ];

    let currentY = cardY + 20;
    fields.forEach(field => {
        // Label
        doc.setTextColor(...colors.lightText);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(field.label + ":", cardX + 5, currentY);
        
        // Value
        doc.setTextColor(...colors.text);
        doc.setFont("helvetica", "bold");
        doc.text(field.value, cardX + 45, currentY);
        
        currentY += 8;
    });

    // Get table data
    const table = document.querySelectorAll("table tbody tr");
    const rows = [];
    table.forEach(row => {
        const cells = row.querySelectorAll("td");
        const rowData = Array.from(cells).map(cell => cell.textContent);
        rows.push(rowData);
    });

    // Add results table with modern styling
    doc.autoTable({
        head: [['Course Code', 'Course Title', 'Credit ', 'Grade ', 'Point']],
        body: rows,
        startY: cardY + cardHeight + 10,
        margin: { top: 5 },
        styles: {
            font: "helvetica",
            fontSize: 10,
            cellPadding: 5,
            lineColor: colors.border,
            lineWidth: 0.1,
            textColor: colors.text,
            overflow: 'linebreak'
        },
        headStyles: {
            fillColor: colors.primary,
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            halign: 'center',
            fontSize: 11
        },
        alternateRowStyles: {
            fillColor: colors.background
        },
        columnStyles: {
            0: { cellWidth: 30, halign: 'center' },
            1: { cellWidth: 'auto', halign: 'left' },
            2: { cellWidth: 25, halign: 'center' },
            3: { cellWidth: 25, halign: 'center' },
            4: { cellWidth: 20, halign: 'center' }
        },
        theme: 'grid'
    });

    // Add CGPA section with modern design
    const finalY = doc.lastAutoTable.finalY + 10;
    
    // CGPA background
    doc.setFillColor(...colors.background);
    doc.roundedRect(14, finalY, 180, 15, 3, 3, 'F');
    
    // CGPA border
    doc.setDrawColor(...colors.border);
    doc.roundedRect(14, finalY, 180, 15, 3, 3);

    // CGPA text
    doc.setTextColor(...colors.text);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Calculated CGPA:", 20, finalY + 10);
    
    // CGPA value with gradient color
    doc.setTextColor(...colors.primary);
    doc.text(cgpa, 60, finalY + 10);

    // Add footer with credits - positioned after CGPA section
    const footerY = finalY + 35;
    doc.setFontSize(8);
    doc.setTextColor(...colors.lightText);
    doc.setFont("helvetica", "normal");
    
    // Footer text with links
    const footerText = "Designed by Shihab733 / @imransihab0";
    doc.text(footerText, 105, footerY, { align: "center" });
    
    // Add clickable links
    doc.setTextColor(...colors.primary);
    doc.textWithLink("Shihab733", 105 - doc.getTextWidth(footerText)/2 + doc.getTextWidth("Designed by "), footerY, 
        { url: 'https://www.facebook.com/imranulislamshihab' });
    doc.textWithLink("@imransihab0", 105 - doc.getTextWidth(footerText)/2 + doc.getTextWidth("Designed by Shihab733 / "), footerY, 
        { url: 'https://github.com/imransihab0' });

    // Save PDF
    doc.save(`${studentId}_result.pdf`);
}
