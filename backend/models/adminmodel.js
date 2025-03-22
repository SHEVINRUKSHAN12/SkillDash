const mongoose = require('mongoose');

// Define the admin schema
const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "admin" // Can be extended for other roles if needed
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create the Admin model
const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
