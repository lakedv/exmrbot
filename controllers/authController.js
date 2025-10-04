const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/config');

exports.login = (req, res) => {
    const {username, password} = req.body;

    if (username === 'admin' && password === 'secret'){
        const token = jwt.sign({user: username}, jwtSecret, {expiresIn: '1h'});
        return res.json({ token })
    }
    return res.status(401).json({message: 'Credenciales invalidas'})
}

exports.profile = (req, res) => {
    res.json({message: `Bienvenido ${req.user.user}`, user: req.user})
}