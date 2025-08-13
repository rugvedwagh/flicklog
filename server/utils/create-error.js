const createHttpError = (msg, code = 500) => {
    const httpError = new Error(msg);
    httpError.statusCode = code;
    throw httpError;
};

export default createHttpError;