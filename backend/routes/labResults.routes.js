const express = require('express');
const router = express.Router();
const labResultsController = require('../controllers/labResults.controller');
const { authenticate, requireAdmin } = require('../middleware/auth.middleware');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

const optionalAuthenticate = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (token) {
    try {
      req.user = jwt.verify(token, JWT_SECRET);
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  }
  
  if (req.query.vet_phone) {
    return next();
  }
  
  return res.status(401).json({ message: 'Access denied' });
};

router.get('/verify/:id', labResultsController.verifyCertificate);
router.post('/', authenticate, labResultsController.uploadResults);
router.get('/', optionalAuthenticate, labResultsController.getResults);
router.put('/:id', authenticate, requireAdmin, labResultsController.updateResult);
router.delete('/:id', authenticate, requireAdmin, labResultsController.deleteResult);

module.exports = router;
