const Chat = require("../models/Chat"); // Chat model

// Send a new message
const sendMessage = async (req, res, next) => {
    const { senderId, receiverId, message, jobId } = req.body;

    let chat;
    try {
        chat = new Chat({ senderId, receiverId, message, jobId });
        await chat.save();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error sending message" });
    }

    // Emit real-time chat message (Socket.io)
    // io.emit('newMessage', chat); // If Socket.io is set up

    return res.status(200).json({ chat });
};

// Get chat history for a specific job
const getChatHistory = async (req, res, next) => {
    const jobId = req.params.jobId;

    let chats;
    try {
        chats = await Chat.find({ jobId }).populate("senderId receiverId", "name email"); // Populate user details
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error retrieving chat history" });
    }

    return res.status(200).json({ chats });
};

exports.sendMessage = sendMessage;
exports.getChatHistory = getChatHistory;
