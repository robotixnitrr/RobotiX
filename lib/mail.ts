import { Resend } from "resend";
import nodemailer from "nodemailer";

const {
  RESEND_API_KEY,
  NEXT_PUBLIC_APP_URL,
  RESET_TOKEN_EXPIRE_MINUTES,
  FROM_EMAIL,
  // SMTP fallback vars:
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
} = process.env;

if (!RESEND_API_KEY) {
  console.warn("[lib/mail] RESEND_API_KEY not set — Resend will fail");
}
if (!FROM_EMAIL) {
  console.warn("[lib/mail] FROM_EMAIL not set — emails may be rejected");
}

const resend = new Resend(RESEND_API_KEY || "");

/**
 * Send reset email using Resend; fall back to SMTP if Resend refuses (unverified domain, testing mode, etc.)
 */
export async function sendResetEmail(toEmail: string, rawToken: string) {
  const origin = NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const expiresMins = RESET_TOKEN_EXPIRE_MINUTES || 60;
  const resetUrl = `${origin}/forgot/reset?token=${encodeURIComponent(rawToken)}&email=${encodeURIComponent(toEmail)}`;

  const html = `
    <div style="font-family: system-ui, Arial, sans-serif; line-height:1.4;">
      <p>You requested a password reset for your RobotiX account.</p>
      <p><a href="${resetUrl}">Click here to reset your password</a></p>
      <p>This link expires in ${expiresMins} minutes.</p>
      <p>If you didn’t request this, ignore this email.</p>
    </div>
  `;

  // Try Resend first
  try {
    console.log("[lib/mail] Attempting to send via Resend to:", toEmail);
    console.log("[lib/mail] From email:", FROM_EMAIL || "no-reply@example.com");
    console.log("[lib/mail] Resend API key present:", !!RESEND_API_KEY);
    
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const resp = await resend.emails.send({
      from: FROM_EMAIL || "onboarding@resend.dev",
      to: toEmail,
      subject: "Reset your RobotiX password",
      html,
      text: `Open this link to reset your password: ${resetUrl}`,
    });

    console.log("[lib/mail] Resend response:", JSON.stringify(resp, null, 2));
    
    // Check if response indicates an error
    if (resp && 'error' in resp) {
      throw new Error(`Resend API error: ${JSON.stringify(resp.error)}`);
    }
    
    if (!resp || !resp.id) {
      console.warn("[lib/mail] Resend response missing ID:", resp);
    }
    
    return resp;
  } catch (err: any) {
    const msg = err?.message || JSON.stringify(err);
    const errorDetails = {
      message: msg,
      statusCode: err?.statusCode,
      name: err?.name,
      response: err?.response,
    };
    console.error("[lib/mail] Resend failed with details:", JSON.stringify(errorDetails, null, 2));

    // Detect common Resend errors that should trigger SMTP fallback or better error messages
    const isResendDomainError =
      (err && err.statusCode === 403) ||
      (err && err.statusCode === 401) ||
      /verify a domain/i.test(msg) ||
      /only send testing emails/i.test(msg) ||
      /invalid_from/i.test(msg) ||
      /Unauthorized/i.test(msg) ||
      /invalid api key/i.test(msg) ||
      /api key/i.test(msg) ||
      /domain/i.test(msg);
    
    const isResendConfigError = 
      /RESEND_API_KEY/i.test(msg) ||
      /not configured/i.test(msg) ||
      /missing/i.test(msg);

    // If it's a configuration error, throw immediately with clear message
    if (isResendConfigError) {
      throw new Error(`Resend configuration error: ${msg}. Please set RESEND_API_KEY in your environment variables.`);
    }
    
    if (!isResendDomainError) {
      // If error is something else, rethrow so caller can handle/log accordingly
      throw err;
    }

    // If SMTP creds are present, try SMTP fallback
    if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
      try {
        console.log("[lib/mail] Falling back to SMTP transporter");
        const transporter = nodemailer.createTransport({
          host: SMTP_HOST,
          port: SMTP_PORT ? Number(SMTP_PORT) : 587,
          secure: SMTP_PORT ? Number(SMTP_PORT) === 465 : false,
          auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
          },
        });

        const mailResult = await transporter.sendMail({
          from: FROM_EMAIL || SMTP_USER,
          to: toEmail,
          subject: "Reset your RobotiX password",
          html,
          text: `Open this link to reset your password: ${resetUrl}`,
        });

        console.log("[lib/mail] SMTP fallback succeeded:", mailResult);
        return mailResult;
      } catch (smtpErr: any) {
        console.error("[lib/mail] SMTP fallback failed:", smtpErr?.message || smtpErr);
        // Re-throw combined error so API returns meaningful info during dev
        throw new Error(`Resend failed: ${msg}; SMTP fallback failed: ${smtpErr?.message || smtpErr}`);
      }
    }

    // No SMTP configured — surface helpful guidance
    throw new Error(
      `Resend rejected the send (testing/unverified domain). Either verify a sending domain in Resend or configure SMTP fallback. Resend error: ${msg}`
    );
  }
}
