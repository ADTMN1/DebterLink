import eventBus from "./event.bus.js";
import pool from "../config/db.config.js"; // to fetch parent info
import sendEmail from "../src/Utils/send.email.js";
eventBus.on("examSubmitted", async (data) => {
  try {
    console.log("I am from emmiter",data)
    
    const { student_id, total_marks, subject_id } = data;
  const sql = `
SELECT *
FROM exam
JOIN student ON exam.student_id = student.student_id
JOIN parent ON student.parent_id = parent.parent_id
WHERE exam.student_id =$1;
`;


    // 1. Find parent email based on student_id
    const parentQuery = await pool.query(
      sql,
      [student_id]
    );
console.log("parentQuery",parentQuery.rows[0])
    if (parentQuery.rows.length === 0) return;

    const parentEmail = parentQuery.rows[0].email;
    const studentName = parentQuery.rows[0].student_name;

    // 2. Prepare email message
    const message = `
      Hello Parent,
      The teacher has submitted the exam for your child ${studentName}.
      Marks: ${total_marks}
      Subject ID: ${subject_id}
    `;
// const parentEmail =`melkiasapo@gmail.com`
    // 3. Send email
    await sendEmail(parentEmail, "Exam Submitted Notification", message);

    console.log("Email sent to parent in listener:", parentEmail);

  } catch (err) {
    console.log("Error in Exam Submitted listener:", err.message);
  }
});
