import {
    AUTH,
    LOGOUT,
    USER_INFO,
    ERROR,
    UPDATE_USER,
    REFRESH_TOKEN
} from '../../constants/auth.constants';
import {
    START_LOADING,
    END_LOADING
} from '../../constants/loading.constants';
import {
    BOOKMARK_POST
} from '../../constants/post.constants';
import Cookies from 'js-cookie'
import { getProfile } from '../../utils/storage';

const initialState = {
    authData: null,
    clientData: null,
    isLoading: null,
    errorMessage: null
}

const authReducer = (state = initialState, action) => {

    switch (action.type) {

        case AUTH:
            const { refreshToken, accessToken, ...rest } = action?.payload;
            const { password, __v, bookmarks, ...fileredData } = rest.result;

            localStorage.setItem('profile', JSON.stringify({ ...fileredData, accessToken }));
            Cookies.set('refreshToken', refreshToken, { expires: 7 });
            return {
                ...state,
                authData: fileredData
            };

        case REFRESH_TOKEN:
            const updatedProfile = {
                ...getProfile(),
                accessToken: action.payload,
            };
            localStorage.setItem('profile', JSON.stringify(updatedProfile));
            return {
                ...state,
                accessToken: action.payload,
            };

        case LOGOUT:
            localStorage.removeItem('profile');
            localStorage.removeItem('cachedPosts')
            Cookies.remove('refreshToken');
            return {
                ...state,
                authData: null,
                clientData: null
            };

        case USER_INFO:
            return {
                ...state,
                clientData: action.payload
            };

        case BOOKMARK_POST:
            return {
                ...state,
                clientData: {
                    ...state.clientData,
                    bookmarks: action.payload.bookmarks,
                },
            };

        case UPDATE_USER: {
            const updatedAuthData = action.payload;
            const existingProfile = getProfile();
            const updatedProfile = {
                ...existingProfile,
                ...updatedAuthData,
                accessToken: existingProfile.accessToken
            };
            localStorage.setItem("profile", JSON.stringify(updatedProfile));

            return {
                ...state,
                clientData: updatedAuthData,
                errorMessage: ''
            };
        }

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
