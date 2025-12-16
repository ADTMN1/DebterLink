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
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded;
    console.log("Decoded JWT payload:", decoded);
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

export const verifyRole = (role) => {
  return (req, res, next) => {
    const userRole = Number(req.user.role_id); 
    console.log("Checking role:", userRole, "Expected:", role);

    if (userRole !== role) {
      return res.status(403).json({ error: "Forbidden: Insufficient role" });
    }
    next();
  };
};
   