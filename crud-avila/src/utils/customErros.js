class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

export class NotFoundError extends CustomError {
    constructor(message = 'Recurso no encontrado') {
        super(message, 404);
    }
}

export class BadRequestError extends CustomError {
    constructor(message = 'Solicitud incorrecta') {
        super(message, 400);
    }
}

export class UnauthorizedError extends CustomError {
    constructor(message = 'Acceso no autorizado') {
        super(message, 401);
    }
}

export class InternalServerError extends CustomError {
    constructor(message = "Error interno del servidor") {
        super(message, 500);
    }
}