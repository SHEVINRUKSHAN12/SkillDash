const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const callSchema = new Schema({
    callerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the user who initiated the call
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the user who is receiving the call
        required: true
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job", // Reference to the job related to the call
        required: true
    },
    callStatus: {
        type: String, // Call status (e.g., "in-progress", "completed", "missed")
        enum: ["in-progress", "completed", "missed"],
        required: true,
        default: "in-progress"
    },
    startTime: {
        type: Date,
        default: Date.now // Time when the call started
    },
    endTime: {
        type: Date // Time when the call ended
    }
});

module.exports = mongoose.model("Call", callSchema);
