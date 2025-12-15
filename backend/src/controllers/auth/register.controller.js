// src/controllers/auth/register.controller.js
import registerQuery from "../../services/authService/register.query.js";
import { hash } from "bcryptjs";
import jwt from "jsonwebtoken";

// Helper function to hash password
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await hash(password, saltRounds);
};

// JWT token generators
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role_id: user.role_id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role_id: user.role_id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
};

// Controller
export const registerController = async (req, res) => {
  try {
    const { full_name, email, password, confirmPassword, phone_number, role_id } = req.body;

    // Validate required fields
    if (!full_name || !email || !password || !confirmPassword || !phone_number || !role_id) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Validate password
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters long" });
    }
    const strongRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/;
    if (!strongRegex.test(password)) {
      return res.status(400).json({
        error: "Password must include uppercase, lowercase, number, and special character",
      });
    }

    // Check if user exists
    const userExists = await registerQuery.checkUserExists(email);
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedpassword = await hashPassword(password);

    // Create user
    const user = await registerQuery.createUser(full_name, email, hashedpassword, phone_number, role_id);

    // Generate tokens
    const AccessToken = generateAccessToken(user);
    const RefreshToken = generateRefreshToken(user);

    // Respond
    res.status(201).json({
      message: "User registered successfully",
      AccessToken,
      RefreshToken,
      user: { id: user.id, full_name: user.full_name, email: user.email, role_id: user.role_id },
    });

  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Something went wrong, please try again later" });
  }
};
