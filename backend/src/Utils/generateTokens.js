import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generateAccessToken = (user) => {
  // console.log("from generate",user)
  return jwt.sign(
    { id: user.id, email: user.email, full_name: user.full_name,role_id:user.role_id },
    process.env.JWT_ACCESS_SECRET, 
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m" }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, full_name: user.full_name ,role_id:user.role_id},
    process.env.JWT_REFRESH_SECRET, 
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d" }
  );
};
//ACCESS_TOKEN_EXPIRY
//REFRESH_TOKEN_EXPIRY
// JWT_REFRESH_SECRET