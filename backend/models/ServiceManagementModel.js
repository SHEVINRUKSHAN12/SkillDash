const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceProvider', // Ensure this matches the ServiceProvider model name
        required: [true, 'Please provide the service provider ID']
    },
    title: {
        type: String,
        required: [true, 'Please add a service title'],
        trim: true,
        maxlength: [100, 'Service title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a service description'],
        maxlength: [1000, 'Service description cannot be more than 1000 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price']
    },
    duration: {
        type: String,
        required: [true, 'Please specify the service duration']
    },
    serviceTypes: {
        type: [String],
        required: [true, 'Please select at least one service type']
    },
    serviceArea: {
        type: String,
        required: [true, 'Please specify the service area'],
        maxlength: [100, 'Service area cannot be more than 100 characters']
    },
    location: {
        type: String,
        required: [true, 'Please add a service location']
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Service', ServiceSchema);
