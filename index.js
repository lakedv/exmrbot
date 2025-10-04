const express = require('express');
const { port } = require('./config/config')
const authRoutes = require('./routes/authRoutes')

const app = express();

app.use(express.json());

app.use('/auth', authRoutes);

app.listen(port, () => {
    console.log(`API working on http://localhost:${port}`)
});