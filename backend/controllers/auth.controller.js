const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User, Stock, PasswordResetRequest, Daro } = require('../models');
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
        district: user.Stock ? user.Stock.district : null,
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
        district: user.Stock ? user.Stock.district : null,
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
    const { name, district } = req.body;
    let { phone_number } = req.body;
    if (!phone_number) return res.status(400).json({ message: 'Phone number is required' });
    
    // Clean phone number (remove spaces)
    phone_number = phone_number.replace(/\s+/g, '').trim();

    // Optional basic validation for rwandan number format (078, 079, 072, 073, 074)
    if (!/^07[23489]\d{7}$/.test(phone_number)) {
      return res.status(400).json({ message: 'Invalid Rwandan phone number. Format should be 078xxxxxxx' });
    }

    let vet = await Veterinary.findOne({ where: { phone_number } });
    
    // If vet exists and they are trying to register (name/district provided), throw error
    if (vet && (name || district)) {
      return res.status(400).json({ message: 'This phone number is already registered. Please login instead.' });
    }

    if (!vet) {
      if (!name || !district) {
        // Not found, and no name/district provided -> tell frontend they need to register
        return res.status(404).json({ message: 'Veterinary not found. Registration required.' });
      }
      
      // Name and district provided -> Create new self-registered vet
      const stock = await Stock.findOne({ where: { district } });
      if (!stock) {
        return res.status(400).json({ message: 'No active stock found for this district. Cannot register.' });
      }

      vet = await Veterinary.create({
        phone_number,
        name,
        district,
        stock_id: stock.id,
        is_self_registered: true
      });
    }

    // Vet found or newly created -> issue token directly
    const token = jwt.sign(
      { phone_number: vet.phone_number, name: vet.name, role: 'Veterinary', id: vet.id, stock_id: vet.stock_id },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { phone_number: vet.phone_number, name: vet.name, role: 'Veterinary', id: vet.id, stock_id: vet.stock_id } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const { LabTechnician } = require('../models');

const validatePassword = (password) => {
  if (password.length < 8) return 'Password must be at least 8 characters long.';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter.';
  if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter.';
  if (!/[0-9]/.test(password)) return 'Password must contain at least one number.';
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)) return 'Password must contain at least one special character.';
  return null;
};

exports.labTechLogin = async (req, res) => {
  try {
    const { name, password } = req.body;
    let { phone_number } = req.body;
    if (!phone_number) return res.status(400).json({ message: 'Phone number is required' });
    if (!password) return res.status(400).json({ message: 'Password is required' });
    
    // Clean phone number (remove spaces)
    phone_number = phone_number.replace(/\s+/g, '').trim();

    // Optional basic validation for rwandan number format (078, 079, 072, 073, 074)
    if (!/^07[23489]\d{7}$/.test(phone_number)) {
      return res.status(400).json({ message: 'Invalid Rwandan phone number. Format should be 078xxxxxxx' });
    }

    let tech = await LabTechnician.findOne({ where: { phone_number } });
    
    if (tech && tech.is_active === false) {
      return res.status(403).json({ message: 'Your account has been deactivated. Please contact support.' });
    }
    
    // If tech exists and they are trying to register (name provided), throw error
    if (tech && name) {
      return res.status(400).json({ message: 'This phone number is already registered. Please login instead.' });
    }

    if (!tech) {
      if (!name) {
        // Not found, and no name provided -> tell frontend they need to register
        return res.status(404).json({ message: 'Lab Technician not found. Registration required.' });
      }
      
      // Name provided -> Create new self-registered tech
      const passwordError = validatePassword(password);
      if (passwordError) {
        return res.status(400).json({ message: passwordError });
      }

      const password_hash = await bcrypt.hash(password, 10);
      tech = await LabTechnician.create({
        phone_number,
        name,
        password_hash,
        must_change_password: false // Self-registered doesn't need to change password
      });
    } else {
      // Tech exists, verify password
      let isMatch = false;
      if (!tech.password_hash) {
        // If they are an existing lab tech from before passwords, their temporary password is '123456'
        isMatch = (password === '123456');
        if (isMatch) {
          tech.must_change_password = true;
          await tech.save();
        }
      } else {
        isMatch = await bcrypt.compare(password, tech.password_hash);
      }

      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid phone number or password' });
      }

      if (tech.must_change_password) {
        return res.json({ 
          requires_password_change: true, 
          userId: tech.id,
          message: 'You must change your temporary password before continuing.' 
        });
      }
    }

    // Tech found or newly created -> issue token directly
    const token = jwt.sign(
      { phone_number: tech.phone_number, name: tech.name, role: 'Lab User', id: tech.id, district: tech.district },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { phone_number: tech.phone_number, name: tech.name, role: 'Lab User', id: tech.id, district: tech.district } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.changeLabTechPassword = async (req, res) => {
  try {
    const { userId, new_password } = req.body;
    if (!userId || !new_password) {
      return res.status(400).json({ message: 'User ID and new password are required' });
    }

    const tech = await LabTechnician.findByPk(userId);
    if (!tech) {
      return res.status(404).json({ message: 'Lab Technician not found' });
    }

    const passwordError = validatePassword(new_password);
    if (passwordError) {
      return res.status(400).json({ message: passwordError });
    }

    const password_hash = await bcrypt.hash(new_password, 10);
    tech.password_hash = password_hash;
    tech.must_change_password = false;
    await tech.save();

    const token = jwt.sign(
      { phone_number: tech.phone_number, name: tech.name, role: 'Lab User', id: tech.id, district: tech.district },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { phone_number: tech.phone_number, name: tech.name, role: 'Lab User', id: tech.id, district: tech.district }, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing lab tech password:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getLabTechs = async (req, res) => {
  try {
    const techs = await LabTechnician.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(techs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createLabTech = async (req, res) => {
  try {
    const { name, phone_number, is_active } = req.body;
    if (!name || !phone_number) {
      return res.status(400).json({ error: 'Name and Phone Number are required.' });
    }

    const cleanPhone = phone_number.replace(/\s+/g, '').trim();

    const existing = await LabTechnician.findOne({ where: { phone_number: cleanPhone } });
    if (existing) {
      return res.status(400).json({ error: 'This phone number is already registered to a Lab Technician.' });
    }

    // Default temporary password
    const password_hash = await bcrypt.hash('123456', 10);

    const tech = await LabTechnician.create({
      name,
      phone_number: cleanPhone,
      password_hash,
      must_change_password: true,
      is_active: is_active !== undefined ? is_active : true
    });

    res.status(201).json(tech);
  } catch (error) {
    console.error('Error creating lab tech:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateLabTech = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone_number, is_active } = req.body;

    const tech = await LabTechnician.findByPk(id);
    if (!tech) return res.status(404).json({ error: 'Lab Technician not found' });

    if (phone_number) {
      const cleanPhone = phone_number.replace(/\s+/g, '').trim();
      if (cleanPhone !== tech.phone_number) {
        const existing = await LabTechnician.findOne({ where: { phone_number: cleanPhone } });
        if (existing) {
          return res.status(400).json({ error: 'This phone number is already registered to another Lab Technician.' });
        }
        tech.phone_number = cleanPhone;
      }
    }

    if (name) tech.name = name;
    if (is_active !== undefined) tech.is_active = is_active;

    await tech.save();
    res.json(tech);
  } catch (error) {
    console.error('Error updating lab tech:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteLabTech = async (req, res) => {
  try {
    const { id } = req.params;
    const tech = await LabTechnician.findByPk(id);
    if (!tech) return res.status(404).json({ error: 'Lab Technician not found' });

    await tech.destroy();
    res.json({ message: 'Lab Technician deleted successfully' });
  } catch (error) {
    console.error('Error deleting lab tech:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// DARO Passwordless Auth
exports.daroLogin = async (req, res) => {
  try {
    let { phone_number } = req.body;
    if (!phone_number) return res.status(400).json({ message: 'Phone number is required' });
    
    phone_number = phone_number.replace(/\s+/g, '').trim();

    if (!/^07[23489]\d{7}$/.test(phone_number)) {
      return res.status(400).json({ message: 'Invalid Rwandan phone number. Format should be 078xxxxxxx' });
    }

    const daro = await Daro.findOne({ where: { phone_number } });
    if (!daro) {
      return res.status(404).json({ message: 'DARO not found. Registration required.' });
    }

    const token = jwt.sign(
      { 
        id: daro.id, 
        role: 'DARO',
        district: daro.district,
        phone_number: daro.phone_number
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      token,
      user: {
        id: daro.id,
        full_names: daro.full_names,
        phone_number: daro.phone_number,
        district: daro.district,
        role: 'DARO'
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.daroRegister = async (req, res) => {
  try {
    let { phone_number, full_names, district } = req.body;
    if (!phone_number || !full_names || !district) {
      return res.status(400).json({ message: 'Phone number, full names, and district are required' });
    }
    
    phone_number = phone_number.replace(/\s+/g, '').trim();

    if (!/^07[23489]\d{7}$/.test(phone_number)) {
      return res.status(400).json({ message: 'Invalid Rwandan phone number. Format should be 078xxxxxxx' });
    }

    let daro = await Daro.findOne({ where: { phone_number } });
    if (daro) {
      return res.status(400).json({ message: 'This phone number is already registered. Please login instead.' });
    }

    daro = await Daro.create({
      phone_number,
      full_names,
      district
    });

    const token = jwt.sign(
      { 
        id: daro.id, 
        role: 'DARO',
        district: daro.district,
        phone_number: daro.phone_number
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      token,
      user: {
        id: daro.id,
        full_names: daro.full_names,
        phone_number: daro.phone_number,
        district: daro.district,
        role: 'DARO'
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
