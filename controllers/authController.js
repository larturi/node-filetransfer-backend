const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env' });
const { validationResult } = require('express-validator');

exports.autenticarUsuario = async (req, res, next) => {

    // Validaciones con Express Validator
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()})
    }

    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ email });
    
    if(!usuario) {
        res.status(401).json({ msg: 'El usuario no existe' });
        return next();
    }

    if (bcrypt.compareSync(password, usuario.password)) {
        const token = jwt.sign({
            nombre: usuario.nombre,
            id: usuario._id,
            email: usuario.email
        }, process.env.SECRET_JWT, {
            expiresIn: '8h'
        });

        res.json({token});

    } else {
        res.status(401).json({ msg: 'Password incorrecto' });
        return next();
    }

};

exports.usuarioAutenticado = (req, res, next) => {
    res.json({ usuario: req.usuario });
};