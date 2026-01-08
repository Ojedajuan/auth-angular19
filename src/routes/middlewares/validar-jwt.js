const jwt = require('jsonwebtoken');

const validarJWT = (req, res, next) => {
    // Leer el token del header
    const token = req.header('x-token');
    
    console.log('Token recibido:', token); // ← DEBUG

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }

    try {
        const { uid, name } = jwt.verify(token, process.env.JWT_SECRET);
        
        console.log('Token válido - uid:', uid, 'name:', name, 'email:', req.email); // ← DEBUG
        
        req.uid = uid;
        req.name = name;
        req.email = req.email;

        next();

    } catch (error) {
        console.log('Error al verificar token:', error.message); // ← DEBUG
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }
};

module.exports = {
    validarJWT
};