import db from "../../../../config/db.config.js";

// Check if user exists and return user data
export const findUserByEmail = async (email) => {
  const result = await db.query("SELECT * FROM school.user WHERE email = $1", [email]);
  return result.rows[0] || null;
};