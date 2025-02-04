import { AUTH, LOGOUT, USER_INFO, ERROR, UPDATE_USER, REFRESH_TOKEN } from '../constants/auth.constants';
import { START_LOADING, END_LOADING } from '../constants/loading.constants';
import { BOOKMARK_POST } from '../constants/post.constants';
import Cookies from 'js-cookie'

const initialState = {
    authData: null,
    clientData: null,
    isLoading: null,
    errorMessage: null
}

const authReducer = (state = initialState, action) => {

    switch (action.type) {

        case AUTH:
            const { refreshToken, ...rest } = action?.payload;
            localStorage.setItem('profile', JSON.stringify(rest));

            Cookies.set('refreshToken', refreshToken, { expires: 7 });

            return {
                ...state,
                authData: action?.payload
            };

        case REFRESH_TOKEN:
            const updatedProfile = {
                ...JSON.parse(localStorage.getItem('profile')),
                token: action.payload, 
            };
            localStorage.setItem('profile', JSON.stringify(updatedProfile));

            return {
                ...state,
                token: action.payload,
            };

        case LOGOUT:
            localStorage.removeItem('profile');
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

        case UPDATE_USER:
            const updatedClientData = {
                ...state.clientData,
                ...action.payload
            };

            if (state.authData) {
                const updatedAuthData = {
                    ...state.authData,
                    result: updatedClientData
                };
                localStorage.setItem('profile', JSON.stringify(updatedAuthData));
            }

            return {
                ...state,
                clientData: updatedClientData,
                errorMessage: null
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
