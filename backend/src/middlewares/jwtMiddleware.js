const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-development';

/**
 * JWT Middleware - Replaces session-based ensureAuthenticated
 * Verifies that a valid JWT token is present in the request
 */
function verifyJWT(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided. Please login first.',
        code: 'NO_TOKEN'
      });
    }

    // Extract token from "Bearer TOKEN"
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token format. Use Bearer <token>',
        code: 'INVALID_FORMAT'
      });
    }

    // Verify JWT signature and expiration
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Attach user info to request object
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
      roleId: decoded.roleId
    };

    console.log(`✅ JWT verified for user: ${decoded.role} (${decoded.userId})`);
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token has expired. Please login again.',
        code: 'TOKEN_EXPIRED'
      });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token. Please login again.',
        code: 'INVALID_TOKEN'
      });
    }
    
    console.error('JWT verification error:', error.message);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error during token verification'
    });
  }
}

/**
 * Role-Based Authorization Middleware - Replaces ensureAuthorized(role)
 * Verifies that the user has the required role
 */
function requireRole(allowedRoles) {
  // allowedRoles can be a string or array
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req, res, next) => {
    // First verify JWT (should have been called before this middleware)
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not authenticated',
        code: 'NOT_AUTHENTICATED'
      });
    }

    const userRole = req.user.role.toLowerCase();
    const hasRequiredRole = roles.some(role => role.toLowerCase() === userRole);

    if (hasRequiredRole) {
      console.log(`✅ User role authorized: ${userRole}`);
      next();
    } else {
      return res.status(403).json({ 
        success: false, 
        message: `Access denied. This resource requires one of these roles: ${roles.join(', ')}. Your role: ${userRole}`,
        code: 'INSUFFICIENT_ROLE'
      });
    }
  };
}

/**
 * Verification Status Middleware - Replaces ensureDietitianReportVerified
 * Checks if dietitian's report is verified
 */
async function requireDietitianVerified(req, res, next) {
  try {
    if (!req.user || req.user.role !== 'dietitian') {
      return res.status(403).json({ 
        success: false, 
        message: 'Only dietitians can access this resource' 
      });
    }

    const { Dietitian } = require('../models/userModel');
    const dietitian = await Dietitian.findById(req.user.roleId);

    if (!dietitian) {
      return res.status(404).json({ 
        success: false, 
        message: 'Dietitian profile not found' 
      });
    }

    const status = dietitian.verificationStatus?.finalReport || 'Not Received';

    if (status === 'Verified') {
      next();
    } else if (status === 'Rejected') {
      return res.status(403).json({ 
        success: false, 
        message: 'Your verification has been rejected. Please contact support.',
        code: 'VERIFICATION_REJECTED'
      });
    } else {
      return res.status(403).json({ 
        success: false, 
        message: 'Your verification is still pending. Please try again later.',
        code: 'VERIFICATION_PENDING'
      });
    }
  } catch (error) {
    console.error('Error checking dietitian verification:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error checking verification status' 
    });
  }
}

/**
 * Verification Status Middleware - Replaces ensureOrganizationReportVerified
 * Checks if organization's report is verified
 */
async function requireOrganizationVerified(req, res, next) {
  try {
    if (!req.user || req.user.role !== 'organization') {
      return res.status(403).json({ 
        success: false, 
        message: 'Only organizations can access this resource' 
      });
    }

    const { Organization } = require('../models/userModel');
    const organization = await Organization.findById(req.user.roleId);

    if (!organization) {
      return res.status(404).json({ 
        success: false, 
        message: 'Organization profile not found' 
      });
    }

    const status = organization.verificationStatus?.finalReport || 'Not Received';

    if (status === 'Verified') {
      next();
    } else if (status === 'Rejected') {
      return res.status(403).json({ 
        success: false, 
        message: 'Your verification has been rejected. Please contact support.',
        code: 'VERIFICATION_REJECTED'
      });
    } else {
      return res.status(403).json({ 
        success: false, 
        message: 'Your verification is still pending. Please try again later.',
        code: 'VERIFICATION_PENDING'
      });
    }
  } catch (error) {
    console.error('Error checking organization verification:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error checking verification status' 
    });
  }
}

module.exports = {
  verifyJWT,
  requireRole,
  requireDietitianVerified,
  requireOrganizationVerified
};
