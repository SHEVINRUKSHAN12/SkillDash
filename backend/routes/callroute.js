const express = require("express");
const router = express.Router();
const callController = require("../controllers/callcontroller");
const authMiddleware = require("../middleware/authMiddleware"); // Ensure authentication for routes

// Start a call (initiated by customer or service provider)
router.post("/start", authMiddleware, callController.startCall);

// End a call
router.put("/:callId/end", authMiddleware, callController.endCall);

// Get call details (for a specific call)
router.get("/:callId", authMiddleware, callController.getCallDetails);

module.exports = router;
