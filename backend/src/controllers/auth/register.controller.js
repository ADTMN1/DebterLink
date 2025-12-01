<<<<<<< HEAD
import { hashPassword } from "../../Utils/hash.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../Utils/generateTokens.js";
import {
  checkUserExists,
  createUser,
} from "../../services/Query/Authquery/register.query.js";

export const registerUser = async (req, res) => {
  try {
    const { full_name, email, password, confirmPassword, phone_number } =
=======

import { hashPassword } from "../../Utils/hash.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../Utils/generateTokens.js";
import {
  checkUserExists,
  createUser,
} from "../../services/Query/Authquery/register.query.js";

export const registerController = async (req, res) => {
  try {
    const { full_name, email, password, confirmPassword, phone_number,role_id } =
>>>>>>> 1594b481534e49b961058fb1a227eed645c92093
      req.body;

    // Basic constraints for password validation
    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters long" });
    }
    if (password !== confirmPassword) {
     
      return res.status(400).json({ error: "Passwords do not match" });
      
    }

    // Regex for complexity
    const strongRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/;
    if (!strongRegex.test(password)) {
      return res.status(400).json({
        error:
          "Password must include uppercase, lowercase, number, and special character",
      });
    }

    // check if user already exists using query
    const userExists = await checkUserExists(email);
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedpassword = await hashPassword(password);

    // insert new user into database using query
    const user = await createUser(
      full_name,
      email,
      hashedpassword,
      phone_number
    );

    const AccessToken = generateAccessToken(user);
    const RefreshToken = generateRefreshToken(user);

    res.status(201).json({
      message: "user registered successfully",
      AccessToken,
      RefreshToken,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "something went wrong try again later" });
  }
};

<<<<<<< HEAD
export default registerUser;
=======
export default registerController;
>>>>>>> 1594b481534e49b961058fb1a227eed645c92093
