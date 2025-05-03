const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const fs = require('fs');

const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
const profilePicsDir = path.join(uploadsDir, 'profile-pictures');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Created uploads directory:', uploadsDir);
}

if (!fs.existsSync(profilePicsDir)) {
    fs.mkdirSync(profilePicsDir, { recursive: true });
    console.log('Created profile pictures directory:', profilePicsDir);
}

// Connect to MongoDB with your Atlas connection
mongoose.connect('mongodb+srv://admin:L68me0ELEtyckdBZ@cluster0.dd1dg.mongodb.net/skilldash')
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// Add this after the mongoose.connect line
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB database:', mongoose.connection.db.databaseName);
  // List all collections to verify ReviewsRating exists
  mongoose.connection.db.listCollections().toArray((err, collections) => {
    if (err) {
      console.error('Error listing collections:', err);
      return;
    }
    console.log('Available collections:', collections.map(c => c.name));
  });
});

// Important: Set up CORS first
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// IMPORTANT: For multer form handling, do NOT use these for multipart forms
// These should be before your routes, but will not process multipart form data
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Add optimized logging middleware - REDUCE frequency of logs
let lastLog = Date.now();
app.use((req, res, next) => {
  // Only log once every 5 seconds for the same route to avoid flooding
  const now = Date.now();
  const routeKey = `${req.method}-${req.url}`;
  
  // Store last log time in app.locals
  app.locals.lastLogs = app.locals.lastLogs || {};
  
  if (!app.locals.lastLogs[routeKey] || now - app.locals.lastLogs[routeKey] > 5000) {
    app.locals.lastLogs[routeKey] = now;
    console.log(`[REQUEST] ${req.method} ${req.url}`);
  }
  
  next();
});

// --- MOUNT MESSAGE ROUTES EARLIER ---
const messageRoutes = require('./routes/messageRoutes');
console.log('--- PRE: Mounting /api/messages (Early) ---');
console.log('Type of messageRoutes:', typeof messageRoutes);
app.use('/api/messages', messageRoutes); // Mount message routes here
console.log('--- POST: Mounting /api/messages (Early) ---');
// --- END MOVE ---

// Import routes
const serviceProviderRoutes = require('./routes/serviceProviderRoutes');
const customerRoutes = require('./routes/Cregister_route');
const jobRoutes = require('./routes/Job_route');
const serviceManagementRoutes = require('./routes/ServiceManagementRoutes');
const reviewsRatingRoutes = require('./routes/reviewsRatingRoutes');

// Log before attaching routes
console.log('Attaching routes to Express app...');

// REGISTER SERVICE MANAGEMENT ROUTES
console.log('Registering /api/services routes including DELETE handlers...');
// Let's log the object to verify it has the needed methods
const availableRoutes = Object.keys(serviceManagementRoutes.stack || {})
  .map(key => serviceManagementRoutes.stack[key]?.route?.path)
  .filter(Boolean);
console.log('Available serviceManagementRoutes paths:', availableRoutes);
app.use('/api/services', serviceManagementRoutes);

console.log('Attaching /api/sprovider routes...');
app.use('/api/sprovider', serviceProviderRoutes);
console.log('Attaching /api/customers routes...');
app.use('/api/customers', customerRoutes);
console.log('Attaching /api/jobs routes...');
app.use('/api/jobs', jobRoutes);
console.log('Attaching /api/reviews routes...');
app.use('/api/reviews', reviewsRatingRoutes);
console.log('Reviews route attached successfully.');

// Global error handler - IMPROVED
app.use((err, req, res, next) => {
  // Generate a unique error ID to trace related logs
  const errorId = Math.random().toString(36).substring(2, 10);
  
  console.error(`[ERROR ${errorId}] ${err.message}`);
  
  // Don't log stack traces in production
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[STACK ${errorId}]`, err.stack);
  }
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Something went wrong on the server',
    errorId // Include error ID in response for easier debugging
  });
});

// Move 404 handler to the end
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Uploads directory: ${uploadsDir}`);
});

module.exports = app;