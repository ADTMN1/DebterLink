import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../Utils/generateTokens.js";

export const refreshController = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token missing" });
    }
    
    const user = await new Promise((resolve, reject) => {
      // console.log("tokena",refreshToken)
      // console.log("secreet key",process.env.REFRESH_TOKEN_SECRET)
     jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET, 
        (err, decoded) => {
          if (err) reject(err);
          else resolve(decoded);
        }
      );
    });
console.log('decoded user')
    const accessToken = generateAccessToken(user);
    
    const newRefreshToken = generateRefreshToken(user);

    return res.status(200).json({
      message: "Tokens refreshed successfully",
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
