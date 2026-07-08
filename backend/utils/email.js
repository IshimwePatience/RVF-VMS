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

const sendVeterinaryPortalLinkEmail = async (to, veterinaryName) => {
  const link = `http://localhost:5173/veterinary-portal/${encodeURIComponent(to)}`;
  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject: 'Welcome to RVF VMS - Your Veterinary Portal',
    text: `Hello ${veterinaryName},\n\nYou have been issued vaccines for the first time. Please access your personal Veterinary Portal using the following link:\n${link}\n\nYou can use this link to report your vaccine usage for all current and future vaccines assigned to you. We recommend saving or bookmarking this link.\n\nThank you,\nRVF VMS Team`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>Welcome to Your Veterinary Portal</h2>
        <p>Hello <b>${veterinaryName}</b>,</p>
        <p>You have been issued vaccines for the first time. Please use the link below to access your personal Veterinary Portal.</p>
        <p>You will use this portal to report your vaccine usage for all current and future vaccines assigned to you. <b>Please save or bookmark this link for future use.</b></p>
        <p>
          <a href="${link}" style="display: inline-block; padding: 10px 20px; background-color: #4384F5; color: white; text-decoration: none; border-radius: 5px;">Access Veterinary Portal</a>
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

const sendMissingShipmentAlert = async (to, endpointName, quantity) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject: 'URGENT: Missing Shipment Alert - RVF VMS',
    text: `URGENT ALERT\n\nThe shipment of ${quantity} doses to ${endpointName} has been reported as MISSING.\nPlease investigate immediately.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; border: 1px solid #f87171; padding: 20px; border-radius: 8px;">
        <h2 style="color: #dc2626;">URGENT: Missing Shipment Alert</h2>
        <p>The shipment of <b>${quantity} doses</b> to <b>${endpointName}</b> has been reported as <b>MISSING</b> by the receiving facility.</p>
        <p>Please investigate this discrepancy immediately via the RVF Vaccine Management System.</p>
        <br/>
        <p>RVF VMS System</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOTP, sendVeterinaryPortalLinkEmail, sendMissingShipmentAlert };
