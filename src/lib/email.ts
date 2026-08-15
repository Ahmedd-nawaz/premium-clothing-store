/**
 * Email Sending Service
 * Thin wrapper around Resend so auth.ts and other server code have one
 * place to call, instead of touching the Resend SDK directly everywhere.
 */

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_ADDRESS = process.env.RESEND_FROM_EMAIL || "Premium Clothing Store <onboarding@resend.dev>";

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailParams) {
  if (!process.env.RESEND_API_KEY) {
    // Fail loudly in dev instead of silently doing nothing, so a missing
    // .env value is obvious immediately rather than a mystery later.
    console.error(
      `[email] RESEND_API_KEY is not set — could not send "${subject}" to ${to}. Add RESEND_API_KEY to .env.`
    );
    return;
  }

  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject,
    html,
    text,
  });

  if (error) {
    console.error(`[email] Failed to send "${subject}" to ${to}:`, error);
  }
}

export function sendResetPasswordEmail(to: string, url: string) {
  return sendEmail({
    to,
    subject: "Reset your password",
    text: `Click the link to reset your password: ${url}\n\nIf you didn't request this, you can safely ignore this email.`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #111111;">Reset your password</h2>
        <p style="color: #6B7280; font-size: 14px;">
          We received a request to reset your password. Click the button below to choose a new one.
          This link expires in 1 hour.
        </p>
        <a href="${url}" style="display: inline-block; background: #111111; color: #ffffff; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: 500; margin: 16px 0;">
          Reset Password
        </a>
        <p style="color: #6B7280; font-size: 12px;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}

export function sendVerificationEmail(to: string, url: string) {
  return sendEmail({
    to,
    subject: "Verify your email address",
    text: `Click the link to verify your email: ${url}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #111111;">Verify your email address</h2>
        <p style="color: #6B7280; font-size: 14px;">
          Welcome! Please confirm your email address to finish setting up your account.
        </p>
        <a href="${url}" style="display: inline-block; background: #111111; color: #ffffff; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: 500; margin: 16px 0;">
          Verify Email
        </a>
      </div>
    `,
  });
}