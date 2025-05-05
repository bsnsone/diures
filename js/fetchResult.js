async function fetchResult() {
    const studentId = document.getElementById('studentIdInput').value.trim();
    const semesterId = document.getElementById('semesterSelect').value;
    const selectedSemesterName = document.getElementById('semesterSelect').selectedOptions[0].textContent;

    // Validate inputs
    if (!studentId || !semesterId) {
        document.getElementById('resultTable').innerHTML = '<p>Please enter a Student ID and select a Semester.</p>';
        return;
    }

    const loadingDiv = document.getElementById('loading');
    const progressBar = document.getElementById('progressBar');
    const loadingText = document.getElementById('loadingText');
    loadingDiv.style.display = 'block';
    document.getElementById('resultTable').innerHTML = '';

    let progress = 0;
    progressBar.style.width = '0%';
    loadingText.innerText = 'Loading... 0%';

    const interval = setInterval(() => {
        if (progress < 99) {
            const increment = Math.floor(Math.random() * 6) + 1; // Random number between 1 and 6
            progress += increment;
            if (progress > 99) progress = 99; // Ensure progress doesn't exceed 99
            progressBar.style.width = `${progress}%`;
            loadingText.innerText = `Loading... ${progress}%`;
        }
    }, 200);

    try {
        // Fetch student info for name card
        let studentInfo = { studentName: 'N/A', studentId, departmentName: 'N/A', batchNo: 'N/A' };
        let displayBatchNo = 'N/A';

        try {
            const studentInfoUrl = `/api/proxy?path=result/studentInfo&studentId=${encodeURIComponent(studentId)}`;
            const studentInfoRes = await fetch(studentInfoUrl);
            studentInfo = await studentInfoRes.json();

            // Adjust batchNo for SWE department
            displayBatchNo = studentInfo.batchNo;
            if (studentInfo.deptShortName === 'SWE') {
                displayBatchNo = (parseInt(studentInfo.batchNo) - 1).toString();
            }
        } catch (err) {
            console.error('Failed to fetch student info:', err);
            // Continue with results fetch even if student info fails
        }

        // Fetch results using dropdown semesterId
        const resultsUrl = `/api/proxy?path=result&grecaptcha=&semesterId=${encodeURIComponent(semesterId)}&studentId=${encodeURIComponent(studentId)}`;
        const resultsRes = await fetch(resultsUrl);
        const data = await resultsRes.json();

        progress = 100;
        progressBar.style.width = '100%';
        loadingText.innerText = 'Loading... 100%';
        clearInterval(interval);
        setTimeout(() => {
            loadingDiv.style.display = 'none';
        }, 500);

        if (!data.length) {
            document.getElementById("resultTable").innerHTML = "<p>No result found.</p>";
            return;
        }

        let totalCredits = 0, totalPoints = 0;

        const rows = data.map(d => {
            totalCredits += d.totalCredit;
            totalPoints += d.pointEquivalent * d.totalCredit;

            return `
                <tr>
                    <td>${d.customCourseId}</td>
                    <td>${d.courseTitle}</td>
                    <td>${d.totalCredit}</td>
                    <td>${d.gradeLetter}</td>
                    <td>${d.pointEquivalent}</td>
                </tr>`;
        }).join('');

        const cgpa = (totalPoints / totalCredits).toFixed(2);

        // Render name card and results
        document.getElementById("resultTable").innerHTML = `
            <div class="name-card">
                <p><span>Student Name:</span> ${studentInfo.studentName}</p>
                <p><span>Student ID:</span> ${studentInfo.studentId}</p>
                <p><span>Semester:</span> ${selectedSemesterName}</p>
                <p><span>Department:</span> ${studentInfo.departmentName}</p>
                <p><span>Batch No:</span> ${displayBatchNo}</p>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Course Code</th>
                        <th>Course Title</th>
                        <th>Credit</th>
                        <th>Grade</th>
                        <th>Point</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
            <div class="cgpa">Calculated CGPA: ${cgpa}</div>
            <button class="download-btn" onclick="downloadPDF('${studentInfo.studentId}', '${cgpa}', '${studentInfo.studentName}', '${selectedSemesterName}', '${studentInfo.departmentName}', '${displayBatchNo}')">Download PDF</button>
        `;
    } catch (err) {
        console.error('Failed to fetch results:', err);
        progress = 100;
        progressBar.style.width = '100%';
        loadingText.innerText = 'Loading... 100%';
        clearInterval(interval);
        setTimeout(() => {
            loadingDiv.style.display = 'none';
        }, 500);
        document.getElementById("resultTable").innerHTML = "<p>Failed to fetch results. Please try again.</p>";
    }
}
