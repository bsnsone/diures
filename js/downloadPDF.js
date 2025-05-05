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

    // Header
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    const x = 14, y = 10;

    doc.setTextColor(0, 0, 0);
    const text1 = "designedby";
    doc.text(text1, x, y);
    const width1 = doc.getTextWidth(text1);

    doc.setTextColor(255, 0, 0);
    doc.textWithLink("Shihab733", x + width1, y, { url: 'https://www.facebook.com/imranulislamshihab' });
    const width2 = doc.getTextWidth("Shihab733");

    doc.setTextColor(0, 0, 0);
    doc.text("/", x + width1 + width2, y);
    const width3 = doc.getTextWidth("/");

    doc.setTextColor(255, 0, 0);
    doc.textWithLink("@imransihab0", x + width1 + width2 + width3, y, { url: 'https://github.com/imransihab0' });

    // Info Box
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const cardX = 14, cardY = y + 15;
    const cardWidth = 180, cardHeight = 50, lineHeight = 8;
    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 102, 204);
    doc.rect(cardX, cardY, cardWidth, cardHeight);

    const fields = [
        { label: "Student Name:", value: studentName || 'N/A' },
        { label: "Student ID:", value: studentId },
        { label: "Semester:", value: selectedSemesterName || 'N/A' },
        { label: "Department:", value: departmentName || 'N/A' },
        { label: "Batch No:", value: batchNo || 'N/A' }
    ];

    let currentY = cardY + 8;
    fields.forEach(field => {
        doc.setTextColor(0, 102, 204);
        doc.setFont("helvetica", "bold");
        doc.text(field.label, cardX + 5, currentY);
        const labelWidth = doc.getTextWidth(field.label);
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "normal");
        doc.text(field.value, cardX + 5 + labelWidth + 2, currentY);
        currentY += lineHeight;
    });

    // Table
    doc.autoTable({
        head: [['Course Code', 'Course Title', 'Credit', 'Grade', 'Point']],
        body: rows,
        startY: cardY + cardHeight + 10,
        margin: { top: 10 }
    });

    const finalY = doc.lastAutoTable.finalY || cardY + cardHeight + 10;
    doc.setTextColor(0, 0, 0);
    doc.text("Calculated CGPA: ", 14, finalY + 10);
    const labelWidth = doc.getTextWidth("Calculated CGPA: ");
    doc.setTextColor(255, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text(`${cgpa}`, 14 + labelWidth, finalY + 10);

    doc.save(`${studentId}_result.pdf`);
}
