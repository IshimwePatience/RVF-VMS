const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User, Stock, PasswordResetRequest } = require('../models');
const { otpCache, sessionCache } = require('../utils/cache');
const { sendOTP } = require('../utils/email');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ 
      where: { username },
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
    
    const settings = { ...user.settings, ...req.body.settings };
    await user.update({ settings });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
