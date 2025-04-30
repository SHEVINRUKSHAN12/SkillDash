const Customer = require('../models/Cregister_model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Add console logs for debugging
const registerCustomer = async (req, res) => {
  console.log('registerCustomer controller called');
  console.log('Request body:', req.body);
  
  try {
    const { fullName, email, password, phoneNumber, address } = req.body;

    // Validate input
    if (!fullName || !email || !password || !phoneNumber || !address) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields' 
      });
    }

    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ 
        success: false, 
        message: 'Customer already exists' 
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const customer = new Customer({
      fullName,
      email,
      password: hashedPassword,
      phoneNumber,
      address
    });

    await customer.save();

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      customer: {
        id: customer._id,
        fullName: customer.fullName,
        email: customer.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration',
      error: error.message 
    });
  }
};

const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;
    const customer = await Customer.findOne({ email });

    if (customer && (await customer.matchPassword(password))) {
      res.json({
        success: true,
        customer: {
          _id: customer._id,  // Use _id consistently
          fullName: customer.fullName,
          email: customer.email,
          phoneNumber: customer.phoneNumber,
          address: customer.address
        }
      });
    } else {
      res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
};

const getCustomerProfile = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).select('-password');
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    res.status(200).json({
      success: true,
      customer: {
        id: customer._id,
        fullName: customer.fullName,
        email: customer.email,
        phoneNumber: customer.phoneNumber,
        address: customer.address
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, address } = req.body;
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    // Check if email is being changed and if it already exists
    if (email !== customer.email) {
      const emailExists = await Customer.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
      }
    }

    customer.fullName = fullName || customer.fullName;
    customer.email = email || customer.email;
    customer.phoneNumber = phoneNumber || customer.phoneNumber;
    customer.address = address || customer.address;

    const updatedCustomer = await customer.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      customer: {
        id: updatedCustomer._id,
        fullName: updatedCustomer.fullName,
        email: updatedCustomer.email,
        phoneNumber: updatedCustomer.phoneNumber,
        address: updatedCustomer.address
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    res.status(200).json({ 
      success: true, 
      message: 'Account deleted successfully' 
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerCustomer,
  loginCustomer,
  getCustomerProfile,
  updateCustomer,
  deleteCustomer
};
