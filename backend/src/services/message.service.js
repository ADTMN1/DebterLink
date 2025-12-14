import pool from '../../config/db.config.js';

const get_your_conversession = async (sender_id, receiver_id) => {
  try {
    const query = `
      SELECT *
      FROM messages
      WHERE (sender_id = $1 AND receiver_id = $2)
         OR (sender_id = $2 AND receiver_id = $1)
      ORDER BY created_at ASC
    `;

    const result = await pool.query(query, [sender_id, receiver_id]);
    return result.rows;  // return ALL messages

  } catch (error) {
    console.log(error);
    throw error;
  }
};
const save_Message = async ({sender_id, receiver_id, content, attachment_url}) => {
  try {
    const query = `
      INSERT INTO messages (sender_id, receiver_id, content, attachment_url, sent_date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const sent_date = new Date();
    const values = [sender_id, receiver_id, content, attachment_url, sent_date];

    const result = await pool.query(query, values);
    console.log("Message saved:", result.rows[0]);
    return result.rows[0];

  } catch (error) {
    console.log("Message save error:", error);
    throw error;
  }
};

export default {
  get_your_conversession,
  save_Message
};
