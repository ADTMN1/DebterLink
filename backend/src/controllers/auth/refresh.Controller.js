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
        process.env.REFRESH_TOKEN_SECRET, 
        (err, decoded) => {
          if (err) {
            reject(err);
          } else {
            resolve(decoded);
          }
        }
      );
    });

   
    const accessToken = generateAccessToken({
      user_id: user.user_id,
      email: user.email,
      full_name: user.full_name,
      role_id: user.role_id
    });

    const newRefreshToken = generateRefreshToken({
      user_id: user.user_id,
      email: user.email,
      full_name: user.full_name,
      role_id: user.role_id
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
