import axios from 'axios';

export const sendResetEmail = async (toEmail, resetUrl, userName = "") => {
  try {
    console.log("📧 Sending password reset email to:", toEmail);
    
    let recipientName = userName.trim();
    if (!recipientName) {
      recipientName = toEmail.split('@')[0];
      recipientName = recipientName.charAt(0).toUpperCase() + recipientName.slice(1);
    }
    
    const emailData = {
      sender: {
        email: process.env.EMAIL_FROM,
        name: "DebterLink"
      },
      to: [{
        email: toEmail,
        name: recipientName
      }],
      subject: "DebterLink — Password Reset Request",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Password Reset Request</h2>
          <p>Hi ${recipientName},</p>
          <p>You requested to reset your password. Click the button below:</p>
          <p style="margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #4CAF50; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 4px; font-weight: bold; cursor: pointer;">
              Reset Password
            </a>
          </p>
          <p>Or copy this link:</p>
          <code style="background: #f5f5f5; padding: 10px; display: block; word-break: break-all;">
            ${resetUrl}
          </code>
          <p style="margin-top: 20px; color: #666;">
            This link expires in ${process.env.RESET_TOKEN_EXPIRY_MINUTES || 15} minutes.
          </p>
        </div>
      `
    };

    console.log("📤 Sending to Brevo API...");
    
    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      emailData,
      {
        headers: {
          'accept': 'application/json',
          'api-key': process.env.BREVO_API_KEY,
          'content-type': 'application/json'
        },
        timeout: 10000
      }
    );
    
    console.log("✅ Email sent! Message ID:", response.data.messageId);
    return response.data;
    
  } catch (error) {
    console.error(" Failed to send email:");
    
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Error:", error.response.data);
      
      if (error.response.data?.code === 'unauthorized') {
        console.error(" API key is invalid or expired");
      } else if (error.response.data?.code === 'missing_parameter') {
        console.error(" Missing required parameter:", error.response.data.message);
      }
    } else {
      console.error("Error message:", error.message);
    }
    
    throw error;
  }
};