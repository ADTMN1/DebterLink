import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Require Bearer token
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Access token required" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Access token required" });
    }

    // Verify token securely
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {
      algorithms: ["HS256"], // prevent algorithm downgrade attacks
    });

    // Attach minimal trusted data
    req.user = {
      user_id: decoded.user_id || decoded.id,
      role_id: Number(decoded.role_id),
    };

    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

export const verifyRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user || Number(req.user.role_id) !== Number(requiredRole)) {
      return res.status(403).json({ error: "Forbidden: Insufficient role" });
    }
    next();
  };
};
