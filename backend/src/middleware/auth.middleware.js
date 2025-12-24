import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  
  if (!authHeader) {
    return res.status(401).json({ error: "Access token required" });
  }

  const token = authHeader.split(" ")[1]; 
  
  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
    // Additional validation: check if token has required fields
    if (!decoded.user_id || !decoded.email || !decoded.role_id) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid token format - please login again"
      });
    }
    
    req.user = decoded; // Attach user info (including role_id) to the request
    next();
  } catch (error) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Token verification failed - please login again"
    });
  }
}
export const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  
  if (!authHeader) {
    return res.status(401).json({ error: "Access token required" });
  }

  const token = authHeader.split(" ")[1]; 
  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded; // Attach user info (including role_id) to the request
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
    // Ensure the user exists (set by authenticate middleware)
    if (!req.user || !req.user.role_id) {
      return res.status(401).json({ error: "Unauthorized", message: "User identity not found" });
    }

    const userRole = Number(req.user.role_id); 
    
    // Check if user's role is in the allowed list
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to access this resource'
      });
    }

    next();
  };
};

// Alias for authorize function - used throughout the codebase
export const verifyRole = (role) => authorize(role);