import { getRefreshTokenApi } from "../api/auth.api";

const getAccessToken = (state) => {
    try {
        return state.authReducer.accessToken || null;
    } catch (error) {
        console.error('Error retrieving access token:', error);
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
        console.error("Error retrieving refresh token:", error);
        return null;
    }
};

export {
    getAccessToken,
    getRefreshToken
}