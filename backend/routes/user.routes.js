const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate, requireAdmin } = require('../middleware/auth.middleware');

router.post('/', authenticate, requireAdmin, userController.createUser);
router.get('/', authenticate, requireAdmin, userController.getUsers);
router.put('/:id', authenticate, requireAdmin, userController.updateUser);
router.delete('/:id', authenticate, requireAdmin, userController.deleteUser);

module.exports = router;