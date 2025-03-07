import jwt from 'jsonwebtoken';
/**
 * Este middleware se encarga de verificar si un usuario está autenticado mediante un JSON Web Token (JWT). 
 * Si el token es válido, permite continuar con la solicitud; 
 * de lo contrario, retorna un error de acceso no autorizado.
 */

export const authenticateUser = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Acceso no autorizado' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token inválido' });
    }
};