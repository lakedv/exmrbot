const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        message: 'APIWeather+JWT is OK',
        timestamp: new Date().toISOString()
    });
});

router.get('/health', (req, res) => {
    const memory = process.memoryUsage();
    res.json({
        status: 'Ok',
        uptime: process.uptime(),
        memory: {
            rss: memory.rss,
            heapTotal: memory.heapTotal,
            heapUsed: memory.heapUsed,
            external: memory.external
        },
        timestamp: new Date().toISOString()
    });
});

module.exports = router;