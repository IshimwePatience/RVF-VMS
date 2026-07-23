const { RabUser } = require('../models');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { phone_number, full_names } = req.body;

    if (!phone_number || !full_names) {
      return res.status(400).json({ message: 'Phone number and full names are required' });
    }

    let user = await RabUser.findOne({ where: { phone_number } });

    if (!user) {
      user = await RabUser.create({ phone_number, full_names });
    }

    // Usually we would sign a token here, but DARO auth just checks phone and returns a mock token.
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
