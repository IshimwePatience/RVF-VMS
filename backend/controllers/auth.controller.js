const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User, Stock, PasswordResetRequest } = require('../models');
const { Op } = require('sequelize');
const { otpCache, sessionCache } = require('../utils/cache');
const { sendOTP } = require('../utils/email');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ 
      where: { 
        [Op.or]: [
          { username: username },
          { email: username }
        ]
      },
      include: [{ model: Stock, as: 'Stock' }]
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const sessionId = crypto.randomBytes(32).toString('hex');

    if (user.must_change_password) {
      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const tempToken = crypto.randomBytes(32).toString('hex');
      
      // Cache OTP for 5 minutes
      otpCache.set(tempToken, { otp, user: user.toJSON() }, 300);
      
      // Send OTP via email
      if (user.email) {
        await sendOTP(user.email, otp).catch(console.error);
      } else {
        console.log(`[DEV] User has no email. Generated OTP for ${user.username}: ${otp}`);
      }
      
      return res.json({ requires_otp: true, tempToken, message: 'OTP sent to your email.' });
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        role: user.role,
        stock_id: user.stock_id,
        is_central: user.Stock ? user.Stock.is_central : false,
        sessionId
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Save session
    sessionCache.set(sessionId, user.id);

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        must_change_password: user.must_change_password,
        stock: user.Stock,
        settings: user.settings
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { tempToken, otp } = req.body;
    
    const cachedData = otpCache.get(tempToken);
    
    if (!cachedData) {
      return res.status(400).json({ message: 'OTP expired or invalid session' });
    }

    if (cachedData.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // OTP matched, remove from cache
    otpCache.del(tempToken);

    const user = cachedData.user;
    const sessionId = crypto.randomBytes(32).toString('hex');

    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        role: user.role,
        stock_id: user.stock_id,
        is_central: user.Stock ? user.Stock.is_central : false,
        sessionId
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Save session
    sessionCache.set(sessionId, user.id);

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        must_change_password: user.must_change_password,
        stock: user.Stock,
        settings: user.settings
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const userId = req.user.id;

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(newPassword, salt);

    await User.update(
      { password_hash, must_change_password: false },
      { where: { id: userId } }
    );

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.requestPasswordReset = async (req, res) => {
  try {
    const { username } = req.body;
    
    // Find user by username
    const user = await User.findOne({ where: { username } });
    if (user) {
      // Check if there's already a pending request
      const existingRequest = await PasswordResetRequest.findOne({
        where: { user_id: user.id, status: 'pending' }
      });
      
      if (!existingRequest) {
        await PasswordResetRequest.create({
          user_id: user.id,
          status: 'pending'
        });
      }
    }

    // Always return success so as not to leak user existence
    res.json({ message: 'Your password reset request has been submitted and is pending admin approval.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.settings = { ...user.settings, ...req.body };
    await user.save();

    res.json(user.settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Veterinary Passwordless Auth

const { Veterinary } = require('../models');

exports.vetLogin = async (req, res) => {
  try {
    const { phone_number, name, district } = req.body;
    if (!phone_number) return res.status(400).json({ message: 'Phone number is required' });
    
    // Optional basic validation for rwandan number format (078, 079, 072, 073, 074)
    if (!/^07[23489]\d{7}$/.test(phone_number)) {
      return res.status(400).json({ message: 'Invalid Rwandan phone number. Format should be 078xxxxxxx' });
    }

    let vet = await Veterinary.findOne({ where: { phone_number } });
    
    if (!vet) {
      if (!name || !district) {
        // Not found, and no name/district provided -> tell frontend they need to register
        return res.status(404).json({ message: 'Veterinary not found. Registration required.' });
      }
      
      // Name and district provided -> Create new self-registered vet
      vet = await Veterinary.create({
        phone_number,
        name,
        district,
        is_self_registered: true
      });
    }

    // Vet found or newly created -> issue token directly
    const token = jwt.sign(
      { phone_number: vet.phone_number, name: vet.name, role: 'Veterinary', id: vet.id, stock_id: vet.stock_id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({ token, user: { phone_number: vet.phone_number, name: vet.name, role: 'Veterinary', id: vet.id, stock_id: vet.stock_id } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
