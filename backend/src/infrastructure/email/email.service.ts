import { Logger } from "../logger/logger.js";

export const sendVerificationEmail = async (
  email: string,
  name: string,
  token: string
): Promise<void> => {
  const siteUrl = process.env.SITE_URL || "http://localhost:3000";
  const verificationLink = `${siteUrl}/verify-email?token=${token}`;

  // Log a beautiful terminal representation of the email
  Logger.info(`
  -------------------------------------------------------------
  ✉️  Verification Email Sent to: ${email}
  -------------------------------------------------------------
  Hello ${name},

  Thank you for registering at DevCircle.
  Please verify your email address by clicking the link below:

  🔗 ${verificationLink}

  This link will expire in 24 hours.
  -------------------------------------------------------------
  `);
};
