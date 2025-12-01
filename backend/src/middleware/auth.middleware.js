import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Expect bearer token

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
    
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }

    // Attach decoded payload to request
    req.user = decoded;
    next();
  });
};

 
export  const verifyRole=(role) =>{
console.log(role)
   return (req, res, next) => {
    // console.log("is there role",req.user)
    if (req.user.role !== role) { 

      return res.status(403).json({ error: "Forbidden: Insufficient role" });
    }
  next();
  }}



  // export default {verifyRole, authMiddleware};