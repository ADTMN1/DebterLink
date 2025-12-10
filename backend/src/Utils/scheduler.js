//attention/ we have to implement with sendgrid or must find another way to push notifications on the web and also in the web app.

// import cron from "node-cron";
// import pool from "../../config/db.config.js";
// import nodemailer from "nodemailer";

// /**
//  * Scheduler that:
//  * - Runs daily at 08:00 to remind students who haven't submitted assignments due today or later.
//  * - Runs hourly to send "due tomorrow" reminders.
//  *
//  * Requires SMTP env vars: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM
//  */

// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: Number(process.env.SMTP_PORT || 587),
//   secure: false,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });

// const sendEmail = async ({ to, subject, text }) => {
//   if (!process.env.SMTP_USER) {
//     console.log("SMTP not configured — skipped email to", to);
//     return;
//   }
//   try {
//     await transporter.sendMail({
//       from: process.env.EMAIL_FROM || process.env.SMTP_USER,
//       to,
//       subject,
//       text,
//     });
//   } catch (err) {
//     console.error("sendEmail error:", err);
//   }
// };

// export const dailyPendingReminders = async () => {
//   console.log("Scheduler: dailyPendingReminders running");
//   // get assignments due today or later
//   const asgSql = `SELECT assignment_id, title, due_date, class_id FROM assignment WHERE due_date >= current_date`;
//   const { rows: assignments } = await pool.query(asgSql);

//   for (const a of assignments) {
//     // students in class
//     const studentsRes = await pool.query(
//       `
//       SELECT st.student_id, u.user_id as student_user_id, u.email, u.full_name
//       FROM student st
//       JOIN users u ON st.user_id = u.user_id
//       WHERE st.class_id = $1
//     `,
//       [a.class_id]
//     );

//     for (const st of studentsRes.rows) {
//       // if not submitted
//       const subRes = await pool.query(
//         `SELECT 1 FROM submissions WHERE assignment_id=$1 AND student_id=$2`,
//         [a.assignment_id, st.student_id]
//       );
//       if (subRes.rowCount === 0) {
//         // check reminders_log to avoid duplicate today
//         const check = await pool.query(
//           `SELECT 1 FROM reminders_log WHERE assignment_id=$1 AND student_id=$2 AND reminder_type='daily_pending' AND reminded_at::date = current_date`,
//           [a.assignment_id, st.student_id]
//         );
//         if (check.rowCount > 0) continue;

//         // send email
//         const subject = `Reminder: Assignment "${a.title}" is pending`;
//         const text = `Hi ${st.full_name},\n\nYou have not submitted "${a.title}" due on ${a.due_date}. Please submit on time.\n\nRegards.`;

//         await sendEmail({ to: st.email, subject, text });

//         // log reminder
//         await pool.query(
//           `INSERT INTO reminders_log (reminder_id, assignment_id, student_id, reminded_at, reminder_type)
//            VALUES (gen_random_uuid(), $1, $2, now(), 'daily_pending')`,
//           [a.assignment_id, st.student_id]
//         );
//       }
//     }
//   }
// };

// export const hourly24hBefore = async () => {
//   console.log("Scheduler: hourly24hBefore running");
//   const sql = `
//     SELECT assignment_id, title, due_date, class_id
//     FROM assignment
//     WHERE due_date = (current_date + INTERVAL '1 day')::date
//   `;
//   const { rows: assignments } = await pool.query(sql);

//   for (const a of assignments) {
//     const studentsRes = await pool.query(
//       `
//       SELECT st.student_id, u.email, u.full_name
//       FROM student st
//       JOIN users u ON st.user_id = u.user_id
//       WHERE st.class_id = $1
//     `,
//       [a.class_id]
//     );

//     for (const st of studentsRes.rows) {
//       const subRes = await pool.query(
//         `SELECT 1 FROM submissions WHERE assignment_id=$1 AND student_id=$2`,
//         [a.assignment_id, st.student_id]
//       );
//       if (subRes.rowCount === 0) {
//         const check = await pool.query(
//           `SELECT 1 FROM reminders_log WHERE assignment_id=$1 AND student_id=$2 AND reminder_type='24h_before'`,
//           [a.assignment_id, st.student_id]
//         );
//         if (check.rowCount > 0) continue;

//         const subject = `Reminder: Assignment "${a.title}" is due tomorrow`;
//         const text = `Hi ${st.full_name},\n\nThe assignment "${a.title}" is due tomorrow (${a.due_date}). Please submit before the deadline.`;

//         await sendEmail({ to: st.email, subject, text });

//         await pool.query(
//           `INSERT INTO reminders_log (reminder_id, assignment_id, student_id, reminded_at, reminder_type)
//            VALUES (gen_random_uuid(), $1, $2, now(), '24h_before')`,
//           [a.assignment_id, st.student_id]
//         );
//       }
//     }
//   }
// };

// export const startScheduler = () => {
//   // daily at 08:00 server timezone
//   cron.schedule("0 8 * * *", dailyPendingReminders, {
//     timezone: process.env.TIMEZONE || "UTC",
//   });
//   // hourly to catch 24h-before
//   cron.schedule("0 * * * *", hourly24hBefore, {
//     timezone: process.env.TIMEZONE || "UTC",
//   });
//   console.log("Assignment scheduler started");
// };
