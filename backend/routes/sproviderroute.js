const express = require("express");
const router = express.Router();
const providerController = require("../controllers/sprovidercontroller"); 
const authMiddleware = require("../middleware/authMiddleware"); // JWT middleware to protect routes

// Create a new provider profile
router.post("/", authMiddleware, providerController.addProvider);

// Get provider profile by ID
router.get("/:id", authMiddleware, providerController.getProviderById);

// Update provider profile (protected route)
router.put("/:id", authMiddleware, providerController.updateProviderProfile);

// Delete provider profile (protected route)
router.delete("/:id", authMiddleware, providerController.deleteProviderProfile);

module.exports = router;
