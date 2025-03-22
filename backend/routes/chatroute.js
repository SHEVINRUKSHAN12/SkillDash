const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatcontrollerr");
//const authMiddleware = require("../middleware/authMiddleware"); // Ensure authentication for routes

// Send a new message
router.post("/send", authMiddleware, chatController.sendMessage);

// Get chat history for a specific job
router.get("/:jobId", authMiddleware, chatController.getChatHistory);

module.exports = router;
