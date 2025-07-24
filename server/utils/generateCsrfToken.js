import crypto from 'crypto';

const generateCsrfToken = (size = 32) => {
    return crypto.randomBytes(size).toString('hex');
}

export default generateCsrfToken;