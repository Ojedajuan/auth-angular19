

const Usuario = require('../models/Usuario'); 
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');


const crearUsuario = async (req, res) => {

    const {name, email, password } = req.body;

    try {
            //veificar si el usuario existe
            let usuario = await Usuario.findOne({email});
            if (usuario) {
                return res.status(400).json({
                    ok: false,
                    message: 'Un usuario ya existe con ese correo'
                });
            }
            //crear usuario con el modelo
            const dbUser = new Usuario(req.body);

            //hash de contraseña
            const salt = bcrypt.genSaltSync();
            dbUser.password = bcrypt.hashSync( password, salt );
            
            //email a minusculas
            dbUser.email = email.toLowerCase();

            //crear usuario en base de datos
            await dbUser.save();

            //generear JWT

            const token = await generarJWT( dbUser.id, dbUser.name );


            //respuesta exitosa
            return res.status(201).json({
                ok: true,
                uid: dbUser.id,
                name: dbUser.name,
                email: dbUser.email,
                message: 'Usuario creado'
                ,token

            });

    
    } 

    catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Por favor hable con el administrador'
        });
    }

          


    console.log(name, email, password);

    return res.json({
        ok: true,
        message: 'Creando un nuevo usuario'
    });
}
const loginUsuario = async (req, res) => {
     const { email, password } = req.body;
     try {
        const dbUser = await Usuario.findOne({ email });
        if (!dbUser) {
            return res.status(400).json({
                ok: false,
                message: 'El correo no existe'
            });
        }
        //confirmar los passwords
        const validPassword = bcrypt.compareSync( password, dbUser.password );
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                message: 'La contraseña no es válida'
            });
        }  
        //generar JWT
        const token = await generarJWT( dbUser.id, dbUser.name );
        //respuesta del servicio
        return res.json({
            ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            token
        });

     } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Por favor hable con el administrador'
        });
    }
}

const revalidarToken = async (req, res) => {
    const { uid, } = req;

    // leer la base de datos
    const dbUser = await Usuario.findById( uid );
    const token = await generarJWT( uid, dbUser.name );

    return res.json({
        ok: true,
        uid,
        name: dbUser.name,
        email: dbUser.email,
        token
 
    });



}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
    
};
