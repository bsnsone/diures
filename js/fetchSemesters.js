// Fetch and populate semester dropdown on page load
async function fetchSemesters() {
    try {
        const response = await fetch('/api/proxy?path=result/semesterList');
        const semesters = await response.json();
        const semesterSelect = document.getElementById('semesterSelect');

        // Clear existing options except the placeholder
        semesterSelect.innerHTML = '<option value="">Select Semester</option>';

        // Add semester options
        semesters.forEach(semester => {
            const option = document.createElement('option');
            option.value = semester.semesterId;
            option.textContent = `${semester.semesterName} ${semester.semesterYear}`;
            semesterSelect.appendChild(option);
        });
    } catch (err) {
        console.error('Failed to fetch semesters:', err);
        document.getElementById('semesterSelect').innerHTML = '<option value="">Error loading semesters</option>';
    }
}

// Call fetchSemesters on page load
document.addEventListener('DOMContentLoaded', fetchSemesters);
