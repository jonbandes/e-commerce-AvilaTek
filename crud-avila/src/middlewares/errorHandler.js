//middlware pra el manejo de errores
export const errorHandler = (err, req, res, next) => {
    console.error(err);
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Error inesperado del servidor';
    
    res.status(statusCode).json({
        success: false,
        message: message,
    });
};
