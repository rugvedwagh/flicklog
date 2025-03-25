import { getRefreshTokenApi } from "../api/auth.api";

const getAccessToken = () => {
    try {
        const profile = JSON.parse(localStorage.getItem('profile')) || '';
        return profile?.accessToken || null;
    } catch (error) {
        console.error('Error parsing profile from localStorage:', error);
        return null;
    }
};

const getRefreshToken = async () => {
    try {
        const response = await getRefreshTokenApi();

        if (!response.data?.refreshToken) {
            return null;
        }
        return response.data.refreshToken;
    } catch (error) {
        console.error("Error fetching refresh token:", error);
        return null; 
    }
};


export {
    getAccessToken,
    getRefreshToken
}