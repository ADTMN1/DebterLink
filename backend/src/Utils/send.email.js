
import SibApiV3Sdk from "sib-api-v3-sdk";


const client = SibApiV3Sdk.ApiClient.instance;
client.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

export default async function sendEmail(to, subject, htmlContent) {
  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail({
      to: [{ email: to }],
      sender: { email: process.env.MAIL_FROM, name: 'School System' },
      subject,
      htmlContent,
    });

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Email sent successfully to:', to);
  } catch (err) {
    console.error('Failed to send email:', err.message);
  }
}
