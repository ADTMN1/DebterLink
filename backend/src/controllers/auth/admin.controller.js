import db from "../../../config/db.config.js";

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const result = await db.query("SELECT user_id, full_name, email, role_id FROM users");
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
