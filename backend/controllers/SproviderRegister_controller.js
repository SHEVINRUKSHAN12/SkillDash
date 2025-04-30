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

        // Secure password comparison using bcrypt
        const isValidPassword = await bcrypt.compare(password, provider.password);
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
        try {
            const { fullname, username, gmail, password, phonenumber, address, profilePicture } = req.body;

            // Validate required fields
            if (!fullname || !username || !gmail || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Full name, username, email, and password are required'
                });
            }

            // Check if the email is already registered
            const existingProvider = await ServiceProvider.findOne({ gmail: gmail.toLowerCase() });
            if (existingProvider) {
                return res.status(409).json({
                    success: false,
                    message: 'Email is already registered'
                });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create a new service provider
            const newProvider = new ServiceProvider({
                fullname,
                username,
                gmail: gmail.toLowerCase(),
                password: hashedPassword,
                phonenumber,
                address,
                profilePicture
            });

            // Save to the database
            await newProvider.save();

            res.status(201).json({
                success: true,
                message: 'Service provider registered successfully',
                provider: {
                    id: newProvider._id,
                    fullname: newProvider.fullname,
                    username: newProvider.username,
                    gmail: newProvider.gmail,
                    phonenumber: newProvider.phonenumber,
                    address: newProvider.address,
                    profilePicture: newProvider.profilePicture
                }
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Registration failed'
            });
        }
    }
};
