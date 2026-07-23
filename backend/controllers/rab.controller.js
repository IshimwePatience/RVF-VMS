const { RabUser } = require('../models');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { phone_number } = req.body;

    if (!phone_number) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    const user = await RabUser.findOne({ where: { phone_number } });

    if (!user) {
      return res.status(404).json({ message: 'Phone number not found. Please register first.' });
    }

    const token = jwt.sign(
      { id: user.id, phone: user.phone_number, role: 'rab' },
      process.env.JWT_SECRET || 'super-secret-key',
      { expiresIn: '24h' }
    );

    res.json({ token, user: { phone_number: user.phone_number, full_names: user.full_names } });
  } catch (error) {
    console.error('RAB login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.register = async (req, res) => {
  try {
    const { phone_number, full_names } = req.body;

    if (!phone_number || !full_names) {
      return res.status(400).json({ message: 'Phone number and full names are required' });
    }

    let user = await RabUser.findOne({ where: { phone_number } });

    if (user) {
      return res.status(400).json({ message: 'Phone number already registered' });
    }

    user = await RabUser.create({ phone_number, full_names });

    const token = jwt.sign(
      { id: user.id, phone: user.phone_number, role: 'rab' },
      process.env.JWT_SECRET || 'super-secret-key',
      { expiresIn: '24h' }
    );

    res.json({ token, user: { phone_number: user.phone_number, full_names: user.full_names } });
  } catch (error) {
    console.error('RAB register error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
