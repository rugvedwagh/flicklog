import {
    AUTH,
    LOGOUT,
    ERROR,
    REFRESH_TOKEN
} from '../../constants/auth.constants';
import {
    START_LOADING,
    END_LOADING
} from '../../constants/loading.constants';
import { getProfile } from '../../utils/storage';

const initialState = {
    authData: null,
    accessToken: null,
    clientData: null,
    isLoading: null,
    errorMessage: null
}

const authReducer = (state = initialState, action) => {

    switch (action.type) {

        case AUTH:
            const { refreshToken, accessToken, ...rest } = action?.payload;
            const { password, __v, bookmarks, ...fileredData } = rest.result;
            localStorage.setItem('profile', JSON.stringify({ ...fileredData }));
            return {
                ...state,
                authData: fileredData,
                accessToken: action?.payload?.accessToken
            };

        case REFRESH_TOKEN:
            const updatedProfile = {
                ...getProfile(),
            };
            localStorage.setItem('profile', JSON.stringify(updatedProfile));
            return {
                ...state,
                accessToken: action.payload,
            };

        case LOGOUT:
            localStorage.removeItem('profile');
            localStorage.removeItem('cachedPosts')
            return {
                ...state,
                authData: null,
                clientData: null,
                errorMessage: ''
            };

        case ERROR:
            return {
                ...state,
                errorMessage: action.payload
            };

        case START_LOADING:
            return {
                ...state,
                isLoading: true
            };

        case END_LOADING:
            return {
                ...state,
                isLoading: false
            };

        default:
            return state;
    }
};

export default authReducer;
