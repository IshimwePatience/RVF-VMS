const userService = require('../services/user.service');

exports.createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({ message: 'User created successfully', user: { id: user.id, username: user.username, role: user.role } });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Server error' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Server error' });
  }
};