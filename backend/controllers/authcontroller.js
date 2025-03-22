const User = require("../models/usermodel"); // User model
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// User registration
const registerUser = async (req, res, next) => {
    const { name, email, password, role } = req.body;

    let user;
    try {
        // Check if user already exists
        user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create new user
        user = new User({
            name,
            email,
            password,
            role
        });

        // Save user to the database
        await user.save();

        // Return the user data, but don't include the password
        return res.status(201).json({ 
            message: "User registered successfully", 
            user: { name: user.name, email: user.email, role: user.role }
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error during registration" });
    }
};

// User login
const loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    let user;
    try {
        // Find user by email
        user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET, // You should have this in your environment variables
            { expiresIn: "1h" } // Token expiration time
        );

        return res.status(200).json({
            message: "Login successful",
            token
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error during login" });
    }
};

// Get current user (this can be used to verify the logged-in user)
const getCurrentUser = async (req, res, next) => {
    const userId = req.userId; // From JWT token via middleware

    let user;
    try {
        user = await User.findById(userId).select("-password"); // Exclude password
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ user });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }
};

exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.getCurrentUser = getCurrentUser;
