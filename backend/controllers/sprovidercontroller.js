const Provider = require("../models/sprovidermodel"); // Provider model

// Create a new provider profile
const addProvider = async (req, res, next) => {
    const { username, gmail, fullname, password, phonenumber, servicetype, serviceareas } = req.body;

    let provider;
    try {
        provider = new Provider({ username, gmail, fullname, password, phonenumber, servicetype, serviceareas });
        await provider.save();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error saving provider profile" });
    }

    return res.status(201).json({ provider });
};

// Get provider profile by ID
const getProviderById = async (req, res, next) => {
    const id = req.params.id;

    let provider;
    try {
        provider = await Provider.findById(id).select("-password"); // Exclude password from the response
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error retrieving provider profile" });
    }

    if (!provider) {
        return res.status(404).json({ message: "Provider not found" });
    }

    return res.status(200).json({ provider });
};

// Update provider profile
const updateProviderProfile = async (req, res, next) => {
    const id = req.params.id;
    const { username, gmail, fullname, phonenumber, servicetype, serviceareas } = req.body;

    let provider;
    try {
        provider = await Provider.findByIdAndUpdate(id, 
            { username, gmail, fullname, phonenumber, servicetype, serviceareas }, 
            { new: true }).select("-password");
        await provider.save();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error updating provider profile" });
    }

    return res.status(200).json({ provider });
};

// Delete provider profile
const deleteProviderProfile = async (req, res, next) => {
    const id = req.params.id;

    let provider;
    try {
        provider = await Provider.findByIdAndDelete(id);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error deleting provider profile" });
    }

    if (!provider) {
        return res.status(404).json({ message: "Provider not found" });
    }

    return res.status(200).json({ message: "Provider profile deleted successfully" });
};

exports.addProvider = addProvider;
exports.getProviderById = getProviderById;
exports.updateProviderProfile = updateProviderProfile;
exports.deleteProviderProfile = deleteProviderProfile;
