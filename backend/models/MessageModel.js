
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'senderType' // Dynamic ref based on senderType
    },
    senderType: {
        type: String,
        required: true,
        enum: ['Customer', 'ServiceProvider'] // Possible sender types
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'receiverType' // Dynamic ref based on receiverType
    },
    receiverType: {
        type: String,
        required: true,
        enum: ['Customer', 'ServiceProvider'] // Possible receiver types
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service', // Link to the service being discussed (optional but useful)
        required: false // Make it optional if chat isn't always about a service
    },
    content: {
        type: String,
        required: [true, 'Message content cannot be empty'],
        trim: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('Message', MessageSchema);