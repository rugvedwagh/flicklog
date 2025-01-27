const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500; // Default to 500 for server errors
    const message = err.message || "Internal server error.";

    // Optional: Add stack trace for non-production environments
    const response = {
        message,
    };

    if (process.env.NODE_ENV !== "production") {
        response.stack = err.stack;
    }

    res.status(statusCode).json(response);
};

export default errorHandler;
