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

module.exports = { sendOTP };
