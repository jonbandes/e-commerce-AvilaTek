import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { findUserByEmail, createUser } from '../services/authService.js';
import { BadRequestError, InternalServerError, UnauthorizedError } from '../utils/customErros.js';
// /**
//  * Controlador para autenticar a un usuario.
//  * Obtiene el email y la contraseña del cuerpo de la solicitud
//  * y llama al servicio `authService.loginUser` para verificar las credenciales.
//  * Retorna un token JWT y la información básica del usuario con un código de estado 200 (OK).
//  * En caso de error, retorna un mensaje de error con un código de estado 401 (Unauthorized).
//  */

export const login = async (req, res) => {
    try {
        const { email, password } = req.body; // obtenemos tambien la info del body
        console.log({ email, password })
        const result = await loginUser(email, password);
        res.status(200).json(result);
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
};


/**
 * Registra un nuevo usuario en la base de datos.
 * Recibe el nombre, email y contraseña, y llama a la función `createUser`
 * para guardar los datos en la base de datos.
 * Retorna el usuario creado.
 */
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validación básica
        if (!name || !email || !password) {
            throw new BadRequestError("Todos los campos son obligatorios");
        }

        const user = await createUser(name, email, password);
        res.status(201).json({ success: true, data: user });
    } catch (err) {
        console.error("Error en el registro:", err);
        res.status(500).json({ success: false, message: err.message || "Error al registrar el usuario" });
    }
};


/**
 * Autentica a un usuario existente.
 * Busca al usuario por su email, verifica la contraseña con bcrypt
 * y genera un token JWT si las credenciales son válidas.
 * Retorna el token JWT y la información básica del usuario.
 * @param {string} email - El email del usuario.
 * @param {string} password - La contraseña del usuario.
 * @returns {Object} - Un objeto con el token JWT y la información del usuario.
 * @throws {Error} - Si el usuario no existe o la contraseña es incorrecta.
 */
export const loginUser = async (email, password) => {
   
    try {
        
        // Validación básica de entradas
        if (!email || !password) {
            throw new BadRequestError('Email y contraseña son obligatorios');
        }
        console.log('Iniciando login...');
        console.log('ALOOOOOOOOOOOOOOO');
        console.log('Email:', email);
        // Buscar al usuario por email
        console.log('Buscando usuario...');
        const user = await findUserByEmail(email);
        if (!user) {
            throw new UnauthorizedError('Usuario no encontrado');
        }

        // Verificar la contraseña
        console.log('Usuario encontrado:', user);
        console.log('Verificando contraseña...');
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new BadRequestError('Contraseña incorrecta');
        }

        // Generar el token JWT
        console.log('Generando token JWT...');
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });

        console.log('Login exitoso');
        return {
            success: true,
            data: {
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
            },
        };
    } catch (err) {
        console.error('Error en el login:', err);
        throw new Error(err.message || 'Error al iniciar sesión');
    }
};