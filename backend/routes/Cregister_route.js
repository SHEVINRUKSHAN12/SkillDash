const express = require('express');
const router = express.Router();
const { 
  registerCustomer, 
  loginCustomer, 
  getCustomerProfile,
  updateCustomer,
  deleteCustomer 
} = require('../controllers/Cregister_controller');

// Simplified validation middleware
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }
  next();
};

// Debug middleware
router.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  if (req.body) {
    console.log('Request body:', { ...req.body, password: '[HIDDEN]' });
  }
  next();
});

// Routes
router.post('/register', registerCustomer);
router.post('/login', validateLogin, loginCustomer); // Remove the async middleware
router.get('/profile/:id', getCustomerProfile);
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);

module.exports = router;
