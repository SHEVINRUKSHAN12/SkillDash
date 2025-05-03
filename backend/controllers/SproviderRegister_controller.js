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

const registerServiceProvider = async (req, res) => {
    try {
        console.log('Request body at controller:', req.body);
        console.log('File at controller:', req.file);
        
        const { fullname, username, gmail, password, phonenumber, address } = req.body;

        // Validate required fields
        if (!fullname || !username || !gmail || !password || !phonenumber || !address) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Check if user already exists
        const existingProvider = await ServiceProvider.findOne({
            $or: [{ gmail: gmail.toLowerCase() }, { username }]
        });

        if (existingProvider) {
            return res.status(400).json({
                success: false,
                message: 'User with this email or username already exists'
            });
        }

        // Ensure path starts with /uploads for proper URL formation
        let profilePicturePath = '';
        if (req.file) {
            // Make sure the path starts with /uploads
            profilePicturePath = `/uploads/profile-pictures/${req.file.filename}`;
            console.log('Profile picture path for database:', profilePicturePath);
        }

        // Create new provider with file path
        const newServiceProvider = new ServiceProvider({
            fullname,
            username,
            gmail: gmail.toLowerCase(),
            password, // Using direct password for now
            phonenumber,
            address,
            profilePicture: profilePicturePath
        });

        await newServiceProvider.save();

        res.status(201).json({
            success: true,
            message: 'Service provider registered successfully',
            provider: {
                id: newServiceProvider._id,
                fullname: newServiceProvider.fullname,
                username: newServiceProvider.username,
                gmail: newServiceProvider.gmail,
                profilePicture: newServiceProvider.profilePicture
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Registration failed'
        });
    }
};

module.exports = {
    loginServiceProvider,
    registerServiceProvider
};
