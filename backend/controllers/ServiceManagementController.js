const Service = require('../models/ServiceManagementModel');

// Get all services for a specific provider
exports.getServices = async (req, res) => {
    try {
        const providerId = req.user.id; // Get from JWT token
        const services = await Service.find({ provider: providerId });
        
        res.status(200).json({
            success: true,
            count: services.length,
            data: services
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// Create a new service
exports.createService = async (req, res) => {
    try {
        // Get provider ID from user object set by authenticateToken middleware
        const providerId = req.user.id;
        
        console.log('[ServiceManagementController] Creating service with:');
        console.log('- Provider ID:', providerId);
        console.log('- Request body:', req.body);
        
        // Validate provider ID
        if (!providerId || providerId === 'unknown') {
            console.error('[ServiceManagementController] Invalid provider ID');
            return res.status(400).json({
                success: false,
                message: 'Invalid provider ID'
            });
        }
        
        // Add provider ID to request body
        req.body.provider = providerId;
        
        // Create new service with provider ID included
        const newService = new Service({
            ...req.body,
            provider: providerId
        });
        
        // Save the service
        const savedService = await newService.save();
        console.log('[ServiceManagementController] Service created successfully:', savedService._id);
        
        res.status(201).json({
            success: true,
            message: 'Service created successfully',
            data: savedService
        });
    } catch (error) {
        console.error('[ServiceManagementController] Error creating service:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create service'
        });
    }
};

// Get a single service
exports.getService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        
        if (!service) {
            return res.status(404).json({
                success: false,
                error: 'Service not found'
            });
        }
        
        // Check if the service belongs to this provider
        if (service.provider.toString() !== req.user.id.toString()) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to access this service'
            });
        }
        
        res.status(200).json({
            success: true,
            data: service
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// Update a service
exports.updateService = async (req, res) => {
    try {
        let service = await Service.findById(req.params.id);
        
        if (!service) {
            return res.status(404).json({
                success: false,
                error: 'Service not found'
            });
        }
        
        // Check if the service belongs to this provider
        if (service.provider.toString() !== req.user.id.toString()) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to update this service'
            });
        }
        
        // Ensure serviceArea is provided if it's being updated
        if (req.body.serviceArea === '') {
            return res.status(400).json({
                success: false,
                error: ['Service area cannot be empty']
            });
        }
        
        service = await Service.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        
        res.status(200).json({
            success: true,
            data: service
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            
            return res.status(400).json({
                success: false,
                error: messages
            });
        }
        
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// Delete a service
exports.deleteService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        
        if (!service) {
            return res.status(404).json({
                success: false,
                error: 'Service not found'
            });
        }
        
        // Check if the service belongs to this provider
        if (service.provider.toString() !== req.user.id.toString()) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to delete this service'
            });
        }
        
        await Service.findByIdAndDelete(req.params.id);
        
        res.status(200).json({
            success: true,
            message: 'Service deleted successfully',
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};
