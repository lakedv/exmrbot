const express = require('express');
const authController = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware')

const router = express.Router();

router.post('/login', authController.login);

router.get('/profile', authenticateToken, authController.profile)

module.exports = router;