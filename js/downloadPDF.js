function downloadPDF(studentId, cgpa, studentName, selectedSemesterName, departmentName, batchNo) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const table = document.querySelectorAll("table tbody tr");
    const rows = [];

    table.forEach(row => {
        const cells = row.querySelectorAll("td");
        const rowData = Array.from(cells).map(cell => cell.textContent);
        rows.push(rowData);
    });

    // Render "designedbyShihab733/@imransihab0" at the top
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    const x = 14;
    const y = 10;

    doc.setTextColor(0, 0, 0); // Black for "designedby"
    const text1 = "designedby";
    doc.text(text1, x, y);
    const width1 = doc.getTextWidth(text1);

    doc.setTextColor(255, 0, 0); // Red for "Shihab733"
    const link1 = "Shihab733";
    doc.textWithLink(link1, x + width1, y, { url: 'https://www.facebook.com/imranulislamshihab' });
    const width2 = doc.getTextWidth(link1);

    doc.setTextColor(0, 0, 0); // Black for "/"
    const text2 = "/";
    doc.text(text2, x + width1 + width2, y);
    const width3 = doc.getTextWidth(text2);

    doc.setTextColor(255, 0, 0); // Red for "@imransihab0"
    const link2 = "@imransihab0";
    doc.textWithLink(link2, x + width1 + width2 + width3, y, { url: 'https://github.com/imransihab0' });
    const width4 = doc.getTextWidth(link2);

    // Render name card
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const cardX = 14;
    const cardY = y + 15; // Below "designedbyShihab733/@imransihab0"
    const cardWidth = 180;
    const cardHeight = 50;
    const lineHeight = 8;

    // Draw border
    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 102, 204); // Blue border (#0066cc)
    doc.rect(cardX, cardY, cardWidth, cardHeight);

    // Render fields
    const fields = [
        { label: "Student Name:", value: studentName || 'N/A' },
        { label: "Student ID:", value: studentId },
        { label: "Semester:", value: selectedSemesterName || 'N/A' },
        { label: "Department:", value: departmentName || 'N/A' },
        { label: "Batch No:", value: batchNo || 'N/A' }
    ];

    let currentY = cardY + 8;
    fields.forEach(field => {
        doc.setTextColor(0, 102, 204); // Blue for label
        doc.setFont("helvetica", "bold");
        doc.text(field.label, cardX + 5, currentY);
        const labelWidth = doc.getTextWidth(field.label);
        doc.setTextColor(0, 0, 0); // Black for value
        doc.setFont("helvetica", "normal");
        doc.text(field.value, cardX + 5 + labelWidth + 2, currentY);
        currentY += lineHeight;
    });

    // Reset font and size for subsequent text
    doc.setTextColor(0, 0, 0); // Black
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    // Add table
    doc.autoTable({
        head: [['Course Code', 'Course Title', 'Credit', 'Grade', 'Point']],
        body: rows,
        startY: cardY + cardHeight + 10,
        margin: { top: 10 }
    });

    // Add "Calculated CGPA" with value in red and bold
    const finalY = doc.lastAutoTable.finalY || cardY + cardHeight + 10;
    const cgpaLabel = "Calculated CGPA: ";
    doc.setTextColor(0, 0, 0); // Black for label
    doc.setFont("helvetica", "normal");
    doc.text(cgpaLabel, 14, finalY + 10);
    const labelWidth = doc.getTextWidth(cgpaLabel);
    doc.setTextColor(255, 0, 0); // Red for CGPA value
    doc.setFont("helvetica", "bold");
    doc.text(`${cgpa}`, 14 + labelWidth, finalY + 10);
    doc.setFont("helvetica", "normal"); // Reset font

    // Save PDF
    doc.save(`${studentId}_result.pdf`);
}
