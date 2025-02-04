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
            console.log(action?.payload)
            const { refreshToken, ...rest } = action?.payload;
            console.log(rest)

            // Store the rest of the user profile (excluding refreshToken) in localStorage
            localStorage.setItem('profile', JSON.stringify(rest));

            // Store refreshToken in HTTP-only cookies
            Cookies.set('refreshToken', refreshToken, { expires: 7 });

            return {
                ...state,
                authData: action?.payload
            };


        case REFRESH_TOKEN:
            return {
                ...state,
                token: action.payload, // Updating the access token
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
