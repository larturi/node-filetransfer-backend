const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env' });

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        try {
            const usuario = jwt.verify(token, process.env.SECRET_JWT);
            req.usuario = usuario;
        } catch (error) {
            res.json({ msg: 'JWT no es valido', error });
        }
    } 

    return next();
}