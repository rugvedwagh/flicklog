import { FETCH_ALL, LIKE, CREATE, UPDATE, DELETE } from "../constants/actionTypes";

export default (posts = [], action) => {
    switch (action.type) {
        case UPDATE:
        case LIKE:
            return posts.map((post) => (post._id === action.payload._id ? action.payload : post)); // Output of an .map is an udpated array of post
        case DELETE:
            return posts.filter((post) => post._id !== action.payload)
        case CREATE:
            return [...posts, action.payload];
        case FETCH_ALL:
            return action.payload;
        default:
            return posts;
    }
};
