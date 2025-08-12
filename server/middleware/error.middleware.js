const errorHandler = (error, request, response, next) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";

    const errorResponse = { message };

    if (process.env.NODE_ENV !== "production") {
        errorResponse.stack = error.stack;
    }

    response.status(statusCode).json(errorResponse);
};

export default errorHandler;
