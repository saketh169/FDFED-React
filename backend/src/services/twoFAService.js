const nodemailer = require('nodemailer');

// In-memory storage for 2FA PINs (in production, use Redis or database)
const pinStore = new Map();

// Create transporter for Gmail (singleton pattern)
let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }
  return transporter;
};

// Generate a 6-digit random PIN
const generatePIN = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store PIN with email and timestamp (no expiry - similar to forgot password)
const storePIN = (email, pin) => {
  pinStore.set(email, {
    pin,
    timestamp: Date.now()
  });
};

// Get stored PIN for email
const getStoredPIN = (email) => {
  const data = pinStore.get(email);
  if (!data) return null;
  return data.pin;
};

// Remove PIN after successful verification
const removePIN = (email) => {
  pinStore.delete(email);
};

// Send 2FA PIN email to user
const send2FAEmail = async (email, pin, userName = 'User') => {
  const pinHtml = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background-color: #1E6F5C; color: white; padding: 20px; text-align: center;">
      <h1>NutriConnect Two-Factor Authentication</h1>
    </div>
    <div style="padding: 20px; background-color: #f9f9f9;">
      <h2>Hello ${userName}!</h2>
      <p>We received a sign-in request for your NutriConnect account.</p>

      <div style="background-color: white; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: center; border: 2px solid #1E6F5C;">
        <h3 style="color: #1E6F5C; margin-bottom: 10px;">Your Verification PIN</h3>
        <div style="font-size: 32px; font-weight: bold; color: #1E6F5C; letter-spacing: 5px; font-family: monospace;">
          ${pin}
        </div>
        <p style="margin-top: 15px; color: #666; font-size: 14px;">
          Please enter this PIN to complete your sign-in.
        </p>
      </div>

      <p><strong>Security Notice:</strong> If you didn't attempt to sign in, please ignore this email and consider changing your password.</p>

      <p>If you have any questions, please contact our support team.</p>

      <p>Best regards,<br>The NutriConnect Team</p>
    </div>
    <div style="background-color: #1E6F5C; color: white; padding: 10px; text-align: center;">
      <p>Contact us: nutriconnect6@gmail.com | +91 70757 83143</p>
    </div>
  </div>`;

  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Two-Factor Authentication PIN - NutriConnect',
      html: pinHtml
    });
    console.log('2FA PIN email sent successfully to:', email);
    return { success: true };
  } catch (error) {
    console.error('Error sending 2FA PIN email:', error);
    return { success: false, error };
  }
};

// Main function to send 2FA PIN for sign-in
const send2FAPIN = async (email, userName = 'User') => {
  try {
    // Generate new PIN
    const pin = generatePIN();

    // Store PIN with email
    storePIN(email, pin);

    // Send PIN email
    const emailResult = await send2FAEmail(email, pin, userName);

    if (emailResult.success) {
      return { success: true, message: '2FA PIN sent successfully' };
    } else {
      // Remove stored PIN if email failed
      removePIN(email);
      return { success: false, message: 'Failed to send 2FA PIN email', error: emailResult.error };
    }
  } catch (error) {
    console.error('Error in send2FAPIN:', error);
    return { success: false, message: 'Internal server error', error };
  }
};

// Verify 2FA PIN for sign-in
const verify2FAPIN = (email, enteredPIN) => {
  const storedPIN = getStoredPIN(email);

  if (!storedPIN) {
    return { success: false, message: 'PIN expired or not found. Please request a new one.' };
  }

  if (storedPIN !== enteredPIN) {
    return { success: false, message: 'Invalid PIN. Please try again.' };
  }

  // PIN is valid, remove it from storage
  removePIN(email);

  return { success: true, message: 'PIN verified successfully' };
};

module.exports = {
  send2FAPIN,
  verify2FAPIN,
  getStoredPIN,
  removePIN
};
