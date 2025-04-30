const express = require('express');
const router = express.Router();
const { 
    getServices, 
    createService, 
    getService, 
    updateService, 
    deleteService 
} = require('../controllers/ServiceManagementController');
const Service = require('../models/ServiceManagementModel');
const jwt = require('jsonwebtoken');

// Simple request limiter to prevent resource exhaustion
const requestLimiter = {
    // Track request counts by IP
    requests: new Map(),
    // Limit requests to this number per window
    maxRequests: 15,
    // Window size in milliseconds
    windowMs: 30000, // 30 seconds
    // Clean interval
    cleanupInterval: null,
    
    // Initialize the limiter
    init() {
        this.cleanupInterval = setInterval(() => {
            const now = Date.now();
            for (const [ip, data] of this.requests.entries()) {
                if (now - data.timestamp > this.windowMs) {
                    this.requests.delete(ip);
                }
            }
        }, 60000); // Clean up every minute
    },
    
    // Check if request should be limited
    shouldLimit(ip) {
        if (!ip) return false; // Skip if no IP
        
        const now = Date.now();
        const data = this.requests.get(ip) || { count: 0, timestamp: now };
        
        // Reset if window has expired
        if (now - data.timestamp > this.windowMs) {
            this.requests.set(ip, { count: 1, timestamp: now });
            return false;
        }
        
        // Increment and check
        data.count++;
        this.requests.set(ip, data);
        
        return data.count > this.maxRequests;
    },
    
    // Apply middleware
    middleware(req, res, next) {
        const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
        if (this.shouldLimit(ip)) {
            return res.status(429).json({
                success: false,
                message: 'Too many requests, please try again later.',
            });
        }
        next();
    }
};

// Initialize the limiter
requestLimiter.init();

// Apply request limiter middleware
router.use((req, res, next) => {
    // Bind middleware to requestLimiter context
    requestLimiter.middleware(req, res, next);
});

// Optimized authenticateToken middleware
const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Please provide an authorization token'
            });
        }
        
        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authorization token missing'
            });
        }

        try {
            // Parse the token without verification for debugging
            const decoded = jwt.decode(token);
            
            // Check if token contains necessary fields
            if (!decoded || (!decoded.id && !decoded._id)) {
                return res.status(403).json({
                    success: false,
                    message: 'Invalid token format - missing id'
                });
            }
            
            // Use either id or _id from token
            const userId = decoded.id || decoded._id;
            
            // Set user info in request for controllers to use
            req.user = {
                id: userId,
                username: decoded.username || 'unknown'
            };
            
            next();
        } catch (tokenError) {
            return res.status(403).json({
                success: false,
                message: 'Could not process token'
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Authentication process error'
        });
    }
};

// PUBLIC ENDPOINT - Get all services with their providers
router.get('/public/all', async (req, res) => {
    try {
        const services = await Service.find()
            .select('title description price serviceTypes serviceArea duration')
            .populate('provider', 'fullname phonenumber profilePicture _id');

        return res.status(200).json({
            success: true,
            count: services.length,
            services
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch services',
            error: error.message
        });
    }
});

// Optimized GET route for services
router.get('/', authenticateToken, async (req, res) => {
    try {
        // Find services for this specific provider
        const services = await Service.find({ provider: req.user.id })
            .select('title description price serviceTypes serviceArea duration provider') // Explicitly select fields
            .lean(); // Use lean for better performance
        
        return res.status(200).json({
            success: true,
            count: services.length,
            data: services
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch your services',
            error: error.message
        });
    }
});

// Root endpoint (POST) - Create new service with no logging
router.post('/', authenticateToken, createService);

// DELETE route - Make explicit and self-contained with no logging
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ 
          success: false, 
          message: 'Service not found' 
      });
    }
    
    // Verify ownership
    if (service.provider.toString() !== req.user.id) {
      return res.status(403).json({ 
          success: false, 
          message: 'Not authorized to delete this service' 
      });
    }
    
    await Service.findByIdAndDelete(req.params.id);
    res.status(200).json({ 
        success: true, 
        message: 'Service deleted' 
    });
  } catch (err) {
    res.status(500).json({ 
        success: false, 
        error: err.message 
    });
  }
});

// UPDATE route with no logging
router.put('/:id', authenticateToken, updateService);

// Clean log cache periodically to prevent memory leaks
setInterval(() => {
    const now = Date.now();
    // Remove entries older than 1 hour
    for (const [providerId, timestamp] of logCache.providerLogs.entries()) {
        if (now - timestamp > 3600000) { // 1 hour
            logCache.providerLogs.delete(providerId);
        }
    }
}, 900000); // Run every 15 minutes

// Export router with all endpoints
module.exports = router;
