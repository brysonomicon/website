const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/user");

require("dotenv").config();

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_RESET_USER,
    pass: process.env.EMAIL_RESET_PASS,
  },
});

/**
 * Sends a password reset email to the specified email address.
 * 
 * Constructs a reset URL using the provided token and sends an email with
 * a link to reset the password. Uses the configured transporter for sending emails.
 * 
 * @param {string} email - The email address to send the reset email to.
 * @param {string} token - The token to include in the reset URL.
 */
const sendResetEmail = (email, token) => {
  const hostUrl =
    process.env.NODE_ENV === "production"
      ? process.env.HOST_URL_PROD
      : process.env.HOST_URL_DEV;
  const resetUrl = `${hostUrl}/resetPassword?token=${token}`;

  let mailOptions = {
    from: process.env.EMAIL_RESET_USER,
    to: email,
    subject: "Password Reset",
    text: `You requested a password reset. Click the link to reset your password: ${resetUrl}`,
    html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
        <img src="https://your-logo-url.com/logo.png" alt="Golden Gaming" style="max-width: 200px;">
      </div>
      <div style="padding: 20px;">
        <h2 style="color: #2c3e50;">Password Reset Request</h2>
        <p>Hello,</p>
        <p>You requested a password reset for your Golden Gaming account. Click the link below to reset your password:</p>
        <p style="text-align: center;">
          <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #3498db; border-radius: 5px; text-decoration: none;">Reset Password</a>
        </p>
        <p>If you did not request a password reset, please ignore this email or contact our support if you have any concerns.</p>
        <p>Thank you,<br>Golden Gaming Team</p>
      </div>
      <div style="background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #777;">
        <p>&copy; ${new Date().getFullYear()} Golden Gaming. All rights reserved.</p>
        <p><a href="https://goldengaming.com/privacy-policy" style="color: #3498db; text-decoration: none;">Privacy Policy</a> | <a href="https://goldengaming.com/terms-of-service" style="color: #3498db; text-decoration: none;">Terms of Service</a></p>
      </div>
    </div>
  `,
  };

  // if we get an error, return the error. if we succeed, give the info messageId
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log("Error sending email:", error);
    }
    console.log("Message sent successfully:", info.messageId);
  });
};

/**
 * Handles password reset requests.
 * 
 * Generates a reset token, saves it for the user, and sends a reset email.
 * 
 * @param {Object} req - The request object, containing the email address in the body.
 * @param {Object} res - The response object.
 */
exports.requestPasswordReset = async (req, res) => {
  const email = req.body.email;

  const token = crypto.randomBytes(20).toString("hex");
  console.log("Generated token:", token);

  try {
    const newUser = await User.saveResetToken(email, token);
    console.log("New user:", newUser);

    sendResetEmail(email, token);
    res.send("Reset email sent successfully");
  } catch (err) {
    console.error("Reset email not sent:", err);
    res.status(500).send("Error saving reset token");
  }
};

/**
 * Resets the user's password using the provided token.
 * 
 * Finds the user by the token and updates their password.
 * 
 * @param {Object} req - The request object, containing the reset token and new password in the body.
 * @param {Object} res - The response object.
 */
exports.resetPassword = async (req, res) => {
  const token = req.body.token;
  const newPassword = req.body.password;

  try {
    await User.resetPassword(token, newPassword);
    res.send("Password reset worked!");
  } catch (err) {
    console.error("Error resetting password:", err);
    res.status(500).send("Error resetting password :(");
  }
};
