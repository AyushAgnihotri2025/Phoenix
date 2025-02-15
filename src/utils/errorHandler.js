const errorHandler = (err, req, res, _next) => {
    const statusCode = err.status || 500;

    res.status(statusCode).json({
        success: false,
        errorCode: statusCode,
        message: err.message || 'Something went wrong. Please try again later.',
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    });
};

export default errorHandler;
