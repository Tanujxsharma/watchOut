const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // Or use SMTP details from env
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    // Don't throw error to prevent blocking main flow, just log it
  }
};

const templates = {
  welcome: (name) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Welcome to WatchOut!</h2>
      <p>Hi ${name},</p>
      <p>Thank you for registering with the Government Transparency Portal. Your account has been created successfully.</p>
      <p>You can now browse tenders and file complaints.</p>
      <br>
      <p>Best regards,<br>WatchOut Team</p>
    </div>
  `,
  tenderAlert: (tenderTitle, tenderId) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">New Tender Alert</h2>
      <p>A new tender matching your profile has been published:</p>
      <p><strong>${tenderTitle}</strong> (ID: ${tenderId})</p>
      <p>Log in to your dashboard to view details and submit a bid.</p>
      <br>
      <a href="${process.env.FRONTEND_URL}/dashboard" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Tender</a>
    </div>
  `,
  bidStatus: (tenderTitle, status) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Bid Status Update</h2>
      <p>Your bid for <strong>${tenderTitle}</strong> has been updated.</p>
      <p>New Status: <span style="font-weight: bold; color: ${status === 'accepted' ? 'green' : 'red'}">${status.toUpperCase()}</span></p>
      <br>
      <p>Best regards,<br>WatchOut Team</p>
    </div>
  `
};

module.exports = { sendEmail, templates };
