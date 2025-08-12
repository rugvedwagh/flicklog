import { getRefreshTokenApi } from "../api/auth.api";

const getAccessToken = (state) => state.authReducer.accessToken || null;

const getRefreshToken = async () => {
    try {
        const response = await getRefreshTokenApi();

        return response.data?.refreshToken || null;
    } catch {
        return null;
    }
};

export {
    getAccessToken,
    getRefreshToken
}