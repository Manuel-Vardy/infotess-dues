// Authentication Logic
document.addEventListener('DOMContentLoaded', function() {
    const adminLoginForm = document.getElementById('adminLoginForm');

    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('adminEmail').value;
            const password = document.getElementById('adminPassword').value;
            
            // Simple validation (now moved to .env)
            const DEFAULT_EMAIL = 'YOUR_ADMIN_EMAIL'; 
            const DEFAULT_PASSWORD = 'YOUR_ADMIN_PASSWORD'; 
            
            if (email === DEFAULT_EMAIL && password === DEFAULT_PASSWORD) {
                localStorage.setItem('userType', 'admin');
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('adminEmail', email);
                window.location.href = 'admin-dashboard.html';
            } else {
                alert('Invalid credentials!');
            }
        });
    }
});

// Check authentication
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userType = localStorage.getItem('userType');
    
    if (!isLoggedIn || userType !== 'admin') {
        alert('Access denied! Admin login required.');
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userType');
        localStorage.removeItem('adminEmail');
        window.location.href = 'index.html';
    }
}
