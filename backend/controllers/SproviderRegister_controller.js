const mongoose = require('mongoose');
const ServiceProvider = require('../models/SproviderRegister_model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Use a simple hardcoded JWT secret
const JWT_SECRET = 'your-secret-key-here';

const loginServiceProvider = async (req, res) => {
    try {
        console.log('Login attempt received:', { ...req.body, password: '[HIDDEN]' });
        const { gmail, password } = req.body;

        if (!gmail || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }      
        // Find provider by email only
        const provider = await ServiceProvider.findOne({ gmail: gmail.toLowerCase() });

        console.log('Provider found:', provider ? 'Yes' : 'No');

        if (!provider) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Direct password comparison
        const isValidPassword = provider.password === password;
        console.log('Password match:', isValidPassword ? 'Yes' : 'No');
        
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: provider._id },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            provider: {
                id: provider._id,
                fullname: provider.fullname,
                username: provider.username,
                gmail: provider.gmail,
                phonenumber: provider.phonenumber,
                address: provider.address,
                profilePicture: provider.profilePicture
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Login failed'
        });
    }
};

module.exports = {
    loginServiceProvider, // Ensure this is exported
    registerServiceProvider: async (req, res) => {
        // ...existing registration logic...
    }
};
