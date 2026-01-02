/**
 * Global Error Handler Middleware
 * Catches and formats all errors consistently
 */

const config = require('../config');

/**
 * Not Found Handler
 * Catches requests to undefined routes
 */
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};

/**
 * Global Error Handler
 * Catches all errors and returns formatted response
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  // Default error values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  
  // Prisma specific errors
  if (err.code === 'P2002') {
    statusCode = 409;
    message = 'A record with this value already exists';
  }
  
  if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Record not found';
  }
  
  // Validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }
  
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }
  
  const response = {
    success: false,
    message,
  };
  
  // Include stack trace in development
  if (config.nodeEnv === 'development') {
    response.stack = err.stack;
  }
  
  res.status(statusCode).json(response);
};

module.exports = {
  notFoundHandler,
  errorHandler,
};

