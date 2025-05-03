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

// ======= STORAGE SOLUTION CHANGE =======
// Use a simpler, more direct path for uploads on Windows
const tempUploadDir = 'C:/temp/skilldash-uploads';
const profilePicDir = path.join(tempUploadDir, 'profile-pictures');

console.log('Using temporary upload directory:', tempUploadDir);
console.log('Profile pictures directory:', profilePicDir);

// Create directories with full error handling
try {
    // Create the base directory
    if (!fs.existsSync(tempUploadDir)) {
        fs.mkdirSync(tempUploadDir, { recursive: true });
        console.log(`Created base upload directory: ${tempUploadDir}`);
    }
    
    // Create the profile pictures directory
    if (!fs.existsSync(profilePicDir)) {
        fs.mkdirSync(profilePicDir, { recursive: true });
        console.log(`Created profile pictures directory: ${profilePicDir}`);
    }
    
    // Test write permissions with a simple file
    const testFilePath = path.join(profilePicDir, 'test.txt');
    fs.writeFileSync(testFilePath, 'Testing write permissions');
    console.log(`Successfully wrote test file: ${testFilePath}`);
    
    // Clean up the test file
    fs.unlinkSync(testFilePath);
    console.log('Test file removed, directories are writable');
} catch (error) {
    console.error('ERROR SETTING UP DIRECTORIES:', error);
}

// Configure multer with the new path
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // Always ensure directory exists right before writing
        if (!fs.existsSync(profilePicDir)) {
            fs.mkdirSync(profilePicDir, { recursive: true });
        }
        cb(null, profilePicDir);
    },
    filename: function(req, file, cb) {
        const ext = path.extname(file.originalname);
        const filename = 'profile-' + Date.now() + '-' + Math.round(Math.random() * 10000) + ext;
        console.log('Generated filename:', filename);
        cb(null, filename);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Update the controller to use the new file path
router.post('/register', (req, res, next) => {
    console.log('Service Provider Route Hit:', {
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.url,
        contentType: req.get('Content-Type')
    });
    
    // Ensure directories exist right before processing the request
    try {
        if (!fs.existsSync(tempUploadDir)) {
            fs.mkdirSync(tempUploadDir, { recursive: true });
        }
        if (!fs.existsSync(profilePicDir)) {
            fs.mkdirSync(profilePicDir, { recursive: true });
        }
    } catch (err) {
        console.error('Error ensuring directories exist:', err);
    }
    
    // Use single-file upload middleware
    upload.single('profilePicture')(req, res, (err) => {
        if (err) {
            console.error('Upload error:', err);
            return res.status(500).json({
                success: false,
                message: 'Error uploading file',
                error: err.message
            });
        }
        
        // If file was uploaded successfully, modify the req.file to use the correct path
        if (req.file) {
            console.log('File uploaded successfully:', req.file.path);
            // Store the absolute file path in req.file.absolutePath for use in the controller
            req.file.absolutePath = req.file.path;
            // Modify the path for database storage to be relative
            req.file.relativePath = `/temp/skilldash-uploads/profile-pictures/${req.file.filename}`;
        } else {
            console.log('No file was uploaded');
        }
        
        // Continue to the registration controller
        registerServiceProvider(req, res);
    });
});

router.post('/login', loginServiceProvider);

module.exports = router;
