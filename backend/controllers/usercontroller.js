const User = require("../models/usermodel");

// Get user profile by ID
const getUserById = async (req, res, next) => {
    const userId = req.userId; // From JWT token via middleware

    let user;
    try {
        user = await User.findById(userId).select("-password"); // Exclude password from response
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error while fetching user" });
    }

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
};

// Update user profile
const updateUserProfile = async (req, res, next) => {
    const userId = req.userId; // From JWT token via middleware
    const { name, email, contactNumber } = req.body;

    let user;
    try {
        user = await User.findByIdAndUpdate(
            userId,
            { name, email, contactNumber },
            { new: true }
        ).select("-password"); // Exclude password from response
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error updating user profile" });
    }

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
};

// Delete user profile
const deleteUserProfile = async (req, res, next) => {
    const userId = req.userId; // From JWT token via middleware

    let user;
    try {
        user = await User.findByIdAndDelete(userId);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error deleting user profile" });
    }

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User profile deleted successfully" });
};

exports.getUserById = getUserById;
exports.updateUserProfile = updateUserProfile;
exports.deleteUserProfile = deleteUserProfile;
