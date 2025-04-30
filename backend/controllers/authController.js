// ...existing code...

const jwt = require('jsonwebtoken');
const { secret, options, createTokenPayload } = require('../config/jwtConfig');

// Update the token generation function
const generateToken = (user, userType) => {
  const payload = createTokenPayload(user, userType);
  return jwt.sign(payload, secret, options);
};

// ...existing code...
