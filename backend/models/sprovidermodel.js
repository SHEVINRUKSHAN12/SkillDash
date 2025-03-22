const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const providerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        maxlength: 50
    },
    gmail: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Validates email format
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    fullname: {
        type: String,
        required: true,
        maxlength: 100
    },
    password: {
        type: String,
        required: true,
    },
    phonenumber: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^\d{10}$/.test(v); // Validates if it's a 10-digit number
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    servicetype: {
        type: [String], // Array of service types (e.g., ['plumbing', 'electrical'])
        required: true
    },
    serviceareas: {
        type: [String], // Areas the provider covers (e.g., ['city1', 'city2'])
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// Password hashing before saving to the database
providerSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Password validation method
providerSchema.methods.isValidPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("Provider", providerSchema);
