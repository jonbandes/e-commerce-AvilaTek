import prisma from '../db.js';
import bcrypt from 'bcrypt';

export const createUser = async (name, email, password) => {
    try {
        console.log('HOlaaaaa');
        console.log(name, email, password);
        // Hasheamos la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertamos el usuario en la base de datos con Prisma
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            },
            select: {
                id: true,
                name: true,
                email: true
            }
        });

        return user;
    } catch (err) {
        console.error("Error creating user:", err);
        throw new Error("Failed to create user");
    }
};

// Buscar usuario por email
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
