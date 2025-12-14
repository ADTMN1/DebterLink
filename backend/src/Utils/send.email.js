import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export default async function sendEmail(to, subject, text) {
    console.log("Sending email to:", to);
  await transporter.sendMail({
    to,
    subject,
    text,
  });
}
