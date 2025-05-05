function renderNameCard(info, semesterName) {
    return `
        <div class="name-card">
            <p><span>Student Name:</span> ${info.studentName}</p>
            <p><span>Student ID:</span> ${info.studentId}</p>
            <p><span>Semester:</span> ${semesterName}</p>
            <p><span>Department:</span> ${info.departmentName}</p>
            <p><span>Batch No:</span> ${info.batchNo}</p>
        </div>
    `;
}
