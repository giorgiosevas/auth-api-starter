/**
 * JWT Utility Functions
 * Handles token generation and verification
 */

const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * Generate an access token for a user
 * @param {Object} payload - User data to encode
 * @returns {string} JWT access token
 */
const generateAccessToken = (payload) => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

/**
 * Verify an access token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
const verifyAccessToken = (token) => {
  return jwt.verify(token, config.jwt.secret);
};

/**
 * Parse duration string to milliseconds
 * @param {string} duration - Duration string (e.g., '7d', '15m', '1h')
 * @returns {number} Duration in milliseconds
 */
const parseDuration = (duration) => {
  const units = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };
  
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) {
    return 7 * 24 * 60 * 60 * 1000; // Default: 7 days
  }
  
  const value = parseInt(match[1], 10);
  const unit = match[2];
  
  return value * units[unit];
};

/**
 * Calculate refresh token expiration date
 * @returns {Date} Expiration date
 */
const getRefreshTokenExpiry = () => {
  const duration = parseDuration(config.jwt.refreshExpiresIn);
  return new Date(Date.now() + duration);
};

module.exports = {
  generateAccessToken,
  verifyAccessToken,
  getRefreshTokenExpiry,
  parseDuration,
};

