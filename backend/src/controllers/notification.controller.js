import { StatusCodes } from 'http-status-codes';
import pool from '../../config/db.config.js';

// 1️⃣ Send a notification
export const sendNotification = async ({ user_id, sender_id, type, message }) => {
  try {
    const result = await pool.query(
      `INSERT INTO notifications (user_id, sender_id, type, message)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [user_id, sender_id, type, message]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};

// 2️⃣ Get all notifications for a user
export const getNotifications = async (req,res) => {

  try {
const {user_id} = req.params

if(!user_id){
    return res.status(StatusCodes.BAD_REQUEST).json({
        status:false,
        msg:"ID is reguired."
    })
}

const sql =`SELECT * FROM notifications 
       WHERE user_id = $1 
       ORDER BY created_at DESC`

    const result = await pool.query(
      sql,
      [user_id]
    );
    if(!result){
        return res.status(StatusCodes.BAD_REQUEST).json({
            status:false,
            msg:"Notification is not found."
        })
    }
    return res.status(StatusCodes.OK).json({
        data:result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status:false,
    msg:"Internal Server error."
})  }
};

// 3️⃣ Optional: Mark notification as read
export const markAsRead = async (notificationId) => {
  try {
    await pool.query(
      `UPDATE notifications SET is_read = true WHERE id = $1`,
      [notificationId]
    );
    return { message: 'Notification marked as read' };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};
