import { AUTH, LOGOUT, USER_INFO, ERROR, UPDATE_USER, REFRESH_TOKEN } from '../constants/auth.constants';
import { START_LOADING, END_LOADING } from '../constants/loading.constants';
import { BOOKMARK_POST } from '../constants/post.constants';

const initialState = {
    isLoading: false,
    authData: null,
    clientData: null,
    errorMessage: null
}

const authReducer = (state = initialState, action) => {

    switch (action.type) {

        case AUTH:
            localStorage.setItem('profile', JSON.stringify({ ...action?.payload }));
            return {
                ...state,
                authData: action?.payload
            };

        case REFRESH_TOKEN:
            const updatedProfile = JSON.parse(localStorage.getItem('profile'));
            updatedProfile.token = action.payload; 
            localStorage.setItem('profile', JSON.stringify(updatedProfile));

            return {
                ...state,
                authData: {
                    ...state.authData,
                    token: action.payload
                }
            };

        case LOGOUT:
            const profile = JSON.parse(localStorage.getItem('profile'));

            if (profile) {
                profile.token = null; // Remove access token but keep refreshToken
                localStorage.setItem('profile', JSON.stringify(profile)); 
            }

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
