import { FETCH_ALL, FETCH_POST, LIKE, CREATE, UPDATE, DELETE, FETCH_BY_SEARCH, START_LOADING, END_LOADING, COMMENT } from "../constants/actionTypes";

const postsReducer = (state = {
    isLoading: true,
    posts: []
}, action) => {
    switch (action.type) {

        case UPDATE:
            return {
                ...state,
                posts: state.posts.map((post) => (post._id === action.payload._id ? action.payload : post)),
            };

        case LIKE:
            return {
                ...state,
                posts: state.posts.map((post) => (post._id === action.payload._id ? action.payload : post)),
            };

        case DELETE:
            return {
                ...state,
                posts: state.posts.filter((post) => post._id !== action.payload)
            };

        case CREATE:
            return {
                ...state,
                posts: [...state.posts, action.payload]
            };

        case FETCH_ALL:
            const newPosts = action.payload.data.filter(
                (newPost) => !state.posts.some((post) => post._id === newPost._id)
            );
            return {
                ...state,
                posts: [...state.posts, ...newPosts],
                currentPage: action.payload.currentPage,
                numberOfPages: action.payload.numberOfPages,
            };

        case FETCH_POST:
            return {
                ...state,
                post: action.payload
            };

        case FETCH_BY_SEARCH:
            return {
                ...state,
                posts: action.payload
            };

        case COMMENT:
            return {
                ...state,
                posts: state.posts.map((post) => {
                    if (post._id === action.payload._id) {
                        return action.payload;
                    }
                    return post;
                }),
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

export default postsReducer;
