async function fetchResult() {
    const studentId = document.getElementById("studentIdInput").value.trim();
    const semesterId = document.getElementById("semesterSelect").value;
    const selectedSemesterName = document.getElementById("semesterSelect").selectedOptions[0]?.textContent;

    if (!studentId || !semesterId) {
        document.getElementById("resultTable").innerHTML = "<p>Please enter a Student ID and select a Semester.</p>";
        return;
    }

    startLoading();
    try {
        let studentInfo = await fetchStudentInfo(studentId);
        const results = await fetchStudentResults(studentId, semesterId);

        if (!results.length) {
            document.getElementById("resultTable").innerHTML = "<p>No result found.</p>";
            stopLoading();
            return;
        }

        const cgpa = calculateCGPA(results);
        const tableHTML = renderTable(results);
        const nameCardHTML = renderNameCard(studentInfo, selectedSemesterName);

        document.getElementById("resultTable").innerHTML = `
            ${nameCardHTML}
            ${tableHTML}
            <div class="cgpa">Calculated CGPA: ${cgpa}</div>
            <button class="download-btn" onclick="downloadPDF('${studentInfo.studentId}', '${cgpa}', '${studentInfo.studentName}', '${selectedSemesterName}', '${studentInfo.departmentName}', '${studentInfo.batchNo}')">Download PDF</button>
        `;
    } catch (err) {
        console.error("Error fetching result:", err);
        document.getElementById("resultTable").innerHTML = "<p>Something went wrong. Please try again.</p>";
    }
    stopLoading();
}

async function fetchStudentInfo(studentId) {
    const res = await fetch(`/api/proxy?path=result/studentInfo&studentId=${encodeURIComponent(studentId)}`);
    let info = await res.json();
    if (info.deptShortName === "SWE") {
        info.batchNo = (parseInt(info.batchNo) - 1).toString();
    }
    return info;
}

async function fetchStudentResults(studentId, semesterId) {
    const res = await fetch(`/api/proxy?path=result&semesterId=${encodeURIComponent(semesterId)}&studentId=${encodeURIComponent(studentId)}`);
    return await res.json();
}

async function fetchSemesters() {
    try {
        const res = await fetch("/api/proxy?path=result/semesterList");
        const semesters = await res.json();
        const select = document.getElementById("semesterSelect");
        select.innerHTML = '<option value="">Select Semester</option>';
        semesters.forEach(sem => {
            const opt = document.createElement("option");
            opt.value = sem.semesterId;
            opt.textContent = `${sem.semesterName} ${sem.semesterYear}`;
            select.appendChild(opt);
        });
    } catch (e) {
        console.error("Failed to load semesters:", e);
    }
}
