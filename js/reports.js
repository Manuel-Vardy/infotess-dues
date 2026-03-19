// Reports & Analytics
checkAuth();

function getStudents() {
    const students = localStorage.getItem('students');
    return students ? JSON.parse(students) : [];
}

function getPayments() {
    const payments = localStorage.getItem('payments');
    return payments ? JSON.parse(payments) : [];
}

function updateStats() {
    const students = getStudents();
    const payments = getPayments();
    
    const uniquePaidStudents = [...new Set(payments.map(p => p.indexNumber))];
    const totalPaid = uniquePaidStudents.length;
    const totalOutstanding = students.length - totalPaid;
    const collectionRate = students.length > 0 ? ((totalPaid / students.length) * 100).toFixed(1) : 0;
    
    document.getElementById('totalStudents').textContent = students.length;
    document.getElementById('totalPaid').textContent = totalPaid;
    document.getElementById('totalOutstanding').textContent = totalOutstanding;
    document.getElementById('collectionRate').textContent = collectionRate + '%';
}

function generateReport(type) {
    const students = getStudents();
    const payments = getPayments();
    
    if (students.length === 0) {
        alert('No students found! Please add students first.');
        return;
    }
    
    let reportTitle = '';
    let reportHtml = '';
    
    switch(type) {
        case 'summary':
            reportTitle = 'Payment Summary Report';
            reportHtml = generatePaymentSummaryHtml(payments);
            break;
        case 'students':
            reportTitle = 'Student Distribution Report';
            reportHtml = generateStudentReportHtml(students, payments);
            break;
        case 'outstanding':
            reportTitle = 'Outstanding Payments Report';
            reportHtml = generateOutstandingReportHtml(students, payments);
            break;
    }
    
    // Update modal content
    document.getElementById('reportTitle').textContent = reportTitle;
    document.getElementById('reportDate').textContent = new Date().toLocaleString();
    document.getElementById('reportContent').innerHTML = reportHtml;
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('reportPreviewModal'));
    modal.show();
}

async function downloadReportPDF() {
    const container = document.getElementById('reportContainer');
    const reportTitle = document.getElementById('reportTitle').textContent;
    
    const btn = event.currentTarget;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Generating...';
    btn.disabled = true;

    const opt = {
        margin: 10,
        filename: `${reportTitle.replace(/\s+/g, '_')}_${new Date().toLocaleDateString()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2, 
            useCORS: true, 
            letterRendering: true
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
        await html2pdf().set(opt).from(container).save();
    } catch (error) {
        console.error('PDF Generation Error:', error);
        alert('Failed to generate PDF. Error: ' + error.message);
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

function generatePaymentSummaryHtml(payments) {
    const total = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
    const byMethod = payments.reduce((acc, p) => {
        acc[p.paymentMethod] = (acc[p.paymentMethod] || 0) + parseFloat(p.amount);
        return acc;
    }, {});

    return `
        <div class="report-section mb-4">
            <h4 class="border-bottom pb-2">Financial Overview</h4>
            <div style="display: flex; gap: 20px; margin-top: 15px;">
                <div style="flex: 1; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                    <p class="text-muted mb-1">Total Transactions</p>
                    <h3>${payments.length}</h3>
                </div>
                <div style="flex: 1; padding: 15px; background: #fff5f5; border-radius: 8px;">
                    <p class="text-muted mb-1">Total Revenue</p>
                    <h3 style="color: #800020;">GH₵ ${total.toFixed(2)}</h3>
                </div>
            </div>
        </div>
        <div class="report-section mb-4">
            <h4 class="border-bottom pb-2">Breakdown by Payment Method</h4>
            <table class="table mt-2">
                <thead><tr><th>Method</th><th>Amount</th></tr></thead>
                <tbody>
                    ${Object.entries(byMethod).map(([method, amount]) => `
                        <tr><td>${method}</td><td>GH₵ ${amount.toFixed(2)}</td></tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        <div class="report-section">
            <h4 class="border-bottom pb-2">Recent Payment Activity</h4>
            <table class="table mt-2">
                <thead><tr><th>Date</th><th>Student ID</th><th>Amount</th><th>Method</th></tr></thead>
                <tbody>
                    ${payments.slice(0, 10).map(p => `
                        <tr>
                            <td>${new Date(p.date).toLocaleDateString()}</td>
                            <td>${p.indexNumber}</td>
                            <td>GH₵ ${parseFloat(p.amount).toFixed(2)}</td>
                            <td>${p.paymentMethod}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function generateStudentReportHtml(students, payments) {
    const byLevel = students.reduce((acc, s) => {
        acc[s.level] = (acc[s.level] || 0) + 1;
        return acc;
    }, {});

    return `
        <div class="report-section mb-4">
            <h4 class="border-bottom pb-2">Enrollment Overview</h4>
            <div style="display: flex; gap: 20px; margin-top: 15px;">
                <div style="flex: 1; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                    <p class="text-muted mb-1">Total Registered Students</p>
                    <h3>${students.length}</h3>
                </div>
            </div>
        </div>
        <div class="report-section">
            <h4 class="border-bottom pb-2">Breakdown by Academic Level</h4>
            <table class="table mt-2">
                <thead><tr><th>Level</th><th>Student Count</th></tr></thead>
                <tbody>
                    ${Object.entries(byLevel).sort().map(([level, count]) => `
                        <tr><td>Level ${level}</td><td>${count} students</td></tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function generateOutstandingReportHtml(students, payments) {
    const paidIndexes = [...new Set(payments.map(p => p.indexNumber))];
    const outstanding = students.filter(s => !paidIndexes.includes(s.indexNumber));

    return `
        <div class="report-section mb-4">
            <h4 class="border-bottom pb-2">Collection Status</h4>
            <div style="display: flex; gap: 20px; margin-top: 15px;">
                <div style="flex: 1; padding: 15px; background: #fff5f5; border-radius: 8px;">
                    <p class="text-muted mb-1">Students with Outstanding Dues</p>
                    <h3 style="color: #dc3545;">${outstanding.length}</h3>
                </div>
                <div style="flex: 1; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                    <p class="text-muted mb-1">Percentage Outstanding</p>
                    <h3>${((outstanding.length / students.length) * 100).toFixed(1)}%</h3>
                </div>
            </div>
        </div>
        <div class="report-section">
            <h4 class="border-bottom pb-2">Defaulters List (Top 20)</h4>
            <table class="table mt-2">
                <thead><tr><th>Full Name</th><th>Index Number</th><th>Level</th></tr></thead>
                <tbody>
                    ${outstanding.slice(0, 20).map(s => `
                        <tr>
                            <td>${s.fullName}</td>
                            <td>${s.indexNumber}</td>
                            <td>${s.level}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

updateStats();
