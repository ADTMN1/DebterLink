const db = require("../../../config/db.config");
const { comparePassword } = require("../../Utils/hash");

//user login handler

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const userResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const user = userResult.rows[0];

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const AccessToken = generateAccessToken(user);
    const RefreshToken = generateRefreshToken(user);
    res.status(200).json({
      message: "Login successful",
      AccessToken,
      RefreshToken,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Something went wrong. Please try again later." });
  }
}
module.exports = { loginController };