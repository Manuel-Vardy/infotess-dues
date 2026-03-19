// Brevo Email Service Integration
const BREVO_API_KEY = CONFIG.BREVO_API_KEY; 
const BREVO_API_URL = CONFIG.BREVO_API_URL;

// Email configuration
const EMAIL_CONFIG = {
    senderEmail: CONFIG.SENDER_EMAIL, 
    senderName: CONFIG.SENDER_NAME,
    schoolName: CONFIG.SCHOOL_NAME,
    schoolAddress: CONFIG.SCHOOL_ADDRESS,
    schoolPhone: CONFIG.SCHOOL_PHONE
};

/**
 * Send welcome email to new student
 */
async function sendWelcomeEmail(studentData) {
    const emailContent = {
        sender: {
            name: EMAIL_CONFIG.senderName,
            email: EMAIL_CONFIG.senderEmail
        },
        to: [
            {
                email: studentData.email,
                name: studentData.fullName
            }
        ],
        subject: `Welcome to ${EMAIL_CONFIG.schoolName} - Student Registration Confirmation`,
        htmlContent: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .info-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #667eea; }
                    .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
                    .label { font-weight: bold; color: #666; }
                    .value { color: #333; }
                    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #ddd; color: #666; font-size: 14px; }
                    .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div style="display: flex; justify-content: center; align-items: center; gap: 20px; margin-bottom: 20px;">
                            <img src="https://i.imgur.com/placeholder-aamusted.png" alt="AAMUSTED Logo" style="height: 35px;">
                            <img src="https://i.imgur.com/placeholder-infotess.png" alt="Infotess Logo" style="height: 35px;">
                        </div>
                        <h1>Welcome to ${EMAIL_CONFIG.schoolName}!</h1>
                        <p>Student Registration Successful</p>
                    </div>
                    <div class="content">
                        <p>Dear <strong>${studentData.fullName}</strong>,</p>
                        
                        <p>Congratulations! You have been successfully registered in our system. Below are your details:</p>
                        
                        <div class="info-box">
                            <h3 style="margin-top: 0; color: #667eea;">Student Information</h3>
                            <div class="info-row">
                                <span class="label">Full Name:</span>
                                <span class="value">${studentData.fullName}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Index Number:</span>
                                <span class="value">${studentData.indexNumber}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Level:</span>
                                <span class="value">Level ${studentData.level}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Class:</span>
                                <span class="value">Class ${studentData.class}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Department:</span>
                                <span class="value">${studentData.department}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Email:</span>
                                <span class="value">${studentData.email}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Phone:</span>
                                <span class="value">${studentData.phone}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Registration Date:</span>
                                <span class="value">${new Date(studentData.dateAdded).toLocaleDateString()}</span>
                            </div>
                        </div>
                        
                        <p><strong>Important Information:</strong></p>
                        <ul>
                            <li>Keep your index number safe - you'll need it for all transactions</li>
                            <li>All payment receipts will be sent to this email address</li>
                            <li>Contact the finance office for any payment-related queries</li>
                        </ul>
                        
                        <p>If you have any questions or notice any incorrect information, please contact the administration office immediately.</p>
                        
                        <div class="footer">
                            <p><strong>${EMAIL_CONFIG.schoolName}</strong></p>
                            <p>${EMAIL_CONFIG.schoolAddress}</p>
                            <p>Phone: ${EMAIL_CONFIG.schoolPhone}</p>
                            <p style="margin-top: 20px; font-size: 12px; color: #999;">
                                This is an automated email. Please do not reply to this message.
                            </p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    return await sendEmail(emailContent);
}

/**
 * Send payment confirmation email with receipt
 */
async function sendPaymentConfirmationEmail(paymentData, studentData) {
    const emailContent = {
        sender: {
            name: EMAIL_CONFIG.senderName,
            email: EMAIL_CONFIG.senderEmail
        },
        to: [
            {
                email: studentData.email,
                name: studentData.fullName
            }
        ],
        subject: `${EMAIL_CONFIG.schoolName} Dues Payment Confirmation - ${paymentData.academicYear}`,
        htmlContent: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .receipt-box { background: white; padding: 25px; margin: 20px 0; border-radius: 8px; border: 2px solid #10b981; }
                    .receipt-header { text-align: center; border-bottom: 2px solid #10b981; padding-bottom: 15px; margin-bottom: 20px; }
                    .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
                    .label { font-weight: bold; color: #666; }
                    .value { color: #333; }
                    .amount-box { background: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; }
                    .amount { font-size: 32px; font-weight: bold; }
                    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #ddd; color: #666; font-size: 14px; }
                    .success-badge { background: #10b981; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; margin: 10px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div style="display: flex; justify-content: center; align-items: center; gap: 20px; margin-bottom: 20px;">
                            <img src="https://i.imgur.com/placeholder-aamusted.png" alt="AAMUSTED Logo" style="height: 35px;">
                            <img src="https://i.imgur.com/placeholder-infotess.png" alt="Infotess Logo" style="height: 35px;">
                        </div>
                        <h1>✓ Payment Received!</h1>
                        <p>${EMAIL_CONFIG.schoolName} Dues Payment Confirmation</p>
                    </div>
                    <div class="content">
                        <p>Dear <strong>${studentData.fullName}</strong>,</p>
                        
                        <p>Your payment has been successfully received and recorded in our system.</p>
                        
                        <div class="receipt-box">
                            <div class="receipt-header">
                                <h2 style="margin: 0; color: #10b981;">OFFICIAL RECEIPT</h2>
                                <p style="margin: 5px 0; color: #666;">Receipt No: <strong>${paymentData.receiptNumber}</strong></p>
                            </div>
                            
                            <div class="info-row">
                                <span class="label">Student Name:</span>
                                <span class="value">${studentData.fullName}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Index Number:</span>
                                <span class="value">${studentData.indexNumber}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Level:</span>
                                <span class="value">Level ${studentData.level}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Class:</span>
                                <span class="value">Class ${studentData.class}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Academic Year:</span>
                                <span class="value">${paymentData.academicYear}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Semester:</span>
                                <span class="value">${paymentData.semester}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Payment Method:</span>
                                <span class="value">${paymentData.paymentMethod}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Payment Date:</span>
                                <span class="value">${new Date(paymentData.date).toLocaleDateString()}</span>
                            </div>
                            
                            <div class="amount-box">
                                <div style="font-size: 14px; margin-bottom: 5px;">Amount Paid</div>
                                <div class="amount">GH₵ ${parseFloat(paymentData.amount).toFixed(2)}</div>
                            </div>
                            
                            <div style="text-align: center; margin-top: 20px;">
                                <span class="success-badge">✓ PAID</span>
                            </div>
                        </div>
                        
                        <p><strong>Important Notes:</strong></p>
                        <ul>
                            <li>Keep this email for your records</li>
                            <li>This receipt is valid for graduation clearance</li>
                            <li>You can access this receipt anytime from the system</li>
                            <li>Receipt Number: <strong>${paymentData.receiptNumber}</strong></li>
                        </ul>
                        
                        <p>Thank you for your prompt payment!</p>
                        
                        <div class="footer">
                            <p><strong>${EMAIL_CONFIG.schoolName} - Finance Office</strong></p>
                            <p>${EMAIL_CONFIG.schoolAddress}</p>
                            <p>Phone: ${EMAIL_CONFIG.schoolPhone}</p>
                            <p style="margin-top: 20px; font-size: 12px; color: #999;">
                                This is an automated email. Please do not reply to this message.<br>
                                For inquiries, contact the finance office directly.
                            </p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    return await sendEmail(emailContent);
}

/**
 * Core function to send email via Brevo API
 */
async function sendEmail(emailData) {
    try {
        const response = await fetch(BREVO_API_URL, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': BREVO_API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify(emailData)
        });

        const result = await response.json();

        if (response.ok) {
            console.log('Email sent successfully:', result);
            return { success: true, messageId: result.messageId };
        } else {
            console.error('Email sending failed:', result);
            return { success: false, error: result.message || 'Failed to send email' };
        }
    } catch (error) {
        console.error('Email service error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Test email configuration
 */
async function testEmailService(testEmail) {
    const testData = {
        sender: {
            name: EMAIL_CONFIG.senderName,
            email: EMAIL_CONFIG.senderEmail
        },
        to: [
            {
                email: testEmail,
                name: 'Test User'
            }
        ],
        subject: 'Test Email - Infotess Dues System',
        htmlContent: `
            <h2>Email Service Test</h2>
            <p>This is a test email from the Infotess School Dues Management System.</p>
            <p>If you received this, the email service is working correctly!</p>
            <p><strong>Configuration:</strong></p>
            <ul>
                <li>Sender: ${EMAIL_CONFIG.senderName}</li>
                <li>School: ${EMAIL_CONFIG.schoolName}</li>
            </ul>
        `
    };

    return await sendEmail(testData);
}
