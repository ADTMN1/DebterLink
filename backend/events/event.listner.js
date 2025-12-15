import eventBus from "./event.bus.js";
import pool from "../config/db.config.js"; // to fetch parent info
import sendEmail from "../src/Utils/send.email.js";
eventBus.on("examSubmitted", async (data) => {
  try {
    console.log("I am from emmiter",data)
    
    const { student_id, total_marks, subject_id } = data;


    // 2. Prepare email message
    const message = `
  <h1>Hello Parent</h1>

  <p>The teacher has submitted the exam for your child <strong>${studentName}</strong>.</p>

  <p><strong>Here are the details:</strong></p>

  <p><strong>Student ID:</strong> ${student_id}</p>
  <p><strong>Marks:</strong> ${total_marks}</p>
  <p><strong>Subject ID:</strong> ${subject_id}</p>

  <br />
  <p>Thank you!</p>
`;

const parentEmail =`melkiasapo@gmail.com`
    // 3. Send email
    await sendEmail(parentEmail, "Exam Submitted Notification", message);

    console.log("Email sent to parent in listener:", parentEmail);

  } catch (err) {
    console.log("Error in Exam Submitted listener:", err.message);
  }
});
