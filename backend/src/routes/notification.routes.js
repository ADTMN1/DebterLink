import express from 'express';
import { sendNotification, getNotifications, editNotification } from '../controllers/notification.controller.js';

const notification_router = express.Router();

// Send a notification
notification_router.post('/notifications', async (req, res) => {
  const { user_id, sender_id, type, message } = req.body;
  try {
    const notification = await sendNotification({ user_id, sender_id, type, message });
    if (!notification) {
      return res.status(404).json({ 
        status: false,
        msg:"Fail to Send notification" });
    }
    res.status(201).json({
      status: true,
      msg: "Notification sent successfully",
      data: notification
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

// Get all notifications for a user
notification_router.get('/notifications/:user_id',getNotifications);

// Mark as read
notification_router.patch('/notifications/:id', editNotification);

export default notification_router;
