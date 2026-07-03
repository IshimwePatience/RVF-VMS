const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: process.env.SMTP_SECURE === 'true' || true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendOTP = async (to, otp) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject: 'Your Login OTP - RVF VMS',
    text: `Your One-Time Password (OTP) for login is: ${otp}. It will expire in 5 minutes.`,
    html: `<p>Your One-Time Password (OTP) for login is: <b>${otp}</b>.</p><p>It will expire in 5 minutes.</p>`
  };

  await transporter.sendMail(mailOptions);
};

const sendReportLinkEmail = async (to, token, veterinaryName) => {
  const link = `http://localhost:5173/report-usage/${token}`;
  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject: 'Vaccine Usage Report Form - RVF VMS',
    text: `Hello ${veterinaryName},\n\nYou have recently been issued vaccines. Please fill out the usage report form using the following link:\n${link}\n\nThank you,\nRVF VMS Team`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>Vaccine Usage Report Form</h2>
        <p>Hello <b>${veterinaryName}</b>,</p>
        <p>You have recently been issued vaccines. Please use the link below to fill out your usage report. You can also revisit this link later if you need to update any information.</p>
        <p>
          <a href="${link}" style="display: inline-block; padding: 10px 20px; background-color: #4384F5; color: white; text-decoration: none; border-radius: 5px;">Fill Report Form</a>
        </p>
        <p>Or copy and paste this URL into your browser:</p>
        <p><a href="${link}">${link}</a></p>
        <br/>
        <p>Thank you,<br/>RVF VMS Team</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOTP, sendReportLinkEmail };
