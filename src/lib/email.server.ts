import { createHash, randomBytes } from "node:crypto";
import { Resend } from "resend";

let _resend: Resend | undefined;

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("Email service is not configured: missing RESEND_API_KEY");
  }
  if (!_resend) _resend = new Resend(apiKey);
  return _resend;
}

export function generateVerificationToken() {
  const token = randomBytes(32).toString("base64url");
  return { token, tokenHash: hashToken(token) };
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

type SendVerificationEmailInput = {
  to: string;
  name?: string | null;
  url: string;
};

export async function sendVerificationEmail({ to, name, url }: SendVerificationEmailInput) {
  const from = process.env.RESEND_FROM_EMAIL;
  if (!from) {
    throw new Error("Email service is not configured: missing RESEND_FROM_EMAIL");
  }

  const greeting = name?.trim() ? `Hi ${name.trim()},` : "Hi,";

  const { error } = await getResend().emails.send({
    from,
    to,
    replyTo: process.env.RESEND_REPLY_TO || undefined,
    subject: "Verify your Vins Watch email address",
    html: `
      <div style="font-family: Arial, Helvetica, sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
        <h1 style="font-size: 22px; color: #b8860b;">Welcome to Vins Watch</h1>
        <p>${greeting}</p>
        <p>Thanks for creating an account. Please confirm your email address to activate it.</p>
        <p style="margin: 28px 0;">
          <a href="${url}" style="background: #b8860b; color: #ffffff; padding: 12px 24px; border-radius: 9999px; text-decoration: none; font-weight: bold;">
            Verify my email
          </a>
        </p>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #555555;">${url}</p>
        <p style="color: #888888; font-size: 12px; margin-top: 28px;">
          This link expires in 24 hours. If you did not create an account, you can safely ignore this email.
        </p>
      </div>
    `,
  });

  if (error) {
    throw new Error(error.message || "Failed to send verification email");
  }
}
