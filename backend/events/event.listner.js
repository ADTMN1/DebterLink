import eventBus from "./event.bus.js";
import pool from "../config/db.config.js";
import sendEmail from "../src/Utils/send.email.js";

eventBus.on("examSubmitted", async (data) => {
  try {
    const { student_id, total_marks, subject_id } = data;

    if (!student_id || !total_marks || !subject_id)
      throw new Error("Invalid event data");

    // Fetch parent info safely
    const parentResult = await pool.query(
      `SELECT u.email, u.full_name AS student_name 
       FROM parent p
       JOIN users u ON u.user_id = p.user_id
       WHERE p.child_student_id = $1`,
      [student_id]
    );

    if (!parentResult.rows[0]) return; // parent not found

    const parentEmail = parentResult.rows[0].email;
    const studentName = parentResult.rows[0].student_name;

    // Prepare email
    const message = `
      <h1>Hello Parent</h1>
      <p>The teacher has submitted the exam for your child <strong>${studentName}</strong>.</p>
      <p><strong>Student ID:</strong> ${student_id}</p>
      <p><strong>Marks:</strong> ${total_marks}</p>
      <p><strong>Subject ID:</strong> ${subject_id}</p>
      <br />
      <p>Thank you!</p>
    `;

    // Send email
    await sendEmail(parentEmail, "Exam Submitted Notification", message);

    console.log("Email sent to parent:", parentEmail);
  } catch (err) {
    console.error("Error in Exam Submitted listener:", err.message);
  }
});
