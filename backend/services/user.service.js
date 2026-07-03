const { User, Stock } = require('../models');
const bcrypt = require('bcryptjs');
const { sendOTP } = require('../utils/email');

exports.createUser = async (data) => {
  const existingUser = await User.findOne({ where: { username: data.username } });
  if (existingUser) throw new Error('Username already exists');

  const existingEmail = await User.findOne({ where: { email: data.email } });
  if (existingEmail) throw new Error('Email already exists');

  const generatedPin = Math.floor(100000 + Math.random() * 900000).toString();
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(generatedPin, salt);

  const user = await User.create({
    username: data.username,
    email: data.email,
    password_hash,
    role: data.role,
    stock_id: data.stock_id || null,
    must_change_password: true
  });

  try {
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

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: user.email,
      subject: 'Welcome to RVF VMS - Your Login Credentials',
      html: `<p>Hello ${user.username},</p>
             <p>Your account has been created successfully.</p>
             <p><b>Username:</b> ${user.username}</p>
             <p><b>Temporary PIN:</b> ${generatedPin}</p>
             <p>Please log in using these credentials. You will be asked to set a new PIN.</p>`
    });
  } catch (err) {
    console.error('Failed to send email:', err);
    // Ignore email failure for now so user creation still succeeds
  }

  return user;
};

exports.getUsers = async () => {
  return await User.findAll({
    attributes: { exclude: ['password_hash'] },
    include: [{ model: Stock, as: 'Stock' }]
  });
};