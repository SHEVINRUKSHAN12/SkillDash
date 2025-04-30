const Message = require('../models/MessageModel');
const mongoose = require('mongoose'); // Import mongoose if not already

// Send a new message
exports.sendMessage = async (req, res) => {
    console.log('--- sendMessage Controller Reached ---'); // Add log
    const senderId = req.user?.id || 'TEMP_SENDER_ID'; // Use placeholder if req.user is missing
    const senderType = req.user?.type || 'Customer'; // Use placeholder if req.user is missing
    console.log(`Sender Info (Test): ID=${senderId}, Type=${senderType}`); // Log placeholder info

    const { receiverId, receiverType, serviceId, content } = req.body;
    console.log('sendMessage Payload:', req.body); // Log payload

    // Basic validation
    if (!receiverId || !receiverType || !content) {
        return res.status(400).json({ success: false, message: 'Missing required fields: receiverId, receiverType, content.' });
    }
    if (!['Customer', 'ServiceProvider'].includes(receiverType)) {
        return res.status(400).json({ success: false, message: 'Invalid receiverType.' });
    }

    try {
        const newMessage = new Message({
            sender: senderId === 'TEMP_SENDER_ID' ? new mongoose.Types.ObjectId() : senderId, // Use a dummy ID if needed for testing schema validation
            senderType: senderType,
            receiver: receiverId,
            receiverType: receiverType,
            service: serviceId, // Optional service ID
            content: content,
        });

        const savedMessage = await newMessage.save();
        console.log('Message saved:', savedMessage);

        res.status(201).json({ success: true, message: 'Message sent successfully', data: savedMessage });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ success: false, message: 'Failed to send message', error: error.message });
    }
};

// Get messages for a specific conversation (between two users)
exports.getConversationMessages = async (req, res) => {
    console.log('--- getConversationMessages Controller Reached ---'); // Add log
    const userId = req.user?.id || 'TEMP_USER_ID'; // Use placeholder if req.user is missing
    console.log(`User Info (Test): ID=${userId}`); // Log placeholder info

    const otherUserId = req.params.otherUserId; // Get the ID of the other person in the chat
    console.log('getConversationMessages Params:', req.params); // Log params

    if (!otherUserId) {
        return res.status(400).json({ success: false, message: 'Other user ID is required.' });
    }

    try {
        const queryUserId = userId === 'TEMP_USER_ID' ? new mongoose.Types.ObjectId() : userId;

        const messages = await Message.find({
            $or: [
                { sender: queryUserId, receiver: otherUserId },
                { sender: otherUserId, receiver: queryUserId },
            ],
        })
            .sort({ createdAt: 1 });

        console.log(`Found ${messages.length} messages for conversation.`);
        res.status(200).json({ success: true, messages: messages });
    } catch (error) {
        console.error('Error fetching conversation messages:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch messages', error: error.message });
    }
};

// Get recent conversations/notifications (Simplified: gets latest message from each unique sender)
exports.getNotifications = async (req, res) => {
    console.log('--- getNotifications Controller Reached ---'); // Add log
    const userId = req.user?.id || 'TEMP_USER_ID'; // Use placeholder if req.user is missing
    const userType = req.user?.type || 'Customer'; // Use placeholder if req.user is missing
    console.log(`User Info (Test): ID=${userId}, Type=${userType}`); // Log placeholder info

    try {
        const queryUserId = userId === 'TEMP_USER_ID' ? new mongoose.Types.ObjectId() : userId;

        const latestMessages = await Message.aggregate([
            { $match: { receiver: new mongoose.Types.ObjectId(queryUserId), receiverType: userType } }, // Messages received by the current user
            { $sort: { createdAt: -1 } }, // Sort by most recent first
            {
                $group: { // Group by sender to get the latest message from each
                    _id: "$sender", // Group by the sender's ID
                    latestMessage: { $first: "$$ROOT" }, // Get the first document in each group (which is the latest due to sorting)
                },
            },
            { $replaceRoot: { newRoot: "$latestMessage" } }, // Promote the latest message document to the root
            { $sort: { createdAt: -1 } }, // Sort the results again by latest message time
            { $limit: 20 }, // Limit to latest 20 conversations/notifications
            { // Populate sender details (adjust fields as needed)
                $lookup: {
                    from: 'customers', // Assuming 'customers' collection name
                    localField: 'sender',
                    foreignField: '_id',
                    as: 'customerSenderInfo',
                    pipeline: [{ $project: { fullname: 1, _id: 1 } }], // Select only needed fields
                },
            },
            {
                $lookup: {
                    from: 'serviceproviders', // Assuming 'serviceproviders' collection name
                    localField: 'sender',
                    foreignField: '_id',
                    as: 'providerSenderInfo',
                    pipeline: [{ $project: { fullname: 1, _id: 1 } }], // Select only needed fields
                },
            },
            { // Combine sender info based on senderType
                $addFields: {
                    senderInfo: {
                        $cond: {
                            if: { $eq: ["$senderType", "Customer"] },
                            then: { $arrayElemAt: ["$customerSenderInfo", 0] },
                            else: { $arrayElemAt: ["$providerSenderInfo", 0] },
                        },
                    },
                },
            },
            { // Project final shape
                $project: {
                    _id: 1,
                    content: 1,
                    createdAt: 1,
                    isRead: 1,
                    senderType: 1,
                    sender: "$senderInfo", // Use the combined senderInfo
                },
            },
        ]);

        const unreadCount = latestMessages.filter((msg) => !msg.isRead).length;
        console.log(`Found ${latestMessages.length} notifications, ${unreadCount} unread.`);

        res.status(200).json({
            success: true,
            notifications: latestMessages,
            unreadCount: unreadCount,
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch notifications', error: error.message });
    }
};

// Get all unique conversations for the logged-in user
exports.getAllConversations = async (req, res) => {
    console.log('--- getAllConversations Controller Reached ---');
    const userId = req.user?.id;
    const userType = req.user?.type;

    if (!userId || !userType) {
        return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    try {
        const conversations = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { sender: new mongoose.Types.ObjectId(userId) },
                        { receiver: new mongoose.Types.ObjectId(userId) }
                    ]
                }
            },
            {
                $sort: { createdAt: -1 } // Sort messages by most recent first
            },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ["$sender", new mongoose.Types.ObjectId(userId)] },
                            "$receiver",
                            "$sender"
                        ]
                    },
                    latestMessage: { $first: "$$ROOT" }
                }
            },
            {
                $lookup: {
                    from: userType === 'Customer' ? 'serviceproviders' : 'customers',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'participantInfo'
                }
            },
            {
                $project: {
                    _id: 0,
                    participantId: "$_id",
                    participantInfo: { $arrayElemAt: ["$participantInfo", 0] },
                    latestMessage: 1
                }
            }
        ]); // <-- Ensure this closing bracket is present

        res.status(200).json({ success: true, conversations });
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch conversations', error: error.message });
    }
};
