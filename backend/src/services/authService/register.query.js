import db from "../../../config/db.config.js";

// Check if user already exists
 const checkUserExists = async (email) => {
  const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows.length > 0;
};

// Insert new user into database
 const createUser = async (full_name, email, hashedpassword, phone_number,role_id) => {
  const result = await db.query(
    "INSERT INTO users (full_name, email, password, phone_number,role_id) VALUES ($1, $2, $3, $4,$5) RETURNING *",
    [full_name, email, hashedpassword, phone_number,role_id]
  );
  return result.rows[0];
};


export default {createUser, checkUserExists}