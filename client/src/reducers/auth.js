import { AUTH, LOGOUT, USER_INFO, START_LOADING, END_LOADING } from '../constants/actionTypes';

const authReducer = (state = { authData: null, clientData: null, isLoading: true }, action) => {
    switch (action.type) {
        case AUTH:
            localStorage.setItem('profile', JSON.stringify({ ...action?.payload }));
            return { ...state, authData: action?.payload };
        case LOGOUT:
            localStorage.clear();
            return { ...state, authData: null };
        case USER_INFO:
            return { ...state, clientData: action.payload };
        case START_LOADING:
            return { ...state, isLoading: true }
        case END_LOADING:
            return { ...state, isLoading: false }
        default:
            return state;
    }
};

export default authReducer;