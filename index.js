const express = require('express');
const { port } = require('./config/config')
const authRoutes = require('./routes/authRoutes')
const weatherRoutes = require('./routes/weatherRoutes');
const cors = require('cors');


const app = express();

app.use(express.json());
app.use(cors());

app.use('/auth', authRoutes);
app.use('/weather', weatherRoutes)

app.listen(port, () => {
    console.log(`API working on http://localhost:${port}`)
});