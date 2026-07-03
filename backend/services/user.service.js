const { User, Stock } = require('../models');
const bcrypt = require('bcryptjs');

exports.createUser = async (data) => {
  const existingUser = await User.findOne({ where: { username: data.username } });
  if (existingUser) throw new Error('Username already exists');

  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(data.password, salt);

  return await User.create({
    username: data.username,
    email: data.email,
    password_hash,
    role: data.role,
    stock_id: data.stock_id,
    must_change_password: true
  });
};

exports.getUsers = async () => {
  return await User.findAll({
    attributes: { exclude: ['password_hash'] },
    include: [{ model: Stock, as: 'Stock' }]
  });
};