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
    // console.log(decoded)
    req.user = decoded;
    next();
  });
};

 
export  const verifyRole=(role) =>{
  return (req, res, next) => {
    
    if (req.user.role_id !== role) { 

      return res.status(403).json({ error: "Forbidden: Insufficient role" });
    }
    // req.user=req.user
//        const user = req.user
// console.log("IN TEACHER MIDDLWARE",user)
  next();
  }}



  // export default {verifyRole, authMiddleware};