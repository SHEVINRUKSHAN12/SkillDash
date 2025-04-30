const mongoose = require('mongoose');

const serviceProviderSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    gmail: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phonenumber: { type: String, required: true },
    address: { type: String, required: true },
    profilePicture: { type: String, default: '' }
}, {
    timestamps: true
});

const ServiceProvider = mongoose.model('ServiceProvider', serviceProviderSchema);
module.exports = ServiceProvider;
