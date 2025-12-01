
import { hashPassword } from "../../Utils/hash.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../Utils/generateTokens.js";
import registerQuery from "../../services/authService/register.query.js";

export const registerController = async (req, res) => {
  try {
    const { full_name, email, password, confirmPassword, phone_number,role_id } =
      req.body;
if(!full_name || !email || !password || !confirmPassword || !phone_number || !role_id){
  return res.status(400).json({error:"All fields are required"})
}

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
    const userExists = await registerQuery.checkUserExists(email);
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedpassword = await hashPassword(password);

    // insert new user into database using query
    const user = await registerQuery.createUser(
      full_name,
      email,
      hashedpassword,
      phone_number,
      role_id
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

export default registerController;
