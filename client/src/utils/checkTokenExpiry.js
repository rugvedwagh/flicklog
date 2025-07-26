import { jwtDecode } from "jwt-decode";

const isAccessTokenExpired = (token) => {
    if (!token) return true;

    try {
        const decoded = jwtDecode(token);
        return decoded.exp * 1000 < Date.now();
    } catch (error) {
        return true;
    }
};

const isRefreshTokenExpired = (token) => {
    if (!token) return true;

    try {
        const decodedRefreshToken = jwtDecode(token);
        return decodedRefreshToken.exp * 1000 < Date.now();
    } catch (error) {
        return true
    }
}

export { isAccessTokenExpired, isRefreshTokenExpired };
