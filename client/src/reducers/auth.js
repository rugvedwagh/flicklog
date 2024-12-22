import { AUTH, LOGOUT, USER_INFO, START_LOADING, END_LOADING, ERROR, BOOKMARK_POST, UPDATE_USER_BOOKMARKS } from '../constants/actionTypes';

const authReducer = (state = { authData: null, clientData: null, isLoading: true, errorMessage: null }, action) => {
    switch (action.type) {
        case AUTH:
            localStorage.setItem('profile', JSON.stringify({ ...action?.payload }));
            return { ...state, authData: action?.payload };
        case LOGOUT:
            localStorage.removeItem('profile');
            return { ...state, authData: null, clientData: null };
        case USER_INFO:
            return { ...state, clientData: action.payload };
        case BOOKMARK_POST:
            return {
                ...state,
                clientData: {
                    ...state.clientData || {}, // Fallback to an empty object if clientData is null/undefined
                    bookmarks: action.payload.bookmarks,
                },
            };
        case UPDATE_USER_BOOKMARKS:
            return {
                ...state,
                clientData: {
                    ...state.clientData,
                    bookmarks: action.payload, // Update bookmarks in Redux store
                },
            };
        case ERROR:
            return { ...state, errorMessage: action.payload };
        case START_LOADING:
            return { ...state, isLoading: true };
        case END_LOADING:
            return { ...state, isLoading: false };
        default:
            return state;
    }
};

export default authReducer;
