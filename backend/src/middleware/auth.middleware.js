import jwt from "jsonwebtoken";
import statusCode from 'http-status-codes';

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Expect bearer token

  if (!token) {

    return res.status(401).json({
      status:false,
       msg: "Access token required"
       });
  }

  console.log(statusCode)

  jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
    
    if (err) {
      return res.status(403).json({ 
        
        status:false,
        msg: "Invalid or expired token"
       });
    }

    // Attach decoded payload to request
    req.user = decoded;
    next();
  });
};




export const verifyRole = (requiredRole) => {
return (req,res,next)=>{
  const userRole = req.user.role;
  if (!userRole.includes(requiredRole)){

    return res.status(statusCode.FORBIDDEN).json({ 
      status:false, 
      
      msg: "Insufficient permissions" });
 
  } else {
    next();
  }
}



}
