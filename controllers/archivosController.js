const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');
const Enlace = require('../models/Enlace');

exports.subirArchivo = async (req, res, next) => {

    const configuracionMulter = {
        limits: { fileSize: req.usuario ? 1024 * 1024 * 10 : 1024 * 1024},
        storage: fileStorage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, __dirname + '/../uploads');
            },
            filename: (req, file, cb) => {
                const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
                cb(null, `${shortid.generate()}${extension}`);
            },
            fileFilter: (req, file, cb) => {
                if (file.mimetype === 'application/exe') {
                    // Prohibo la subida de archivos .exe
                    return cb(null, true);
                }
            }
        })
    }
    
    const upload = multer(configuracionMulter).single('archivo');

    upload(req, res, async (error) => {
        if (!error) {
            res.json({ archivo: req.file.filename })
        } else {
            console.error(error);
            res.status(400).json({ error })
            return next();
        }
    });
};

exports.eliminarArchivo = async (req, res) => {
    try {
        fs.unlinkSync(__dirname + `/../uploads/${req.archivo}`);
        console.info('Archivo eliminado');
    } catch (error) {
        console.error(error);
    }
};

exports.descargar = async (req, res, next) => {

    // Obtener el enlace
    const { archivo } = req.params
    const enlace = await Enlace.findOne({ nombre: archivo })

    const archivoDescarga = __dirname + '/../uploads/' + archivo;
    res.download(archivoDescarga);

    // Si las descargas son iguales a 1 debe eliminar el archivo
    const { descargas, nombre } = enlace;

    if(descargas === 1) {

        // Eliminar el archivo
        req.archivo = nombre;

        await Enlace.findOneAndRemove(enlace.id);

        next();
    } else {
        enlace.descargas--;
        await enlace.save();
    }
};