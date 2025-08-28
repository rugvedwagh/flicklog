import {
    AUTH,
    LOGOUT,
    ERROR,
    REFRESH_TOKEN,
    CLEAR_ERROR,
    CLEAR_SUCCESS,
    SUCCESS_MESSAGE
} from '../../constants/auth.constants';
import {
    START_LOADING,
    END_LOADING
} from '../../constants/loading.constants';

const initialState = {
    authData: null,
    accessToken: null,
    clientData: null,
    isLoading: null,
    successMessage: null,
    errorMessage: null
}

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case AUTH: {
            const { accessToken, csrfToken, sessionId, ...otherData } = action.payload;
            return {
                ...state,
                authData: otherData.result,
                accessToken
            };
        }

        case REFRESH_TOKEN:
            return {
                ...state,
                authData: 'proxyAuthData',
                accessToken: action.payload,
            };

        case LOGOUT:
            return {
                ...state,
                authData: null,
                accessToken: null,
                clientData: null,
                errorMessage: ''
            };

        case CLEAR_ERROR:
            return {
                ...state,
                errorMessage: ''
            };

        case ERROR:
            return {
                ...state,
                errorMessage: action.payload
            };

        case SUCCESS_MESSAGE:
            return {
                ...state,
                successMessage: action.payload
            };

        case CLEAR_SUCCESS:
            return {
                ...state,
                successMessage: ''
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
