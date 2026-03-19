# Quick Start Guide

## 🚀 Getting Started in 3 Steps

### Step 1: Load Demo Data (Optional but Recommended)
1. Open `demo.html` in your browser
2. Click "Load Demo Data"
3. This adds 8 students and 4 payments for testing

### Step 2: Login as Admin
1. Open `index.html`
2. Enter credentials (check your .env file):
   - **Email:** YOUR_ADMIN_EMAIL
   - **Password:** YOUR_ADMIN_PASSWORD
3. Click "Admin Login"

### Step 3: Explore the System
- Dashboard: View statistics and recent payments
- Students: Add/edit/delete students by level and class
- Payments: Record payments and generate receipts
- Reports: View analytics and generate reports
- Settings: Configure system and export data

---

## 📋 Main Features

### Student Management (students.html)
✅ Add students with level (100-400) and **custom classes**
✅ **Create unlimited classes** (not limited to A, B, C)
✅ **Auto-save new classes** when adding students
✅ **Manage classes** via dedicated modal or Settings page
✅ Search and filter by level, class, or name
✅ Edit student information
✅ Delete student records (with class protection)
✅ View student count by level

### Payment Management (payments.html)
✅ Record new payments
✅ Automatic receipt generation
✅ Student validation (must exist in system)
✅ Search payment history
✅ Filter by year or payment method
✅ View payment statistics

### Receipt Generation (receipt.html)
✅ Professional receipt layout
✅ Student and payment details
✅ QR code placeholder for verification
✅ Print functionality
✅ Download option (PDF ready)

### Reports & Analytics (reports.html)
✅ Payment summary reports
✅ Student reports by level
✅ Outstanding payment tracking
✅ Collection rate statistics

---

## 🎯 Common Tasks

### Adding a New Student
1. Go to **Students** page
2. Click **"Add New Student"**
3. Fill in:
   - Full Name
   - Index Number (e.g., ICT/2024/001)
   - Level (100, 200, 300, or 400)
   - **Class (type any name - e.g., A, Morning, Group1)**
   - Department
   - Email
   - Phone
4. Click **"Add Student"**
5. **New classes are automatically saved!**

### Managing Classes
1. Go to **Students** page
2. Click **"Manage Classes"** button
3. **Add new class:** Type name and click Add
4. **Delete class:** Click trash icon (only if no students assigned)
5. Or go to **Settings** page for class management

### Recording a Payment
1. Go to **Payments** page
2. Click **"Record Payment"**
3. Enter student index number (system validates)
4. Enter amount (e.g., 150.00)
5. Select academic year and semester
6. Choose payment method
7. Click **"Record Payment & Generate Receipt"**
8. Receipt is automatically created

### Viewing a Receipt
1. Go to **Payments** page
2. Find the payment record
3. Click the receipt icon (📄)
4. Receipt opens in new window
5. Print or download as needed

### Generating Reports
1. Go to **Reports** page
2. Choose report type:
   - Payment Summary
   - Student Report
   - Outstanding Payments
3. Click **"Generate Report"**

---

## 💾 Data Management

### Exporting Data
1. Go to **Settings** page
2. Click **"Export Data"**
3. Downloads JSON file with all students and payments

### Clearing All Data
1. Go to **Settings** page
2. Click **"Clear All Data"**
3. Confirm twice (cannot be undone!)

### Backup Strategy
- Data is stored in browser's localStorage
- Export data regularly using Settings page
- Keep JSON backups in safe location

---

## 🔐 Security Notes

### Current Implementation
- Simple admin authentication
- Data stored in browser localStorage
- No encryption (demo purposes)

### For Production Use
- Implement proper backend authentication
- Use secure database (MySQL, PostgreSQL)
- Add password hashing (bcrypt)
- Enable HTTPS
- Add role-based access control
- Implement session management
- Add audit logging

---

## 🐛 Troubleshooting

### Can't Login?
- Use exact credentials: YOUR_ADMIN_EMAIL / YOUR_ADMIN_PASSWORD
- Check browser console for errors
- Clear browser cache and try again

### Students Not Showing?
- Check if students were added
- Try clearing filters
- Reload the page

### Payment Recording Fails?
- Ensure student exists in system
- Check index number is correct
- Verify all required fields are filled

### Data Lost After Closing Browser?
- Data is in localStorage (persists)
- Unless you cleared browser data
- Use Export feature to backup

---

## 📱 Browser Compatibility

✅ Chrome (Recommended)
✅ Firefox
✅ Edge
✅ Safari
⚠️ Internet Explorer (Not supported)

---

## 🎨 Customization

### Change School Name
Edit `receipt.html` line with "ICT DEPARTMENT"

### Change Default Payment Amount
Edit `settings.html` default value

### Add More Classes
Edit dropdown options in `students.html` and `payments.html`

### Change Color Scheme
Edit `css/style.css` `:root` variables

---

## 📞 Support

For issues or questions:
1. Check this guide first
2. Review README.md
3. Check browser console for errors
4. Verify all files are present

---

## ✨ Next Steps

1. ✅ Load demo data and explore
2. ✅ Add your own students
3. ✅ Record some payments
4. ✅ Generate receipts
5. ✅ View reports
6. ✅ Export your data
7. 🚀 Plan backend integration for production

---

**Happy Managing! 🎓**
