import {
    ERROR,
    USER_INFO,
    UPDATE_USER,
} from '../../constants/auth.constants';
import {
    END_LOADING,
    START_LOADING
} from '../../constants/loading.constants';
import {
    userInfoApi,
    updateUserDetailsApi
} from '../../api/user.api';

const fetchUserData = (id, navigate) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });

        navigate(`/user/i`);
        const { data } = await userInfoApi(id);
        dispatch({ type: USER_INFO, payload: data });
    } catch (error) {
        dispatch({ type: ERROR, payload: error?.response?.data?.message });
        console.error(error);
    } finally {
        dispatch({ type: END_LOADING });
    }
};

const updateUserDetails = (id, updatedData) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });

        const { data } = await updateUserDetailsApi(id, updatedData);
        const { password, __v, bookmarks, ...fileredData } = data;

        dispatch({ type: UPDATE_USER, payload: fileredData });
    } catch (error) {
        dispatch({ type: ERROR, payload: error?.response?.data?.message });
        console.error(error);
    } finally {
        dispatch({ type: END_LOADING });
    }
};

export {
    updateUserDetails,
    fetchUserData,
}