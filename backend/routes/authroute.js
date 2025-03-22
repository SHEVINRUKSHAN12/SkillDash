const express = require("express");
const router = express.Router();
const authController = require("../controllers/authcontroller"); // Auth controller
const authMiddleware = require("../middleware/authMiddleware"); // JWT Middleware

// Register a new user
router.post("/register", authController.registerUser);

// Login a user
router.post("/login", authController.loginUser);

// Get current user (Protected route)
router.get("/current", authMiddleware, authController.getCurrentUser);

module.exports = router;
