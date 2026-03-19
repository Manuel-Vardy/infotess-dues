// Admin Dashboard Logic
checkAuth();

function getStudents() {
    const students = localStorage.getItem('students');
    return students ? JSON.parse(students) : [];
}

function getPayments() {
    const payments = localStorage.getItem('payments');
    return payments ? JSON.parse(payments) : [];
}

// Update dashboard statistics
function updateDashboardStats() {
    console.log('updateDashboardStats called');
    
    const students = getStudents();
    const payments = getPayments();
    
    console.log('Data loaded:', { students: students.length, payments: payments.length });
    
    // Total revenue
    const totalRevenue = payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
    const totalRevenueEl = document.getElementById('totalRevenue');
    if (totalRevenueEl) {
        totalRevenueEl.textContent = `GH₵ ${totalRevenue.toFixed(2)}`;
        console.log('Updated total revenue:', totalRevenue);
    } else {
        console.error('totalRevenue element not found');
    }
    
    // Total students
    const totalStudentsEl = document.getElementById('totalStudents');
    if (totalStudentsEl) {
        totalStudentsEl.textContent = students.length;
        console.log('Updated total students:', students.length);
    } else {
        console.error('totalStudents element not found');
    }
    
    // Payments today
    const today = new Date().toDateString();
    const todayPayments = payments.filter(p => new Date(p.date).toDateString() === today);
    const todayAmount = todayPayments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
    
    const paymentsTodayEl = document.getElementById('paymentsToday');
    if (paymentsTodayEl) {
        paymentsTodayEl.textContent = todayPayments.length;
        console.log('Updated payments today:', todayPayments.length);
    } else {
        console.error('paymentsToday element not found');
    }
    
    const todayAmountEl = document.getElementById('todayAmount');
    if (todayAmountEl) {
        todayAmountEl.textContent = `GH₵ ${todayAmount.toFixed(2)}`;
        console.log('Updated today amount:', todayAmount);
    } else {
        console.error('todayAmount element not found');
    }
    
    // Outstanding
    const paidStudents = [...new Set(payments.map(p => p.indexNumber))];
    const outstanding = students.length - paidStudents.length;
    const outstandingCountEl = document.getElementById('outstandingCount');
    if (outstandingCountEl) {
        outstandingCountEl.textContent = outstanding;
        console.log('Updated outstanding:', outstanding);
    } else {
        console.error('outstandingCount element not found');
    }
    
    // Update additional elements if they exist
    const revenueChangeEl = document.getElementById('revenueChange');
    if (revenueChangeEl) {
        revenueChangeEl.textContent = `${payments.length} total payments`;
    }
    
    const studentsByLevelEl = document.getElementById('studentsByLevel');
    if (studentsByLevelEl) {
        const levelCounts = students.reduce((acc, s) => {
            acc[s.level] = (acc[s.level] || 0) + 1;
            return acc;
        }, {});
        const levelText = Object.entries(levelCounts).map(([level, count]) => `L${level}: ${count}`).join(', ');
        studentsByLevelEl.textContent = levelText || 'No students';
    }
    
    const outstandingTextEl = document.getElementById('outstandingText');
    if (outstandingTextEl) {
        outstandingTextEl.textContent = outstanding === 0 ? 'All paid' : 'Students';
    }
}

// Load recent payments
function loadRecentPayments() {
    const payments = getPayments();
    const students = getStudents();
    const tbody = document.getElementById('recentPayments');
    
    if (!tbody) {
        console.log('Recent payments table not found');
        return;
    }
    
    tbody.innerHTML = '';
    
    if (payments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No payments recorded yet</td></tr>';
        return;
    }
    
    // Get last 5 payments
    const recentPayments = payments.slice(-5).reverse();
    
    recentPayments.forEach(payment => {
        const student = students.find(s => s.indexNumber === payment.indexNumber);
        const studentName = student ? student.fullName : 'Unknown Student';
        
        const row = `
            <tr>
                <td>${studentName}</td>
                <td>${payment.indexNumber}</td>
                <td>GH₵ ${parseFloat(payment.amount || 0).toFixed(2)}</td>
                <td><span class="badge bg-info">${payment.paymentMethod || 'Unknown'}</span></td>
                <td>${new Date(payment.date).toLocaleDateString()}</td>
                <td><span class="badge bg-success">Paid</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="viewPaymentDetails('${payment.id}')">
                        <i class="bi bi-eye"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
    
    console.log('Loaded recent payments:', recentPayments.length);
}

// Record payment form
const recordPaymentForm = document.getElementById('recordPaymentForm');
if (recordPaymentForm) {
    recordPaymentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        window.location.href = 'payments.html';
    });
}

// View payment details
function viewPaymentDetails(paymentId) {
    localStorage.setItem('currentReceipt', paymentId);
    window.open('receipt.html', '_blank');
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard initializing...');
    updateDashboardStats();
    loadRecentPayments();
});

// Also initialize immediately in case DOMContentLoaded already fired
updateDashboardStats();
loadRecentPayments();

// Refresh dashboard every 30 seconds
setInterval(function() {
    updateDashboardStats();
    loadRecentPayments();
}, 30000);
