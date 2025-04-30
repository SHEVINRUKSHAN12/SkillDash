const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = { authMiddleware };

// Import routes
const userRoutes = require('./routes/userroute');
const providerRoutes = require('./routes/sproviderroute');
const jobRoutes = require('./routes/jobroute');
const chatRoutes = require('./routes/chatroute');
const authRoutes = require('./routes/authroute');
const adminRoutes = require('./routes/adminroute');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// MongoDB connection URL
const DB_URL = process.env.DB_URL || "mongodb+srv://admin:p6IQB8v5Nc4tBqm5@cluster0.q9l3s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        // Start the server after a successful connection
        app.listen(5000, () => {
            console.log('Server is running on port 5000');
        });
    })
    .catch(err => console.log('Error connecting to MongoDB: ', err));







    //L68me0ELEtyckdBZ

    //mongodb+srv://admin:L68me0ELEtyckdBZ@cluster0.q9l3s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

    //mongodb+srv://admin: L68me0ELEtyckdBZ@cluster0.dd1dg.mongodb.net/

    //mongodb+srv://admin:L68me0ELEtyckdBZ@cluster0.dd1dg.mongodb.net/