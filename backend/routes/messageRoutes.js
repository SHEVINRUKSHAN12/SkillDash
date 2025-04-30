const express = require('express');
const { sendMessage, getConversationMessages, getNotifications, getAllConversations } = require('../controllers/MessageController');
const authenticateToken = require('../middleware/authenticateToken'); // Your auth middleware

console.log('--- Loading messageRoutes.js ---'); // Log file load

const router = express.Router();
console.log('--- Express router created in messageRoutes.js ---');

// Middleware to ensure user is authenticated for all message routes
router.use(authenticateToken); // Pass the middleware function reference, do not invoke it

// Route to send a message - Should handle POST requests to '/api/messages'
console.log('--- Defining POST / route in messageRoutes.js ---');
router.post('/', sendMessage);

// Route to get messages for a conversation - Should handle GET requests to '/api/messages/conversation/:otherUserId'
console.log('--- Defining GET /conversation/:otherUserId route in messageRoutes.js ---');
router.get('/conversation/:otherUserId', getConversationMessages);

// Route to get notifications - Should handle GET requests to '/api/messages/notifications'
console.log('--- Defining GET /notifications route in messageRoutes.js ---');
router.get('/notifications', getNotifications);

// Route to get all conversations for the logged-in user - Should handle GET requests to '/api/messages/conversations'
console.log('--- Defining GET /conversations route in messageRoutes.js ---');
router.get('/conversations', getAllConversations);

console.log('--- Exporting router from messageRoutes.js ---');
module.exports = router;
