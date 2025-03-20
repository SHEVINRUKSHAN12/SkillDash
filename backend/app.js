const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Middleware to test if the server works
app.use("/", (req, res, next) => {
    res.send("It works");
});

// MongoDB connection URL
const DB_URL = "mongodb+srv://admin:p6IQB8v5Nc4tBqm5@cluster0.q9l3s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
mongoose.connect(DB_URL)
    .then(() => {
        console.log('Connected to MongoDB');
        // Start the server after a successful connection
        app.listen(5000, () => {
            console.log('Server is running on port 5000');
        });
    })
    .catch(err => console.log('Error connecting to MongoDB: ', err));
