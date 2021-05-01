const Enlace = require('../models/Enlace'); 
const shortid = require('shortid'); 
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

exports.nuevoEnlace = async (req, res, next) => {

    // Validaciones con Express Validator
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()})
    }

    const { nombreOriginal, nombre } = req.body;
    const enlace = new Enlace();
    enlace.url = shortid.generate();
    enlace.nombre = nombre;
    enlace.nombreOriginal = nombreOriginal;

    if(req.usuario) {
        const { password, descargas } = req.body;

        if(descargas) {
            enlace.descargas = descargas;
        }

        if(password) {
            const salt = await bcrypt.genSalt(10);
            enlace.password = await bcrypt.hash(password, salt);
        }

        enlace.autor = req.usuario.id;

    }

    try {
        await enlace.save();
        res.json({ msg: `${enlace.url}` });
        return next();
    } catch (error) {
        console.error(error);
    }
}

// Obtener el enlace
exports.obtenerEnlace = async (req, res, next) => {
    const { url } = req.params;
    const enlace = await Enlace.findOne({ url });
    
    if (!enlace) {
        res.status(404).json({ msg: 'Ese enlace no existe' });
        return next();
    }

    // Si el archivo existe
    res.json({ archivo: enlace.nombre, password: false });

    next();
}

// Tiene Password?
exports.tienePassword = async (req, res, next) => {
    const { url } = req.params;
    const enlace = await Enlace.findOne({ url });
    
    if (!enlace) {
        res.status(404).json({ msg: 'Ese enlace no existe' });
        return next();
    }

    if (enlace.password) {
        res.json({ 
            hasPassword: true, 
            enlace: enlace.url,
            archivo: enlace.nombre
        });
    }

    next();
}

// Verificar passworf file
exports.verificarPassword = async (req, res, next) => {
    
    const { url } = req.params;
    const { password } = req.body;

    const enlace = await Enlace.findOne({ url });

    if (bcrypt.compareSync(password, enlace.password)) {
        // Permite la descarga
        next();
    } else {
        return res.status(401).json({msg: 'Password incorrecto'});
    }
    
};

// Obtiene un listado de todos los enlaces
exports.allEnlaces = async (req, res) => {
    try {
        const enlaces = await Enlace.find({}).select('url -_id');
        res.json({enlaces});
    } catch (error) {
        console.error(error);
    }
}