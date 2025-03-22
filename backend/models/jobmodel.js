const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const jobSchema = new Schema({
    adTitle: {
        type: String, // Job title (e.g., "Plumber needed")
        required: true,
        maxlength: 100
    },
    serviceType: {
        type: String, // Type of service (e.g., "Plumbing", "Electrical")
        required: true,
    },
    reqDate: {
        type: String, // Requested date for the job
        required: true,
    },
    noOfDays: {
        type: Number, // Number of days estimated for job completion
        required: true,
    },
    area: {
        type: String, // Job location
        required: true,
    },
    adDescription: {
        type: String, // Detailed job description
        required: true,
        maxlength: 500
    },
    contactNumber: {
        type: String, // Contact number
        required: true,
        validate: {
            validator: function (v) {
                return /^\d{10}$/.test(v); // Validates if it's a 10-digit number
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    email: {
        type: String, // Customer email
        required: true,
        maxlength: 100,
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Validates email format
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    date: {
        type: Date, // Job posting date
        default: Date.now
    },
    Name: {
        type: String, // Customer's name
        required: true,
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the customer who posted the job
        required: true
    },
    status: {
        type: String, // Job status (open, assigned, completed)
        enum: ["open", "assigned", "completed"],
        default: "open"
    },
    assignedProviderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the provider assigned to the job
        default: null
    }
});

module.exports = mongoose.model("Job", jobSchema);
