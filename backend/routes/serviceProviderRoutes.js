const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { 
    registerServiceProvider, 
    loginServiceProvider, 
    updateProfile, 
    deleteProfile 
} = require('../controllers/SproviderRegister_controller');
const ServiceProvider = require('../models/SproviderRegister_model');
const Service = require('../models/ServiceManagementModel');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '..', 'uploads', 'profile-pictures');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('Created upload directory:', uploadDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExt = path.extname(file.originalname);
        cb(null, 'profile-' + uniqueSuffix + fileExt);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB max size
});

// Debug middleware
router.use((req, res, next) => {
    console.log('Service Provider Route Hit:', {
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.originalUrl,
        contentType: req.headers['content-type']
    });
    next();
});

// Add OPTIONS handling for pre-flight requests
router.options('/register', (req, res) => {
    res.sendStatus(200);
});

// Wrap route handlers with try-catch
router.post('/register', function(req, res, next) {
    // Log the incoming request before multer processes it
    console.log('Pre-multer request body:', req.body);
    console.log('Content-Type:', req.headers['content-type']);
    
    upload.single('profilePicture')(req, res, function(err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading
            console.error('Multer error:', err);
            return res.status(400).json({
                success: false,
                message: `File upload error: ${err.message}`
            });
        } else if (err) {
            // An unknown error occurred when uploading
            console.error('Unknown upload error:', err);
            return res.status(500).json({
                success: false,
                message: `Unknown upload error: ${err.message}`
            });
        }
        
        // No error, proceed with registration
        console.log('Post-multer request body:', req.body);
        console.log('Received file:', req.file);
        
        // Call the registration controller
        registerServiceProvider(req, res).catch(error => {
            console.error('Registration controller error:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Server error during registration'
            });
        });
    });
});

// Simplified login route with direct error handling
router.post('/login', (req, res) => {
    loginServiceProvider(req, res).catch(error => {
        console.error('Login route error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login',
            error: error.message
        });
    });
});

// Update profile with file upload capability
router.put('/profile/:id', function(req, res, next) {
    console.log('Profile update request received');
    console.log('Request content type:', req.headers['content-type']);
    console.log('Request params:', req.params);
    
    // Use a separate instance of multer with more debug logging
    const profileUpload = multer({
        storage: storage,
        limits: { fileSize: 5 * 1024 * 1024 }
    }).single('profilePicture');
    
    profileUpload(req, res, function(err) {
        if (err instanceof multer.MulterError) {
            console.error('Multer error during profile update:', err);
            return res.status(400).json({
                success: false,
                message: `File upload error: ${err.message}`
            });
        } else if (err) {
            console.error('Unknown upload error during profile update:', err);
            return res.status(500).json({
                success: false,
                message: `Unknown upload error: ${err.message}`
            });
        }
        
        // Log the raw request body for debugging
        console.log('Raw req.body after multer processing:', req.body);
        console.log('Raw req.file after multer processing:', req.file);
        
        // Call the update profile controller with proper error handling
        updateProfile(req, res).catch(error => {
            console.error('Profile update controller error:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Server error during profile update'
            });
        });
    });
});

router.delete('/profile/:id', async (req, res, next) => {
    try {
        await deleteProfile(req, res);
    } catch (error) {
        next(error);
    }
});

// Route to get all service providers WITH their services (Fallback Logic)
router.get('/all', async (req, res) => {
    console.log('[DEBUG /api/sprovider/all] Fallback route handler START');
    try {
        // 1. Fetch providers
        const providers = await ServiceProvider.find().select('_id profilePicture fullname phonenumber');
        console.log(`[DEBUG /api/sprovider/all] Providers fetched: ${providers.length}`);
        if (providers.length === 0) {
            return res.status(200).json({ success: true, count: 0, providers: [] });
        }

        // 2. Fetch ALL services and explicitly populate the provider field
        //    This helps confirm the provider reference is valid in the service documents.
        const allServices = await Service.find()
            .select('provider title description price serviceTypes serviceArea duration')
            .populate('provider', '_id'); // Populate just the ID to check the link

        console.log(`[DEBUG /api/sprovider/all] ALL Services fetched: ${allServices.length}`);

        if (allServices.length > 0) {
            // Log a sample service *after* population to see if the provider field resolved
            console.log('[DEBUG /api/sprovider/all] Sample service AFTER populate:', JSON.stringify(allServices[0], null, 2));
        } else {
            console.log('[DEBUG /api/sprovider/all] No services found in the database.');
        }

        // 3. Create a Map for efficient service lookup by provider ID
        const servicesByProvider = new Map();
        allServices.forEach(service => {
            // Ensure the populated provider field exists and has an _id
            if (service.provider && service.provider._id) {
                const providerIdString = service.provider._id.toString();
                if (!servicesByProvider.has(providerIdString)) {
                    servicesByProvider.set(providerIdString, []);
                }
                // Add the service details to the map
                servicesByProvider.get(providerIdString).push({
                    title: service.title || 'No Title',
                    description: service.description || 'No Description',
                    price: service.price === undefined || service.price === null ? 'N/A' : service.price,
                    serviceTypes: Array.isArray(service.serviceTypes) ? service.serviceTypes : [],
                    serviceArea: service.serviceArea || 'Not specified',
                    duration: service.duration || 'Not specified'
                });
            } else {
                // Log services that couldn't be mapped
                console.warn(`[DEBUG /api/sprovider/all] Service ${service._id} has missing or invalid provider link.`);
            }
        });

        console.log(`[DEBUG /api/sprovider/all] Created map with services for ${servicesByProvider.size} unique providers.`);

        // 4. Map providers and attach services from the Map
        const providersWithServices = providers.map(provider => {
            const providerObj = provider.toObject();
            const providerIdString = provider._id.toString();

            // Get services for this provider from the map, default to empty array if none found
            const matchedServices = servicesByProvider.get(providerIdString) || [];

            // Log service count for the first provider
            if (provider === providers[0]) {
                 console.log(`[DEBUG /api/sprovider/all] Found ${matchedServices.length} services for provider ${providerIdString} using Map.`);
            }

            return {
                ...providerObj,
                services: matchedServices // Assign services from the map
            };
        });

        console.log('[DEBUG /api/sprovider/all] Returning providers with mapped services.');
        res.status(200).json({
            success: true,
            count: providersWithServices.length,
            providers: providersWithServices
        });
    } catch (error) {
        console.error('[ERROR /api/sprovider/all] Failed:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch service providers',
            error: error.message
        });
    }
});

// Error handling middleware specific to service provider routes
router.use((error, req, res, next) => {
    console.error('Service Provider Route Error:', error);
    res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Internal server error'
    });
});

module.exports = router;
