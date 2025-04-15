import {
    USER_INFO,
    ERROR,
    UPDATE_USER,
} from '../../constants/auth.constants';
import {
    START_LOADING,
    END_LOADING
} from '../../constants/loading.constants';
import { fetchUserProfile } from '../../utils/storage';

const initialState = {
    authData: null,
    clientData: null,
    isLoading: null,
    errorMessage: null
}

const userReducer = (state = initialState, action) => {

    switch (action.type) {

        case USER_INFO:
            return {
                ...state,
                clientData: action.payload
            };

        case UPDATE_USER: {
            const updatedAuthData = action.payload;
            const existingProfile = fetchUserProfile();

            const updatedProfile = {
                ...existingProfile,
                ...updatedAuthData,
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

export default userReducer;
