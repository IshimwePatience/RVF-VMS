const { User, Stock, Request, Transfer, Notification, LabResult } = require('../models');
const bcrypt = require('bcryptjs');
const { sendOTP } = require('../utils/email');

exports.createUser = async (data) => {
  const existingUser = await User.findOne({ where: { username: data.username } });
  if (existingUser) throw new Error('Username already exists');

  const existingEmail = await User.findOne({ where: { email: data.email } });
  if (existingEmail) throw new Error('Email already exists');

  const passwordToUse = data.password || Math.floor(100000 + Math.random() * 900000).toString();
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(passwordToUse, salt);

  const user = await User.create({
    username: data.username,
    full_name: data.full_name || null,
    email: data.email,
    password_hash,
    role: data.role,
    stock_id: data.stock_id || null,
    must_change_password: !data.password, // If password was provided by admin, don't force change
    settings: data.settings || {}
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
              <p><b>Password/PIN:</b> ${passwordToUse}</p>
              <p>Please log in using these credentials. ${!data.password ? 'You will be asked to set a new PIN.' : ''}</p>`
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

exports.updateUser = async (id, data) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error('User not found');

  if (data.username && data.username !== user.username) {
    const existingUsername = await User.findOne({ where: { username: data.username } });
    if (existingUsername) throw new Error('Username already exists');
    user.username = data.username;
  }

  if (data.email && data.email !== user.email) {
    const existingEmail = await User.findOne({ where: { email: data.email } });
    if (existingEmail) throw new Error('Email already exists');
    user.email = data.email;
  }

  if (data.full_name !== undefined) user.full_name = data.full_name || null;
  if (data.role) user.role = data.role;
  if (data.stock_id !== undefined) user.stock_id = data.stock_id || null;
  if (data.settings !== undefined) user.settings = data.settings;
  
  if (data.password) {
    const salt = await bcrypt.genSalt(10);
    user.password_hash = await bcrypt.hash(data.password, salt);
  }

  await user.save();

  return await User.findByPk(id, {
    attributes: { exclude: ['password_hash'] },
    include: [{ model: Stock, as: 'Stock' }]
  });
};

exports.deleteUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error('User not found');
  
  if (user.role === 'Admin') {
    const adminCount = await User.count({ where: { role: 'Admin' } });
    if (adminCount <= 1) {
      throw new Error('Cannot delete the last admin user');
    }
  }

  // Nullify or delete related records to bypass foreign key constraints
  if (Notification) await Notification.destroy({ where: { user_id: id } });
  if (Request) {
    await Request.update({ requested_by: null }, { where: { requested_by: id } });
    await Request.update({ reviewed_by: null }, { where: { reviewed_by: id } });
  }
  if (Transfer) {
    await Transfer.update({ shipped_by: null }, { where: { shipped_by: id } });
    await Transfer.update({ received_by: null }, { where: { received_by: id } });
  }
  if (LabResult) {
    await LabResult.update({ uploaded_by: null }, { where: { uploaded_by: id } });
  }

  await user.destroy();
  return true;
};