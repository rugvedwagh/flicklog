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
            console.log(action?.payload)
            const { accessToken, ...filteredData } = action?.payload;
            localStorage.setItem('profile', JSON.stringify( filteredData.result ));
            return {    
                ...state,
                authData: filteredData.result,
                accessToken: accessToken
            };

        case REFRESH_TOKEN:
            return {
                ...state,
                accessToken: action?.payload,
            };

        case LOGOUT:
            localStorage.removeItem('profile');
            localStorage.removeItem('cachedPosts')
            return {
                ...state,
                authData: null,
                accessToken: null,
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
