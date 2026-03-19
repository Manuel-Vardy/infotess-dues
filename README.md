# School Dues Management System

A digital solution to replace paper-based receipt management for ICT students - Admin Portal.

## Problem Solved
Students often lose or misplace their paper payment receipts over 4 years, causing issues during graduation clearance. This system provides a secure digital alternative with centralized admin management.

## Features

### Admin Portal (Main System)
- Secure admin-only login
- Add and manage students by level (100-400) and class (A, B, C)
- Record payments and generate digital receipts
- Search and filter students by level, class, or name
- View payment history and analytics
- Generate reports
- Export data backups

### Student Management
- Add students with full details
- Organize by Level (100, 200, 300, 400)
- **Dynamically add and manage classes** (not limited to A, B, C)
- Auto-save new classes when adding students
- Search and filter functionality
- Edit and delete student records
- Real-time level counts
- Prevent deletion of classes with assigned students

### Payment Management
- Record payments with automatic receipt generation
- Link payments to student records
- Track payment methods (Mobile Money, Cash, Bank Transfer)
- View payment statistics and trends
- Search payment history

### Key Benefits
- No more lost receipts
- Centralized record keeping
- Instant receipt generation
- **Automatic email notifications** (Brevo API integration)
- **Professional email templates** for welcome & payment confirmation
- Secure database storage
- Easy verification at defense time
- Organized by level and class

## Technology Stack
- HTML5
- CSS3
- Bootstrap 5
- JavaScript (Vanilla)
- LocalStorage for data persistence

## Getting Started

### Option 1: Start Fresh
1. Open `index.html` in your browser
2. Login with admin credentials:
   - Email: YOUR_ADMIN_EMAIL
   - Password: YOUR_ADMIN_PASSWORD
3. Start adding students and recording payments

### Option 2: Use Demo Data (Recommended for Testing)
1. Open `demo.html` in your browser
2. Click "Load Demo Data" to add 8 sample students and 4 payments
3. Go to login and use admin credentials above
4. Explore the system with pre-populated data

## Project Structure
```
├── index.html              # Admin login page
├── admin-dashboard.html    # Main dashboard
├── students.html          # Student management
├── payments.html          # Payment management
├── reports.html           # Reports & analytics
├── settings.html          # System settings
├── receipt.html           # Receipt view/print
├── css/
│   └── style.css          # Custom styles
└── js/
    ├── auth.js            # Authentication
    ├── students.js        # Student management
    ├── payments.js        # Payment functions
    ├── admin.js           # Dashboard functions
    └── reports.js         # Report generation
```

## Usage Guide

### Adding Students
1. Go to Students page
2. Click "Add New Student"
3. Fill in details (name, index, level, class, etc.)
4. Students are automatically grouped by level and class

### Recording Payments
1. Go to Payments page
2. Click "Record Payment"
3. Enter student index number
4. System validates student exists
5. Fill payment details
6. Receipt is automatically generated

### Viewing Reports
1. Go to Reports page
2. Choose report type (Summary, Students, Outstanding)
3. View statistics and analytics

## Future Enhancements
- Backend integration (PHP/Node.js)
- MySQL database
- Email notifications
- SMS alerts
- QR code verification
- Excel export
- Payment reminders
- Multi-admin support


## Email Integration

The system includes automatic email notifications using **Brevo API**:

### Features:
- Welcome emails when students are added
- Payment confirmation emails with receipts
- Professional HTML email templates
- Test email functionality in Settings

### Setup:
1. Update sender email in `js/email-service.js` (must be verified in Brevo)
2. Test email service from Settings page
3. See `EMAIL-SETUP-GUIDE.md` for complete instructions

### Email Templates Include:
- Student information
- Payment receipts
- School branding
- Mobile-responsive design
