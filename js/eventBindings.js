import { downloadPDF } from './downloadPDF.js';

document.addEventListener("DOMContentLoaded", () => {
    // Bind the semester dropdown
    fetchSemesters();

    // Bind the search button
    document.querySelector("button").addEventListener("click", fetchResult);

    // Bind the download button
    const downloadBtn = document.getElementById("downloadPdfBtn");
    if (downloadBtn) {
        downloadBtn.addEventListener("click", () => {
            const studentId = document.getElementById("studentIdInput").value;
            const selectedSemesterName = document.getElementById("semesterSelect").selectedOptions[0]?.text || 'N/A';

            // Access global variables (assigned when rendering results)
            const studentName = window.studentName || 'N/A';
            const cgpa = window.calculatedCGPA || '0.00';
            const departmentName = window.departmentName || 'N/A';
            const batchNo = window.batchNo || 'N/A';

            downloadPDF(studentId, cgpa, studentName, selectedSemesterName, departmentName, batchNo);
        });
    }
});
