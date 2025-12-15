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
        status:true,
        msg:"Notification fetched successfully.",
        data:result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status:false,
    msg:"Internal Server error."
})  }
};

export const getNotificationById = async (req, res) => {
  try {
    const { notification_id } = req.params;
    const result = await pool.query(
      `SELECT * FROM notifications WHERE notification_id = $1`,
      [notification_id]
    );
    if (result.rows.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: false,
        msg: "Notification not found"
      });
    }
    return res.status(StatusCodes.OK).json({
      status: true,
      msg: "Notification fetched successfully",
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching notification:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      msg: "Internal Server Error"
    });
  }
};
export const editNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, message, user_id } = req.body;

    const result = await pool.query(
      `
      UPDATE notifications
      SET
        type = COALESCE($1, type),
        message = COALESCE($2, message),
        user_id = COALESCE($3, user_id)
      WHERE id = $4
      RETURNING *
      `,
      [type, message, user_id, id]
    );

    if (result.rows.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: false,
        msg: "Notification not found"
      });
    }

    return res.status(StatusCodes.OK).json({
      status: true,
      msg: "Notification updated successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.error("Error updating notification:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      msg: "Internal Server Error"
    });
  }
};
