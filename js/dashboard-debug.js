// Dashboard Debug Helper
// Add this to help debug dashboard issues

function debugDashboard() {
    console.log('=== DASHBOARD DEBUG ===');
    
    // Check localStorage data
    const students = localStorage.getItem('students');
    const payments = localStorage.getItem('payments');
    
    console.log('Students in localStorage:', students ? JSON.parse(students).length : 0);
    console.log('Payments in localStorage:', payments ? JSON.parse(payments).length : 0);
    
    if (students) {
        const studentData = JSON.parse(students);
        console.log('Sample student:', studentData[0]);
    }
    
    if (payments) {
        const paymentData = JSON.parse(payments);
        console.log('Sample payment:', paymentData[0]);
    }
    
    // Check DOM elements
    const elements = [
        'totalRevenue',
        'totalStudents', 
        'paymentsToday',
        'todayAmount',
        'outstandingCount',
        'recentPayments'
    ];
    
    elements.forEach(id => {
        const element = document.getElementById(id);
        console.log(`Element ${id}:`, element ? 'Found' : 'NOT FOUND');
        if (element) {
            console.log(`  Current content: "${element.textContent || element.innerHTML}"`);
        }
    });
    
    console.log('=== END DEBUG ===');
}

// Auto-run debug on page load
window.addEventListener('load', function() {
    setTimeout(debugDashboard, 500);
});

// Make debug function available globally
window.debugDashboard = debugDashboard;