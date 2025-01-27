import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    id: {
        type: String
    },
    bookmarks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post" 
        }
    ]
});

export default mongoose.model("User", userSchema);