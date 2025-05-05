function calculateCGPA(results) {
    let totalCredits = 0;
    let totalPoints = 0;

    results.forEach(r => {
        totalCredits += r.totalCredit;
        totalPoints += r.totalCredit * r.pointEquivalent;
    });

    return (totalPoints / totalCredits).toFixed(2);
}
