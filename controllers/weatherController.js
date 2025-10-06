const axios = require('axios');
const {openWeatherApiKey} = require('../config/config');

const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

const getWeatherByCity = async (req, res) =>{
    try{
        const { city } = req.params;
        const response = await axios.get(BASE_URL,{
            params: {
                q: city,
                appid: openWeatherApiKey,
                units: 'metric',
                lang: 'es',
            },
        });

        return res.json(response.data);
    } catch(error) {
        console.error('Error al obtener Clima:', error.message);
        return res.status(500).json({message: 'Error al conectar con OpenWeather.'});
    }
};

const getTemperature = async (req, res) => {
    try {
        const {city} = req.params;
        const response = await axios.get(BASE_URL,{
            params:{
                q: city,
                appid: openWeatherApiKey,
                units: 'metric',
            },
        });

        return res.json({
            city: city,
            temperature: response.data.main.temp,
        });
    } catch(err){
        return res.status(500).json({message: 'Error al obtener temperatura.'})
    }
};

const getWeatherDesc = async (req, res) => {
    try{
        const {city} = req.params;
        const response = await axios.get(BASE_URL,{
            params: {
                q: city,
                appid: openWeatherApiKey,
                units: 'metric',
                lang: 'es',
            },
        });

        return res.json({
            city: city,
            description: response.data.weather[0].description,
        });
    }catch(err) {
        return res.status(500).json({message:'No se pudo obtener la descripcion.'})
    }
};

module.exports = {
    getWeatherByCity,
    getTemperature,
    getWeatherDesc,
};