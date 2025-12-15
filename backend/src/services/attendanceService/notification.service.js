// services/notification.service.js
import dotenv from "dotenv";
dotenv.config();

// Example: you can replace this with real SMS/email service like Twilio, SendGrid, or Firebase
class NotificationService {
  /**
   * Send notification to a single parent
   * @param {string} parentContact - email or phone number
   * @param {string} message - message to send
   */
  static async sendToParent(parentContact, message) {
    try {
      // For now, just log to console
      console.log(`[Notification] Sending to ${parentContact}: ${message}`);

      // Example placeholder for real service:
      // await twilioClient.messages.create({
      //   body: message,
      //   from: process.env.TWILIO_PHONE,
      //   to: parentContact
      // });

      return { success: true };
    } catch (err) {
      console.error("Failed to send notification:", err.message);
      return { success: false, error: err.message };
    }
  }

  /**
   * Trigger notification when attendance is marked
   * @param {object} attendance - attendance object from DB
   * @param {string} parentContact - parent's email or phone
   */
  static async notifyAttendanceMarked(attendance, parentContact) {
    const message = `Attendance marked for student ${attendance.student_id} in class ${attendance.class_id} on ${attendance.date} (${attendance.shift}). Status: ${attendance.status}`;
    return this.sendToParent(parentContact, message);
  }

  /**
   * Trigger notification when attendance is updated
   * @param {object} attendance - updated attendance object
   * @param {string} parentContact - parent's email or phone
   */
  static async notifyAttendanceUpdated(attendance, parentContact) {
    const message = `Attendance updated for student ${attendance.student_id} in class ${attendance.class_id} on ${attendance.date} (${attendance.shift}). New status: ${attendance.status}`;
    return this.sendToParent(parentContact, message);
  }
}

export default NotificationService;
