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

export const authenticate = (req, res, next) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
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
    const userRole = Number(req.user.role_id); 
    console.log("Checking role:", userRole, "Expected:", role);

    if (!allowedRoles.includes(req.user.role_id)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to access this resource'
      });
    }

    next();
  };
};
   
