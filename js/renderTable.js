function renderTable(results) {
    const rows = results.map(r => `
        <tr>
            <td>${r.customCourseId}</td>
            <td>${r.courseTitle}</td>
            <td>${r.totalCredit}</td>
            <td>${r.gradeLetter}</td>
            <td>${r.pointEquivalent}</td>
        </tr>
    `).join('');

    return `
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
            <tbody>${rows}</tbody>
        </table>
    `;
}
