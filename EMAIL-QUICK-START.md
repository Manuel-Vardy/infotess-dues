# Email Integration - Quick Start

## 🚀 Get Started in 3 Steps

### Step 1: Update Sender Email (REQUIRED)

1. **Login to Brevo**: https://app.brevo.com
2. **Verify your email**:
   - Go to Settings → Senders & IP
   - Add your email (e.g., admin@yourdomain.com)
   - Verify via confirmation email
3. **Update the code**:
   - Open `js/email-service.js`
   - Line 6: Change `'noreply@infotess.edu'` to your verified email
   - Save the file

### Step 2: Test Email Service

1. Open `settings.html` in browser
2. Scroll to "Email Service Configuration"
3. Enter your email address
4. Click "Send Test Email"
5. Check your inbox (and spam folder)

### Step 3: Start Using

**Add a Student:**
- Go to Students page
- Add new student
- ✅ Welcome email sent automatically!

**Record a Payment:**
- Go to Payments page
- Record payment
- ✅ Receipt email sent automatically!

---

## 📧 What Gets Sent?

### Welcome Email (When Adding Student)
```
To: student@email.com
Subject: Welcome to Infotess - Student Registration Confirmation

✓ Student details
✓ Index number
✓ Level and class
✓ Important instructions
```

### Payment Confirmation (When Recording Payment)
```
To: student@email.com
Subject: Infotess Dues Payment Confirmation - 2025/2026

✓ Official receipt
✓ Receipt number
✓ Amount paid
✓ Payment details
✓ Student information
```

---

## ⚠️ Important Notes

### Sender Email MUST Be Verified
- Use email verified in Brevo dashboard
- Cannot use random email addresses
- Verification is free and takes 2 minutes

### API Key Already Configured
- Your Brevo API key is already in the code
- No need to change it
- Just update sender email

### Email Limits
- Free plan: 300 emails/day
- Enough for most schools
- Upgrade if needed

---

## 🐛 Troubleshooting

### Email Not Sending?
**Most Common Issue**: Sender email not verified
- Solution: Verify email in Brevo dashboard

### Email Goes to Spam?
- Ask students to check spam folder
- Add sender to contacts
- Verify domain (advanced)

### "Sending..." Takes Long?
- Normal: Can take 5-30 seconds
- Don't close browser while sending
- Wait for success message

---

## ✅ Quick Checklist

- [ ] Brevo account created
- [ ] Sender email verified in Brevo
- [ ] Updated sender email in code
- [ ] Tested email service
- [ ] Received test email
- [ ] Ready to use!

---

## 📞 Need Help?

1. Read `EMAIL-SETUP-GUIDE.md` for detailed instructions
2. Check Brevo documentation: https://developers.brevo.com
3. Verify sender email is the #1 solution to most issues

---

**That's it! Email service is ready to use.** 🎉

**Login Credentials: YOUR_ADMIN_EMAIL / YOUR_ADMIN_PASSWORD**
