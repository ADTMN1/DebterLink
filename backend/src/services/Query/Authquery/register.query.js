import db from "../../../../config/db.config.js";

// Check if user already exists
export const checkUserExists = async (email) => {
  const result = await db.query("SELECT * FROM school.user WHERE email = $1", [email]);
  return result.rows.length > 0;
};

// Insert new user into database
export const createUser = async (full_name, email, hashedpassword, phone_number) => {
  const result = await db.query(
    "INSERT INTO school.user (full_name, email, password, phone_number) VALUES ($1, $2, $3, $4) RETURNING *",
    [full_name, email, hashedpassword, phone_number]
  );
  return result.rows[0];
};