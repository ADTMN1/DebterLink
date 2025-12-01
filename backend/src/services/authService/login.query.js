import db from "../../../config/db.config.js";

// Check if user exists and return user data
export const findUserByEmail = async (email) => {
  const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0] || null;
};