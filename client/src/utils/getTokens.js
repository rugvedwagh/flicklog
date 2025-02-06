import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

const getAccessToken = () => {
    try {
        const profile = JSON.parse(localStorage.getItem('profile')) || '';
        return profile?.token || null;
    } catch (error) {
        console.error('Error parsing profile from localStorage:', error);
        return null;
    }
};

const getRefreshToken = () => {
    try {
        const refreshTokenFromCookies = Cookies.get('refreshToken') || '';
        return refreshTokenFromCookies || null;
    } catch (error) {
        console.log('Error getting refreshToken:', error);
        return null;
    }
}

const isAccessTokenExpired = (accessToken) => {
    let isExpired = true;
    try {
        if (!accessToken) return;

        const decodedToken = jwtDecode(accessToken);
        isExpired = decodedToken.exp * 1000 < Date.now();
        
        return isExpired;
    } catch (error) {
        console.error("Invalid token detected.", error);
        return isExpired;
    }
};

export {
    getAccessToken,
    getRefreshToken,
    isAccessTokenExpired
}