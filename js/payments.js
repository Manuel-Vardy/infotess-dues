// Payment Management
checkAuth();

// Get payments from localStorage
function getPayments() {
    const payments = localStorage.getItem('payments');
    return payments ? JSON.parse(payments) : [];
}

// Save payments to localStorage
function savePayments(payments) {
    localStorage.setItem('payments', JSON.stringify(payments));
}

// Get students from localStorage
function getStudents() {
    const students = localStorage.getItem('students');
    return students ? JSON.parse(students) : [];
}

// Load payments table
function loadPayments() {
    const payments = getPayments();
    const students = getStudents();
    const tbody = document.getElementById('paymentsTable');
    const searchTerm = document.getElementById('searchPayment')?.value.toLowerCase() || '';
    const filterYear = document.getElementById('filterYear')?.value || '';
    const filterMethod = document.getElementById('filterMethod')?.value || '';
    
    // Filter payments
    let filteredPayments = payments.filter(payment => {
        const student = students.find(s => s.indexNumber === payment.indexNumber);
        const studentName = student ? student.fullName.toLowerCase() : '';
        const matchesSearch = studentName.includes(searchTerm) || 
                            payment.indexNumber.toLowerCase().includes(searchTerm) ||
                            payment.receiptNumber.toLowerCase().includes(searchTerm);
        const matchesYear = !filterYear || payment.academicYear === filterYear;
        const matchesMethod = !filterMethod || payment.paymentMethod === filterMethod;
        return matchesSearch && matchesYear && matchesMethod;
    });
    
    tbody.innerHTML = '';
    
    if (filteredPayments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="text-center text-muted">No payments found</td></tr>';
        return;
    }
    
    filteredPayments.reverse().forEach(payment => {
        const student = students.find(s => s.indexNumber === payment.indexNumber);
        const studentName = student ? student.fullName : 'Unknown';
        
        const row = `
            <tr>
                <td><strong>${payment.receiptNumber}</strong></td>
                <td>${studentName}</td>
                <td>${payment.indexNumber}</td>
                <td>GH₵ ${parseFloat(payment.amount).toFixed(2)}</td>
                <td>${payment.academicYear}</td>
                <td>${payment.semester}</td>
                <td><span class="badge bg-info">${payment.paymentMethod}</span></td>
                <td>${new Date(payment.date).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="viewReceipt('${payment.id}')">
                        <i class="bi bi-receipt"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deletePayment('${payment.id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
    
    updateStats();
}

// Update statistics
function updateStats() {
    const payments = getPayments();
    const today = new Date().toDateString();
    
    const todayPayments = payments.filter(p => new Date(p.date).toDateString() === today);
    const todayTotal = todayPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
    
    const totalRevenue = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
    const avgPayment = payments.length > 0 ? totalRevenue / payments.length : 0;
    
    document.getElementById('todayCollection').textContent = `GH₵ ${todayTotal.toFixed(2)}`;
    document.getElementById('todayCount').textContent = `${todayPayments.length} payments`;
    document.getElementById('totalPayments').textContent = payments.length;
    document.getElementById('totalRevenue').textContent = `GH₵ ${totalRevenue.toFixed(2)}`;
    document.getElementById('avgPayment').textContent = `GH₵ ${avgPayment.toFixed(2)}`;
}

// Student lookup
const indexInput = document.getElementById('paymentIndexNumber');
if (indexInput) {
    indexInput.addEventListener('blur', function() {
        const indexNumber = this.value;
        const students = getStudents();
        const student = students.find(s => s.indexNumber === indexNumber);
        const infoDiv = document.getElementById('studentInfo');
        
        if (student) {
            infoDiv.innerHTML = `
                <div class="alert alert-success">
                    <strong>${student.fullName}</strong><br>
                    Level ${student.level} - Class ${student.class}
                </div>
            `;
        } else if (indexNumber) {
            infoDiv.innerHTML = `
                <div class="alert alert-warning">
                    Student not found. Please check the index number.
                </div>
            `;
        } else {
            infoDiv.innerHTML = '';
        }
    });
}

// Record payment form
const recordPaymentForm = document.getElementById('recordPaymentForm');
if (recordPaymentForm) {
    recordPaymentForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const indexNumber = document.getElementById('paymentIndexNumber').value;
        const students = getStudents();
        const student = students.find(s => s.indexNumber === indexNumber);
        
        if (!student) {
            alert('Error: Student not found! Please add the student first.');
            return;
        }
        
        const payments = getPayments();
        const receiptNumber = 'RCP' + Date.now();
        
        const newPayment = {
            id: Date.now().toString(),
            receiptNumber: receiptNumber,
            indexNumber: indexNumber,
            amount: document.getElementById('paymentAmount').value,
            academicYear: document.getElementById('paymentYear').value,
            semester: document.getElementById('paymentSemester').value,
            paymentMethod: document.getElementById('paymentMethod').value,
            date: new Date().toISOString()
        };
        
        payments.push(newPayment);
        savePayments(payments);
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('recordPaymentModal'));
        modal.hide();
        
        // Reset form
        recordPaymentForm.reset();
        document.getElementById('studentInfo').innerHTML = '';
        
        // Reload table
        loadPayments();
        
        // Show sending email message
        const sendingAlert = document.createElement('div');
        sendingAlert.className = 'alert alert-info position-fixed top-0 start-50 translate-middle-x mt-3';
        sendingAlert.style.zIndex = '9999';
        sendingAlert.innerHTML = '<i class="bi bi-envelope"></i> Sending payment confirmation email...';
        document.body.appendChild(sendingAlert);
        
        // Send payment confirmation email
        try {
            const emailResult = await sendPaymentConfirmationEmail(newPayment, student);
            
            // Remove sending message
            sendingAlert.remove();
            
            if (emailResult.success) {
                alert(`Payment recorded successfully!\n\nReceipt No: ${receiptNumber}\n\nPayment confirmation email sent to: ${student.email}`);
            } else {
                alert(`Payment recorded successfully!\n\nReceipt No: ${receiptNumber}\n\nNote: Email could not be sent. Error: ${emailResult.error}\n\nReceipt is saved in the system.`);
            }
        } catch (error) {
            sendingAlert.remove();
            alert(`Payment recorded successfully!\n\nReceipt No: ${receiptNumber}\n\nNote: Email service error: ${error.message}\n\nReceipt is saved in the system.`);
        }
    });
}

// View receipt
function viewReceipt(paymentId) {
    localStorage.setItem('currentReceipt', paymentId);
    window.open('receipt.html', '_blank');
}

// Delete payment with receipt number confirmation
function deletePayment(id) {
    const payments = getPayments();
    const payment = payments.find(p => p.id === id);
    
    if (!payment) {
        alert('Payment record not found!');
        return;
    }
    
    const students = getStudents();
    const student = students.find(s => s.indexNumber === payment.indexNumber);
    const studentName = student ? student.fullName : 'Unknown Student';
    
    // Create custom confirmation modal
    const modalHtml = `
        <div class="modal fade" id="deletePaymentModal" tabindex="-1" data-bs-backdrop="static">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-danger text-white">
                        <h5 class="modal-title">⚠️ Confirm Payment Deletion</h5>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-warning">
                            <strong>Warning:</strong> This action cannot be undone!
                        </div>
                        <p><strong>Payment record to delete:</strong></p>
                        <div class="card bg-light">
                            <div class="card-body">
                                <p class="mb-1"><strong>Student:</strong> ${studentName}</p>
                                <p class="mb-1"><strong>Index Number:</strong> ${payment.indexNumber}</p>
                                <p class="mb-1"><strong>Receipt Number:</strong> ${payment.receiptNumber}</p>
                                <p class="mb-1"><strong>Amount:</strong> GH₵ ${parseFloat(payment.amount).toFixed(2)}</p>
                                <p class="mb-0"><strong>Date:</strong> ${new Date(payment.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <hr>
                        <p><strong>To confirm deletion, please type the student's index number exactly:</strong></p>
                        <input type="text" class="form-control" id="deletePaymentInput" placeholder="Enter index number to confirm">
                        <div id="deletePaymentError" class="text-danger mt-2" style="display: none;"></div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="cancelPaymentDelete()">Cancel</button>
                        <button type="button" class="btn btn-danger" onclick="confirmPaymentDelete('${id}', '${payment.indexNumber}')">
                            <i class="bi bi-trash"></i> Delete Payment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('deletePaymentModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('deletePaymentModal'));
    modal.show();
    
    // Focus on input
    setTimeout(() => {
        document.getElementById('deletePaymentInput').focus();
    }, 500);
}

// Cancel payment deletion
function cancelPaymentDelete() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('deletePaymentModal'));
    modal.hide();
    setTimeout(() => {
        document.getElementById('deletePaymentModal').remove();
    }, 300);
}

// Confirm payment deletion with index number verification
function confirmPaymentDelete(paymentId, expectedIndex) {
    const enteredIndex = document.getElementById('deletePaymentInput').value.trim();
    const errorDiv = document.getElementById('deletePaymentError');
    
    if (!enteredIndex) {
        errorDiv.textContent = 'Please enter the index number to confirm deletion.';
        errorDiv.style.display = 'block';
        return;
    }
    
    if (enteredIndex !== expectedIndex) {
        errorDiv.textContent = 'Index number does not match. Please enter the exact index number.';
        errorDiv.style.display = 'block';
        document.getElementById('deletePaymentInput').value = '';
        document.getElementById('deletePaymentInput').focus();
        return;
    }
    
    // Index number matches, proceed with deletion
    let payments = getPayments();
    const paymentToDelete = payments.find(p => p.id === paymentId);
    
    if (!paymentToDelete) {
        alert('Error: Payment record not found!');
        cancelPaymentDelete();
        return;
    }
    
    // Perform deletion
    payments = payments.filter(p => p.id !== paymentId);
    savePayments(payments);
    
    // Close modal
    cancelPaymentDelete();
    
    // Reload table
    loadPayments();
    
    // Show success message
    alert(`Payment record "${paymentToDelete.receiptNumber}" has been successfully deleted.`);
}

// Search and filter
document.getElementById('searchPayment')?.addEventListener('input', loadPayments);
document.getElementById('filterYear')?.addEventListener('change', loadPayments);
document.getElementById('filterMethod')?.addEventListener('change', loadPayments);

// Initialize
loadPayments();
