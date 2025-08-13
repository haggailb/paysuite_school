const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const secretKey = process.env.JWT_KEY;
const { activeTokens } = require('../controllers/authController');

function authenticateToken(req, res, next) {
  const openPathPrefixes = ['/api/auth/open/'];

  if (openPathPrefixes.some(prefix => req.originalUrl.startsWith(prefix))) {
    return next();
  }

  const authHeader = req.headers.authorization;
  let token;

  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else {
    token = authHeader;
  }

  if (!token || token === 'null' || token === 'undefined' || token === '') {
    return res.status(401).json({
      status: 'error',
      message: 'Access denied: No authorization token provided.',
    });
  }

  // if (!activeTokens.has(token)) {
  //   return res.status(403).json({
  //     status: 'error',
  //     message: 'Access denied: Token has been invalidated or expired.',
  //   });
  // }
  
  
  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied: Invalid or expired authorization token.',
      });
    }

    req.user = user;
    next();
  });
}


module.exports = authenticateToken;
