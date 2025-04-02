const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err); 
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error.";

    const response = { message };

    if (process.env.NODE_ENV !== "production") {
        response.stack = err.stack;
    }

    res.status(statusCode).json(response);
};

export default errorHandler;
