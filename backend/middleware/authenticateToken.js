const jwt = require('jsonwebtoken');
const { secret } = require('../config/jwtConfig');

const authenticateToken = (req, res, next) => {
  try {
    // Check header for token
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ 
        success: false, 
        message: 'No authorization header provided' 
      });
    }
    
    // Parse token from "Bearer TOKEN" format
    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid authorization format. Use: Bearer <token>' 
      });
    }
    
    const token = tokenParts[1];
    
    // Verify the token using the centralized JWT secret
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        console.error(`Token verification failed: ${err.message}`);
        
        return res.status(403).json({ 
          success: false, 
          message: `Invalid token: ${err.message}`
        });
      }
      
      // Token is valid - add user info to request
      req.user = decoded;
      next();
    });
  } catch (err) {
    console.error('Error in authenticateToken middleware:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal authentication error'
    });
  }
};

module.exports = authenticateToken;
