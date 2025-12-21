import { comparePassword } from "../../Utils/hash.js";
import { generateAccessToken, generateRefreshToken } from "../../Utils/generateTokens.js";
import { findUserByEmail } from "../../services/authService/login.query.js";

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
console.log(req.body)
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const cleanEmail = email.trim().toLowerCase(); // sanitize email

    const user = await findUserByEmail(cleanEmail);

    const isValid = user && await comparePassword(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid email or password" }); // consistent message
    }

    // Check if user has temporary password
    const hasTemporaryPassword = user.password_status === 'temporary';

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const response = {
      status: true,
      message: hasTemporaryPassword ? 
        "Login successful. Please set your permanent password." : 
        "Login successful",
      data: {
        id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        phone_number: user.phone_number,
        role_id: user.role_id,
        password_status: user.password_status || 'permanent',
        requiresPasswordChange: hasTemporaryPassword,
      },
      accessToken,
      refreshToken,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Something went wrong. Please try again later." });
  }
};

export default loginController;
