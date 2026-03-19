// Demo Data Initializer
// This file adds sample data for testing purposes

function initializeDemoData() {
    // Check if data already exists
    const existingStudents = localStorage.getItem('students');
    const existingPayments = localStorage.getItem('payments');
    
    if (existingStudents || existingPayments) {
        console.log('Data already exists. Skipping demo data initialization.');
        return;
    }
    
    // Sample students
    const demoStudents = [
        { id: '1', fullName: 'John Doe', indexNumber: 'ICT/2024/001', level: '100', class: 'A', department: 'ICT', email: 'john@student.edu', phone: '+233 24 123 4567', dateAdded: new Date().toISOString() },
        { id: '2', fullName: 'Jane Smith', indexNumber: 'ICT/2024/002', level: '100', class: 'A', department: 'ICT', email: 'jane@student.edu', phone: '+233 24 234 5678', dateAdded: new Date().toISOString() },
        { id: '3', fullName: 'Mike Johnson', indexNumber: 'ICT/2023/001', level: '200', class: 'B', department: 'ICT', email: 'mike@student.edu', phone: '+233 24 345 6789', dateAdded: new Date().toISOString() },
        { id: '4', fullName: 'Sarah Williams', indexNumber: 'ICT/2023/002', level: '200', class: 'B', department: 'ICT', email: 'sarah@student.edu', phone: '+233 24 456 7890', dateAdded: new Date().toISOString() },
        { id: '5', fullName: 'David Brown', indexNumber: 'ICT/2022/001', level: '300', class: 'C', department: 'ICT', email: 'david@student.edu', phone: '+233 24 567 8901', dateAdded: new Date().toISOString() },
        { id: '6', fullName: 'Emily Davis', indexNumber: 'ICT/2022/002', level: '300', class: 'C', department: 'ICT', email: 'emily@student.edu', phone: '+233 24 678 9012', dateAdded: new Date().toISOString() },
        { id: '7', fullName: 'James Wilson', indexNumber: 'ICT/2021/001', level: '400', class: 'A', department: 'ICT', email: 'james@student.edu', phone: '+233 24 789 0123', dateAdded: new Date().toISOString() },
        { id: '8', fullName: 'Lisa Anderson', indexNumber: 'ICT/2021/002', level: '400', class: 'A', department: 'ICT', email: 'lisa@student.edu', phone: '+233 24 890 1234', dateAdded: new Date().toISOString() }
    ];
    
    // Sample payments
    const demoPayments = [
        { id: '1001', receiptNumber: 'RCP2026001', indexNumber: 'ICT/2024/001', amount: '150', academicYear: '2025/2026', semester: 'Semester 1', paymentMethod: 'Mobile Money', date: new Date('2026-03-15').toISOString() },
        { id: '1002', receiptNumber: 'RCP2026002', indexNumber: 'ICT/2024/002', amount: '150', academicYear: '2025/2026', semester: 'Semester 1', paymentMethod: 'Cash', date: new Date('2026-03-16').toISOString() },
        { id: '1003', receiptNumber: 'RCP2026003', indexNumber: 'ICT/2023/001', amount: '150', academicYear: '2025/2026', semester: 'Semester 1', paymentMethod: 'Bank Transfer', date: new Date('2026-03-17').toISOString() },
        { id: '1004', receiptNumber: 'RCP2026004', indexNumber: 'ICT/2021/001', amount: '150', academicYear: '2025/2026', semester: 'Semester 1', paymentMethod: 'Mobile Money', date: new Date('2026-03-17').toISOString() }
    ];
    
    // Demo classes
    const demoClasses = ['A', 'B', 'C', 'Morning', 'Evening'];
    
    // Save to localStorage
    localStorage.setItem('students', JSON.stringify(demoStudents));
    localStorage.setItem('payments', JSON.stringify(demoPayments));
    localStorage.setItem('classes', JSON.stringify(demoClasses));
    
    console.log('Demo data initialized successfully!');
    console.log(`Added ${demoStudents.length} students, ${demoPayments.length} payments, and ${demoClasses.length} classes`);
}

// Auto-initialize on page load (optional - comment out if not needed)
// initializeDemoData();
