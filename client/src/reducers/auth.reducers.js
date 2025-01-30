import { AUTH, LOGOUT, USER_INFO, ERROR, UPDATE_USER } from '../constants/auth.constants';
import { START_LOADING, END_LOADING } from '../constants/loading.constants';
import { BOOKMARK_POST } from '../constants/post.constants';

const initialState = {
    authData: null,
    clientData: null,
    isLoading: null,
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

        case LOGOUT:
            // Get the current profile from localStorage
            const profile = JSON.parse(localStorage.getItem('profile'));

            if (profile) {
                // Set the access token to null but keep the refreshToken
                profile.token = null; // Remove access token but keep refreshToken
                localStorage.setItem('profile', JSON.stringify(profile)); // Save updated profile back to localStorage
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
