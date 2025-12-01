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
      jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET, 
        (err, decoded) => {
          if (err) reject(err);
          else resolve(decoded);
        }
      );
    });

   
    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
    });

    const newRefreshToken = generateRefreshToken({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
    });

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
