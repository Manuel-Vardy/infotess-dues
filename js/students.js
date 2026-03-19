// Student Management
checkAuth();

// Get students from localStorage
function getStudents() {
    const students = localStorage.getItem('students');
    return students ? JSON.parse(students) : [];
}

// Get classes from localStorage
function getClasses() {
    const classes = localStorage.getItem('classes');
    return classes ? JSON.parse(classes) : ['A', 'B', 'C']; // Default classes
}

// Save classes to localStorage
function saveClasses(classes) {
    localStorage.setItem('classes', JSON.stringify(classes));
}

// Load classes into dropdowns and datalists
function loadClassOptions() {
    const classes = getClasses();
    
    // Populate add student datalist
    const classList = document.getElementById('classList');
    if (classList) {
        classList.innerHTML = classes.map(c => `<option value="${c}">`).join('');
    }
    
    // Populate edit student datalist
    const editClassList = document.getElementById('editClassList');
    if (editClassList) {
        editClassList.innerHTML = classes.map(c => `<option value="${c}">`).join('');
    }
    
    // Populate filter dropdown
    const filterClass = document.getElementById('filterClass');
    if (filterClass) {
        const currentValue = filterClass.value;
        filterClass.innerHTML = '<option value="">All Classes</option>' + 
            classes.map(c => `<option value="${c}">Class ${c}</option>`).join('');
        filterClass.value = currentValue;
    }
    
    // Populate manage classes modal
    const existingClassesList = document.getElementById('existingClassesList');
    if (existingClassesList) {
        if (classes.length === 0) {
            existingClassesList.innerHTML = '<div class="text-muted text-center p-3">No classes added yet</div>';
        } else {
            existingClassesList.innerHTML = classes.map(c => `
                <div class="list-group-item d-flex justify-content-between align-items-center">
                    <span><strong>Class ${c}</strong></span>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteClass('${c}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            `).join('');
        }
    }
}

// Add new class
function addClass() {
    const input = document.getElementById('newClassName');
    const className = input.value.trim().toUpperCase();
    
    if (!className) {
        alert('Please enter a class name');
        return;
    }
    
    const classes = getClasses();
    
    if (classes.includes(className)) {
        alert('This class already exists!');
        return;
    }
    
    classes.push(className);
    classes.sort(); // Keep alphabetically sorted
    saveClasses(classes);
    
    input.value = '';
    loadClassOptions();
    alert(`Class ${className} added successfully!`);
}

// Delete class with confirmation
function deleteClass(className) {
    const students = getStudents();
    const studentsInClass = students.filter(s => s.class === className);
    
    if (studentsInClass.length > 0) {
        alert(`Cannot delete Class ${className}!\n${studentsInClass.length} student(s) are assigned to this class.\n\nPlease reassign or delete those students first.`);
        return;
    }
    
    // Create custom confirmation modal
    const modalHtml = `
        <div class="modal fade" id="deleteClassModal" tabindex="-1" data-bs-backdrop="static">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-danger text-white">
                        <h5 class="modal-title">⚠️ Confirm Class Deletion</h5>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-warning">
                            <strong>Warning:</strong> This action cannot be undone!
                        </div>
                        <p><strong>Class to delete:</strong> <span class="badge bg-primary fs-6">Class ${className}</span></p>
                        <hr>
                        <p><strong>To confirm deletion, please type the class name exactly:</strong></p>
                        <input type="text" class="form-control" id="deleteClassInput" placeholder="Enter class name to confirm">
                        <div id="deleteClassError" class="text-danger mt-2" style="display: none;"></div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="cancelClassDelete()">Cancel</button>
                        <button type="button" class="btn btn-danger" onclick="confirmClassDelete('${className}')">
                            <i class="bi bi-trash"></i> Delete Class
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('deleteClassModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('deleteClassModal'));
    modal.show();
    
    // Focus on input
    setTimeout(() => {
        document.getElementById('deleteClassInput').focus();
    }, 500);
}

// Cancel class deletion
function cancelClassDelete() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('deleteClassModal'));
    modal.hide();
    setTimeout(() => {
        document.getElementById('deleteClassModal').remove();
    }, 300);
}

// Confirm class deletion with name verification
function confirmClassDelete(expectedClassName) {
    const enteredClassName = document.getElementById('deleteClassInput').value.trim().toUpperCase();
    const errorDiv = document.getElementById('deleteClassError');
    
    if (!enteredClassName) {
        errorDiv.textContent = 'Please enter the class name to confirm deletion.';
        errorDiv.style.display = 'block';
        return;
    }
    
    if (enteredClassName !== expectedClassName) {
        errorDiv.textContent = 'Class name does not match. Please enter the exact class name.';
        errorDiv.style.display = 'block';
        document.getElementById('deleteClassInput').value = '';
        document.getElementById('deleteClassInput').focus();
        return;
    }
    
    // Class name matches, proceed with deletion
    let classes = getClasses();
    classes = classes.filter(c => c !== expectedClassName);
    saveClasses(classes);
    
    // Close modal
    cancelClassDelete();
    
    // Reload class options
    loadClassOptions();
    
    // Show success message
    alert(`Class "${expectedClassName}" has been successfully deleted.`);
}

// Save students to localStorage
function saveStudents(students) {
    localStorage.setItem('students', JSON.stringify(students));
}

// Load students table
function loadStudents() {
    const students = getStudents();
    const tbody = document.getElementById('studentsTable');
    const searchTerm = document.getElementById('searchStudent')?.value.toLowerCase() || '';
    const filterLevel = document.getElementById('filterLevel')?.value || '';
    const filterClass = document.getElementById('filterClass')?.value || '';
    
    // Filter students
    let filteredStudents = students.filter(student => {
        const matchesSearch = student.fullName.toLowerCase().includes(searchTerm) || 
                            student.indexNumber.toLowerCase().includes(searchTerm);
        const matchesLevel = !filterLevel || student.level === filterLevel;
        const matchesClass = !filterClass || student.class === filterClass;
        return matchesSearch && matchesLevel && matchesClass;
    });
    
    tbody.innerHTML = '';
    
    if (filteredStudents.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">No students found</td></tr>';
        return;
    }
    
    filteredStudents.forEach(student => {
        const row = `
            <tr>
                <td><strong>${student.indexNumber}</strong></td>
                <td>${student.fullName}</td>
                <td><span class="badge bg-primary">Level ${student.level}</span></td>
                <td><span class="badge bg-info">Class ${student.class}</span></td>
                <td>${student.department}</td>
                <td>${student.email}</td>
                <td>${student.phone}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="editStudent('${student.id}')">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteStudent('${student.id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
    
    updateLevelCounts();
}

// Update level counts
function updateLevelCounts() {
    const students = getStudents();
    const counts = { '100': 0, '200': 0, '300': 0, '400': 0 };
    
    students.forEach(student => {
        if (counts.hasOwnProperty(student.level)) {
            counts[student.level]++;
        }
    });
    
    document.getElementById('level100Count').textContent = counts['100'];
    document.getElementById('level200Count').textContent = counts['200'];
    document.getElementById('level300Count').textContent = counts['300'];
    document.getElementById('level400Count').textContent = counts['400'];
}

// Add student form
const addStudentForm = document.getElementById('addStudentForm');
if (addStudentForm) {
    addStudentForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const students = getStudents();
        const indexNumber = document.getElementById('indexNumber').value;
        
        // Check if index number already exists
        if (students.some(s => s.indexNumber === indexNumber)) {
            alert('Error: Index number already exists!');
            return;
        }
        
        const newStudent = {
            id: Date.now().toString(),
            fullName: document.getElementById('fullName').value,
            indexNumber: indexNumber,
            level: document.getElementById('level').value,
            class: document.getElementById('class').value.trim().toUpperCase(),
            department: document.getElementById('department').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            dateAdded: new Date().toISOString()
        };
        
        // Add class to classes list if it's new
        const classes = getClasses();
        if (!classes.includes(newStudent.class)) {
            classes.push(newStudent.class);
            classes.sort();
            saveClasses(classes);
            loadClassOptions();
        }
        
        students.push(newStudent);
        saveStudents(students);
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addStudentModal'));
        modal.hide();
        
        // Reset form
        addStudentForm.reset();
        
        // Reload table
        loadStudents();
        
        // Show sending email message
        const sendingAlert = document.createElement('div');
        sendingAlert.className = 'alert alert-info position-fixed top-0 start-50 translate-middle-x mt-3';
        sendingAlert.style.zIndex = '9999';
        sendingAlert.innerHTML = '<i class="bi bi-envelope"></i> Sending welcome email...';
        document.body.appendChild(sendingAlert);
        
        // Send welcome email
        try {
            const emailResult = await sendWelcomeEmail(newStudent);
            
            // Remove sending message
            sendingAlert.remove();
            
            if (emailResult.success) {
                alert(`Student added successfully!\n\nWelcome email sent to: ${newStudent.email}`);
            } else {
                alert(`Student added successfully!\n\nNote: Email could not be sent. Error: ${emailResult.error}\n\nPlease verify the email address and try again from Settings.`);
            }
        } catch (error) {
            sendingAlert.remove();
            alert(`Student added successfully!\n\nNote: Email service error: ${error.message}`);
        }
    });
}

// Edit student
function editStudent(id) {
    const students = getStudents();
    const student = students.find(s => s.id === id);
    
    if (!student) return;
    
    document.getElementById('editStudentId').value = student.id;
    document.getElementById('editFullName').value = student.fullName;
    document.getElementById('editIndexNumber').value = student.indexNumber;
    document.getElementById('editLevel').value = student.level;
    document.getElementById('editClass').value = student.class;
    document.getElementById('editDepartment').value = student.department;
    document.getElementById('editEmail').value = student.email;
    document.getElementById('editPhone').value = student.phone;
    
    const modal = new bootstrap.Modal(document.getElementById('editStudentModal'));
    modal.show();
}

// Edit student form
const editStudentForm = document.getElementById('editStudentForm');
if (editStudentForm) {
    editStudentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const students = getStudents();
        const id = document.getElementById('editStudentId').value;
        const index = students.findIndex(s => s.id === id);
        
        if (index !== -1) {
            const newClass = document.getElementById('editClass').value.trim().toUpperCase();
            
            students[index].fullName = document.getElementById('editFullName').value;
            students[index].level = document.getElementById('editLevel').value;
            students[index].class = newClass;
            students[index].department = document.getElementById('editDepartment').value;
            students[index].email = document.getElementById('editEmail').value;
            students[index].phone = document.getElementById('editPhone').value;
            
            // Add class to classes list if it's new
            const classes = getClasses();
            if (!classes.includes(newClass)) {
                classes.push(newClass);
                classes.sort();
                saveClasses(classes);
                loadClassOptions();
            }
            
            saveStudents(students);
            
            const modal = bootstrap.Modal.getInstance(document.getElementById('editStudentModal'));
            modal.hide();
            
            loadStudents();
            alert('Student updated successfully!');
        }
    });
}

// Delete student with index number confirmation
function deleteStudent(id) {
    const students = getStudents();
    const student = students.find(s => s.id === id);
    
    if (!student) {
        alert('Student not found!');
        return;
    }
    
    // Create custom confirmation modal
    const modalHtml = `
        <div class="modal fade" id="deleteConfirmModal" tabindex="-1" data-bs-backdrop="static">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-danger text-white">
                        <h5 class="modal-title">⚠️ Confirm Student Deletion</h5>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-warning">
                            <strong>Warning:</strong> This action cannot be undone!
                        </div>
                        <p><strong>Student to delete:</strong></p>
                        <div class="card bg-light">
                            <div class="card-body">
                                <p class="mb-1"><strong>Name:</strong> ${student.fullName}</p>
                                <p class="mb-1"><strong>Index Number:</strong> ${student.indexNumber}</p>
                                <p class="mb-1"><strong>Level:</strong> ${student.level}</p>
                                <p class="mb-0"><strong>Class:</strong> ${student.class}</p>
                            </div>
                        </div>
                        <hr>
                        <p><strong>To confirm deletion, please type the student's index number exactly:</strong></p>
                        <input type="text" class="form-control" id="deleteConfirmInput" placeholder="Enter index number to confirm">
                        <div id="deleteError" class="text-danger mt-2" style="display: none;"></div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="cancelDelete()">Cancel</button>
                        <button type="button" class="btn btn-danger" onclick="confirmDelete('${id}', '${student.indexNumber}')">
                            <i class="bi bi-trash"></i> Delete Student
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('deleteConfirmModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
    modal.show();
    
    // Focus on input
    setTimeout(() => {
        document.getElementById('deleteConfirmInput').focus();
    }, 500);
}

// Cancel deletion
function cancelDelete() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('deleteConfirmModal'));
    modal.hide();
    setTimeout(() => {
        document.getElementById('deleteConfirmModal').remove();
    }, 300);
}

// Confirm deletion with index number verification
function confirmDelete(studentId, expectedIndex) {
    const enteredIndex = document.getElementById('deleteConfirmInput').value.trim();
    const errorDiv = document.getElementById('deleteError');
    
    if (!enteredIndex) {
        errorDiv.textContent = 'Please enter the index number to confirm deletion.';
        errorDiv.style.display = 'block';
        return;
    }
    
    if (enteredIndex !== expectedIndex) {
        errorDiv.textContent = 'Index number does not match. Please enter the exact index number.';
        errorDiv.style.display = 'block';
        document.getElementById('deleteConfirmInput').value = '';
        document.getElementById('deleteConfirmInput').focus();
        return;
    }
    
    // Index number matches, proceed with deletion
    let students = getStudents();
    const studentToDelete = students.find(s => s.id === studentId);
    
    if (!studentToDelete) {
        alert('Error: Student not found!');
        cancelDelete();
        return;
    }
    
    // Check if student has payments
    const payments = JSON.parse(localStorage.getItem('payments') || '[]');
    const studentPayments = payments.filter(p => p.indexNumber === studentToDelete.indexNumber);
    
    if (studentPayments.length > 0) {
        errorDiv.innerHTML = `
            <strong>Cannot delete student!</strong><br>
            This student has ${studentPayments.length} payment record(s).<br>
            Delete payment records first or contact system administrator.
        `;
        errorDiv.style.display = 'block';
        return;
    }
    
    // Perform deletion
    students = students.filter(s => s.id !== studentId);
    saveStudents(students);
    
    // Close modal
    cancelDelete();
    
    // Reload table
    loadStudents();
    
    // Show success message
    alert(`Student "${studentToDelete.fullName}" (${studentToDelete.indexNumber}) has been successfully deleted.`);
}

// Search and filter
document.getElementById('searchStudent')?.addEventListener('input', loadStudents);
document.getElementById('filterLevel')?.addEventListener('change', loadStudents);
document.getElementById('filterClass')?.addEventListener('change', loadStudents);

// Handle Enter key in new class input
document.getElementById('newClassName')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        addClass();
    }
});

// Initialize
loadClassOptions();
loadStudents();
