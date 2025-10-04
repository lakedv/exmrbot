const express = require('express');
const router = express.Router();
const authenticateToken  = require('../middleware/authMiddleware');
const { getWeatherByCity, getTemperature, getWeatherDesc } = require('../controllers/weatherController');

router.get('/:city', authenticateToken, getWeatherByCity);
router.get('/temp/:city', authenticateToken, getTemperature);
router.get('/description/:city', authenticateToken, getWeatherDesc);

module.exports = router;