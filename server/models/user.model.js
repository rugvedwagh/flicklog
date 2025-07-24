import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema({
    csrfToken: String,
    refreshToken: String,
    sessionId: String, // UUID
    userAgent: String,
    createdAt: { type: Date, default: Date.now }
});

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
    ],
    sessions: [SessionSchema]
});

export default mongoose.model("User", userSchema);