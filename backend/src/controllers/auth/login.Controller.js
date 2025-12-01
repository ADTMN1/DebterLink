import { comparePassword } from "../../Utils/hash.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../Utils/generateTokens.js";

import { findUserByEmail } from "../../services/authService/login.query.js";

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Check if user exists using query
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Validate password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Respond with tokens
    res.status(200).json({
      status:true,
    
      message: "Login successful",
data:{
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone_number: user.phone_number,
        role_id: user.role_id,
},
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

export default loginController;
