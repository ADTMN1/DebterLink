import db from "../../../config/db.config.js";

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT u.user_id, u.full_name, u.email, u.phone_number, u.password_status, 
             r.role_name as role_name
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.role_id
      ORDER BY u.full_name ASC
    `);
    res.status(200).json({ status: true, users: result.rows });
  } catch (err) {
    console.error("Admin getAllUsers error:", err);
    res.status(500).json({ status: false, message: "Something went wrong" });
  }
};

// Delete a user by ID
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM users WHERE user_id = $1", [id]);
    res.status(200).json({ status: true, message: "User deleted" });
  } catch (err) {
    console.error("Admin deleteUser error:", err);
    res.status(500).json({ status: false, message: "Something went wrong" });
  }
};
