/**
 * Authentication Middleware
 * Validates JWT tokens and protects routes
 */

const { verifyAccessToken } = require('../utils/jwt');
const { errorResponse } = require('../utils/response');

/**
 * Middleware to authenticate requests using JWT
 * Extracts token from Authorization header (Bearer token)
 */
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return errorResponse(res, 'Access token is required', 401);
    }
    
    // Check for Bearer token format
    if (!authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Invalid token format. Use: Bearer <token>', 401);
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return errorResponse(res, 'Access token is required', 401);
    }
    
    // Verify the token
    const decoded = verifyAccessToken(token);
    
    // Attach user info to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Access token has expired', 401);
    }
    
    if (error.name === 'JsonWebTokenError') {
      return errorResponse(res, 'Invalid access token', 401);
    }
    
    return errorResponse(res, 'Authentication failed', 401);
  }
};

/**
 * Optional authentication middleware
 * Attaches user info if token is valid, but doesn't block if not
 */
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = verifyAccessToken(token);
      req.user = {
        id: decoded.id,
        email: decoded.email,
      };
    }
  } catch (error) {
    // Token invalid or expired, continue without user
    req.user = null;
  }
  
  next();
};

module.exports = {
  authenticate,
  optionalAuth,
};

