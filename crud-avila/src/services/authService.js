import prisma from '../db.js';
import bcrypt from 'bcrypt';


/**
 * Funcion para crear un user.
 */
export const createUser = async (name, email, password) => {
    try {
        console.log('HOlaaaaa');
        console.log(name, email, password);

        // Verificar si el usuario ya existe
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new Error("El email ya está registrado");
        }

        // Hashear la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el usuario en la base de datos
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });

        return user;
    } catch (err) {
        console.error("Error creating user:", err);
        throw new Error("Error al crear el Usuario");
    }
};

/**
 * Funcion para buscar un User dado su email.
 */

export const findUserByEmail = async (email) => {
    try {
        return await prisma.user.findUnique({
            where: { email }
        });
    } catch (err) {
        console.error("Error finding user:", err);
        throw new Error("Failed to find user");
    }
};
