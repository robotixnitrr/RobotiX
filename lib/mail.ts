import { Resend } from "resend";

const {
  RESEND_API_KEY,
  NEXT_PUBLIC_APP_URL,
  RESET_TOKEN_EXPIRE_MINUTES,
  FROM_EMAIL,
} = process.env;

if (!RESEND_API_KEY || !FROM_EMAIL) {
  console.warn("⚠️ Resend not fully configured - reset emails may fail");
}

const resend = new Resend(RESEND_API_KEY);

export async function sendResetEmail(toEmail: string, rawToken: string) {
  const origin = NEXT_PUBLIC_APP_URL || "https://robotix-nitrr.vercel.app";
  const expiresMins = RESET_TOKEN_EXPIRE_MINUTES || 60;

  const resetUrl = `${origin}/forgot/reset?token=${encodeURIComponent(
    rawToken
  )}&email=${encodeURIComponent(toEmail)}`;

  const html = `
    <p>You requested a password reset for your RobotiX account.</p>
    <p><a href="${resetUrl}">Click here to reset your password</a></p>
    <p>This link expires in ${expiresMins} minutes.</p>
    <p>If you didn’t request this, ignore this email.</p>
  `;

  return resend.emails.send({
    from: FROM_EMAIL!,
    to: toEmail,
    subject: "Reset your RobotiX password",
    html,
    text: `Open this link to reset your password: ${resetUrl}`,
  });
}
