const express = require("express");
const router = express.Router();
const userController = require("../controllers/usercontroller"); // User controller
const authMiddleware = require("../middleware/authMiddleware"); // JWT Middleware

// Get user profile (protected route)
router.get("/profile", authMiddleware, userController.getUserById);

// Update user profile (protected route)
router.put("/profile", authMiddleware, userController.updateUserProfile);

// Delete user profile (protected route)
router.delete("/profile", authMiddleware, userController.deleteUserProfile);

module.exports = router;
