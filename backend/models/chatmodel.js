const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the user sending the message
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the user receiving the message
        required: true
    },
    message: {
        type: String, // The content of the message
        required: true
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job", // Reference to the associated job
        required: true
    },
    dateSent: {
        type: Date,
        default: Date.now // Timestamp for when the message was sent
    }
});

module.exports = mongoose.model("Chat", chatSchema);
