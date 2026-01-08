const {Router} = require('express');
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth.controllers');
const { check } = require('express-validator');
const { validarCampos } = require('./middlewares/validar-campos');
const { validarJWT } = require('./middlewares/validar-jwt');
 

const router = Router();

// POST
router.post('/new', [
   check ('name', 'El nombre es obligatorio').not().isEmpty(),
   check ('email', 'El email es obligatorio').isEmail(),
   check ('password', 'El password debe de ser de 6 caracteres o mas').isLength({ min: 6 }),
   validarCampos
],crearUsuario);

// LOGIN
router.post('/',[
   check ('email', 'El email es obligatorio').isEmail(),
   check ('password', 'El password debe de ser de 6 caracteres o mas').isLength({ min: 6 }),
   validarCampos
] , loginUsuario);
       
// VALIDAR TOKEN
router.get('/renew', validarJWT, revalidarToken);

module.exports = router;