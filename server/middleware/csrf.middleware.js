    import crypto from 'crypto';

    const verifyCsrfToken = (req, res, next) => {

        const csrfCookie = req.cookies['XSRF-TOKEN'];
        const csrfHeader = req.headers['x-xsrf-token'];

        console.log('CSRF Cookie:', csrfCookie);
        console.log('CSRF Header:', csrfHeader);
    
        if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
            const err = new Error('Invalid CSRF token');
            err.statusCode = 403;
            return next(err);
        }

        next();
    };


    const setCsrfToken = (req, res, next) => {
        const existingToken = req.cookies['XSRF-TOKEN'];

        if (!existingToken) {
            const token = crypto.randomBytes(32).toString('hex');
            res.cookie('XSRF-TOKEN', token, {
                httpOnly: false,  // JS can access it
                secure: true,     // Only over HTTPS
                sameSite: 'None',
                path: '/',
                maxAge: 7 * 24 * 60 * 60 * 1000 // optional
            });
        }

        next();
    };

    export { verifyCsrfToken, setCsrfToken };
