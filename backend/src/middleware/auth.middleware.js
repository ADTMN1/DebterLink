// In src/middleware/auth.middleware.js
import jwt from 'jsonwebtoken';
import { ROLES } from '../../constants/roles.js';

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "No authentication token provided"
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log('🔑 JWT DECODED PAYLOAD:', decoded);
    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Token has expired"
      });
    }
    return res.status(401).json({
      error: "Unauthorized",
      message: "Invalid authentication token"
    });
  }
};


// Role-based access control
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }

    if (!allowedRoles.includes(req.user.role_id)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to access this resource'
      });
    }

    next();
  };
};

// Check if user is the owner of the resource
export const isOwner = (model, idParam = 'id') => {
  return async (req, res, next) => {
    try {
      const resource = await model.findByPk(req.params[idParam]);
      
      if (!resource) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Resource not found'
        });
      }

      // Allow super admin to access any resource
      if (req.user.role_id === ROLES.SUPER_ADMIN) {
        return next();
      }

      // Check if the user is the owner
      if (resource.user_id !== req.user.user_id) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'You do not have permission to access this resource'
        });
      }

      next();
    } catch (error) {
      console.error('Error in isOwner middleware:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred while checking resource ownership'
      });
    }
  };
};

// For backward compatibility
export const authMiddleware = authenticate;
export const verifyRole = authorize;

// Export all middleware
export default {
  authenticate,
  authorize,
  isOwner,
  authMiddleware,
  verifyRole
};