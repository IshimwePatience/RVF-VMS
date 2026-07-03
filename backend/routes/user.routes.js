const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate, requireAdmin } = require('../middleware/auth.middleware');

router.post('/', authenticate, requireAdmin, userController.createUser);
router.get('/', authenticate, requireAdmin, userController.getUsers);

module.exports = router;