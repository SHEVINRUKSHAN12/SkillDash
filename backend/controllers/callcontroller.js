const Call = require("../models/callmodell");

// Start a call (Initiate the call)
const startCall = async (req, res, next) => {
    const { callerId, receiverId, jobId } = req.body;

    let call;
    try {
        // Create a new call record
        call = new Call({ callerId, receiverId, jobId, callStatus: "in-progress" });
        await call.save();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error starting the call" });
    }

    // Emit real-time call initiation (Socket.io)
    // io.emit('newCall', call); // If Socket.io is set up

    return res.status(200).json({ call });
};

// End a call
const endCall = async (req, res, next) => {
    const { callId } = req.params;

    let call;
    try {
        // Update call status to 'completed' and set end time
        call = await Call.findByIdAndUpdate(callId, { callStatus: "completed", endTime: Date.now() }, { new: true });
        await call.save();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error ending the call" });
    }

    // Emit real-time call end notification (Socket.io)
    // io.emit('callEnded', call); // If Socket.io is set up

    return res.status(200).json({ call });
};

// Get call details by call ID
const getCallDetails = async (req, res, next) => {
    const { callId } = req.params;

    let call;
    try {
        call = await Call.findById(callId).populate("callerId receiverId", "name email"); // Populate user details
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error retrieving call details" });
    }

    return res.status(200).json({ call });
};

exports.startCall = startCall;
exports.endCall = endCall;
exports.getCallDetails = getCallDetails;
