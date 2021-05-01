const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

exports.nuevoUsuario = async (req, res) => {

    // Validaciones con Express Validator
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()})
    }

    // Verificar si ya eciste el usuario
    const { email, password } = req.body;
    let usuario = await Usuario.findOne({email});

    if (usuario) {
        return res.status(400).json({ msg: 'El usuario ya estaba registrado' })
    }

    // Insertar el usuario en BD
    usuario = await new Usuario(req.body);

    // Hashear el password
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password, salt)
    
    try {
        await usuario.save();
        res.json({ msg: 'Usuario creado correctamente' })
    } catch (error) {
        console.error(error);
    }

}