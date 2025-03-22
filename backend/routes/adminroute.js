const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin, getAllAdmins } = require('../controllers/admincontroller');

// Admin registration route
router.post('/register', registerAdmin);

// Admin login route
router.post('/login', loginAdmin);

// Get all admins route (can be restricted for authorized users only)
router.get('/', getAllAdmins);

module.exports = router;
