import axios from "axios";

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
        timeout: 5000
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

export const sendWelcomeEmail = async (toEmail, resetUrl, userName = "") => {
  try {
    console.log("📧 Sending welcome email to:", toEmail);

    let recipientName = userName.trim();
    if (!recipientName) {
      recipientName = toEmail.split("@")[0];
      recipientName = recipientName.charAt(0).toUpperCase() + recipientName.slice(1);
    }

    const emailData = {
      sender: {
        email: process.env.EMAIL_FROM,
        name: "DebterLink",
      },
      to: [
        {
          email: toEmail,
          name: recipientName,
        },
      ],
      subject: "DebterLink — Welcome! Set Your Password",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
          <h2 style="color: #2c3e50;">Welcome to Your School Portal</h2>
          <p>Hi ${recipientName},</p>
          <p>Your account has been created successfully. Please set your password to access your account.</p>
          
          <div style="margin: 30px 0; text-align: center;">
            <a href="${resetUrl}" 
               style="background-color: #3498db; color: white; padding: 15px 30px; 
                      text-decoration: none; border-radius: 5px; font-weight: bold; 
                      display: inline-block; cursor: pointer;">
              Set Your Password
            </a>
          </div>
          
          <p style="color: #7f8c8d; font-size: 14px;">
            Or copy and paste this link:<br>
            <code style="background: #f8f9fa; padding: 10px; display: block; 
                         word-break: break-all; border-radius: 3px;">
              ${resetUrl}
            </code>
          </p>
          
          <div style="margin-top: 30px; padding: 15px; background: #fff3cd; 
                      border-radius: 5px; border-left: 4px solid #ffc107;">
            <p style="margin: 0; color: #856404; font-size: 14px;">
              <strong>Security Notice:</strong> This link expires in 24 hours and can only be used once.
              If you didn't request this, please contact support immediately.
            </p>
          </div>
        </div>
      `,
    };

    console.log("📤 Sending to Brevo API...");

    const response = await axios.post("https://api.brevo.com/v3/smtp/email", emailData, {
      headers: {
        accept: "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json",
      },
      timeout: 5000,
    });

    console.log("✅ Welcome email sent! Message ID:", response.data.messageId);
    return response.data;
  } catch (error) {
    console.error(" Failed to send welcome email:");

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Error:", error.response.data);
    } else {
      console.error("Error message:", error.message);
    }

    throw error;
  }
};