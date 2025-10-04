require('dotenv').config();

module.exports = {
    port: process.env.PORT,
    jwtSecret: process.env.JWT_SECRET,
    openWeatherApiKey: process.env.OPENWEATHER_API_KEY
};