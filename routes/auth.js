const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { check } = require('express-validator');
const auth = require('../middleware/auth');

router.post('/',
    [
        check('email', 'Agregar un email valido').isEmail(),
        check('password', 'EL password debe ser de al menos 6 caracteres').isLength({min: 6}),
    ],
    authController.autenticarUsuario
);

router.get('/', 
    auth,
    authController.usuarioAutenticado
);

module.exports = router;