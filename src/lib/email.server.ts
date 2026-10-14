import { createHash, randomBytes } from "node:crypto";
import { getRequest } from "@tanstack/react-start/server";
import { Resend } from "resend";
import {
  BANK_DETAILS,
  BANK_TRANSFER_NOTE,
  STORE_ADDRESS,
  deliveryLabel,
  type DeliveryMethod,
} from "./store-config";

let _resend: Resend | undefined;

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("Email service is not configured: missing RESEND_API_KEY");
  }
  if (!_resend) _resend = new Resend(apiKey);
  return _resend;
}

function getFromAddress() {
  const from = process.env.RESEND_FROM_EMAIL;
  if (!from) {
    throw new Error("Email service is not configured: missing RESEND_FROM_EMAIL");
  }
  return from;
}

export function getAppUrl() {
  const configured = process.env.APP_URL || process.env.VITE_APP_URL;
  if (configured) return configured.replace(/\/+$/, "");
  try {
    const url = new URL(getRequest().url);
    return `${url.protocol}//${url.host}`;
  } catch {
    return "";
  }
}

export function generateVerificationToken() {
  const token = randomBytes(32).toString("base64url");
  return { token, tokenHash: hashToken(token) };
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
};

export async function sendEmail({ to, subject, html, replyTo }: SendEmailInput) {
  const { error } = await getResend().emails.send({
    from: getFromAddress(),
    to,
    subject,
    html,
    replyTo: replyTo || process.env.RESEND_REPLY_TO || undefined,
  });
  if (error) {
    throw new Error(error.message || "Failed to send email");
  }
}

const lkr = (n: number) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(n);

export const shortOrderId = (id: string) => id.slice(0, 8).toUpperCase();

function emailShell(title: string, body: string) {
  return `
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
      <div style="border-bottom: 3px solid #b8860b; padding-bottom: 12px; margin-bottom: 20px;">
        <h1 style="font-size: 20px; color: #b8860b; margin: 0;">Vins Watch</h1>
      </div>
      <h2 style="font-size: 18px; margin-top: 0;">${title}</h2>
      ${body}
      <p style="color: #888888; font-size: 12px; margin-top: 28px;">
        Vins Watch · ${STORE_ADDRESS}
      </p>
    </div>
  `;
}

export type OrderEmailData = {
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  customerAddress: string;
  deliveryMethod: DeliveryMethod;
  paymentMethod: string;
  items: { name: string; quantity: number; unitPrice: number }[];
  subtotal: number;
  shippingFee: number;
  total: number;
  notes?: string | null;
};

function itemsTable(data: OrderEmailData) {
  const rows = data.items
    .map(
      (it) => `
      <tr>
        <td style="padding: 6px 0; border-bottom: 1px solid #eee;">${it.name} × ${it.quantity}</td>
        <td style="padding: 6px 0; border-bottom: 1px solid #eee; text-align: right;">${lkr(it.unitPrice * it.quantity)}</td>
      </tr>`,
    )
    .join("");
  return `
    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
      ${rows}
      <tr>
        <td style="padding: 8px 0;">Subtotal</td>
        <td style="padding: 8px 0; text-align: right;">${lkr(data.subtotal)}</td>
      </tr>
      <tr>
        <td style="padding: 2px 0;">${deliveryLabel(data.deliveryMethod)}</td>
        <td style="padding: 2px 0; text-align: right;">${data.shippingFee > 0 ? lkr(data.shippingFee) : "FREE"}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; font-weight: bold; border-top: 2px solid #b8860b;">Total</td>
        <td style="padding: 10px 0; font-weight: bold; text-align: right; border-top: 2px solid #b8860b;">${lkr(data.total)}</td>
      </tr>
    </table>
  `;
}

function bankBlock() {
  return `
    <div style="background: #faf6ee; border: 1px solid #e7d9b5; border-radius: 10px; padding: 14px 16px; margin: 16px 0;">
      <div style="font-weight: bold; margin-bottom: 6px;">Bank transfer / deposit</div>
      <div style="font-size: 14px; line-height: 1.6;">
        Account name: <strong>${BANK_DETAILS.accountName}</strong><br/>
        Account number: <strong>${BANK_DETAILS.accountNumber}</strong><br/>
        Bank: ${BANK_DETAILS.bank}<br/>
        Branch: ${BANK_DETAILS.branch}
      </div>
      <p style="font-size: 12px; color: #777; margin: 10px 0 0;">${BANK_TRANSFER_NOTE}</p>
    </div>
  `;
}

const deliveryBlock = (data: OrderEmailData) =>
  `<p style="font-size: 14px;"><strong>${deliveryLabel(data.deliveryMethod)}:</strong> ${
    data.deliveryMethod === "store_pickup" ? STORE_ADDRESS : data.customerAddress
  }</p>`;

export async function sendOrderAdminEmail(to: string, data: OrderEmailData) {
  const appUrl = getAppUrl();
  const body = `
    <p style="font-size: 14px;">A new order has been placed.</p>
    <p style="font-size: 14px;">
      <strong>Order:</strong> #${shortOrderId(data.orderId)}<br/>
      <strong>Customer:</strong> ${data.customerName} · ${data.customerPhone}<br/>
      ${data.customerEmail ? `<strong>Email:</strong> ${data.customerEmail}<br/>` : ""}
      <strong>Payment:</strong> Bank transfer / deposit
    </p>
    ${deliveryBlock(data)}
    ${data.notes ? `<p style="font-size: 14px;"><strong>Notes:</strong> ${data.notes}</p>` : ""}
    ${itemsTable(data)}
    <p style="margin-top: 18px;">
      <a href="${appUrl}/admin/orders" style="background: #b8860b; color: #ffffff; padding: 11px 22px; border-radius: 9999px; text-decoration: none; font-weight: bold;">
        View order in admin
      </a>
    </p>
  `;
  await sendEmail({
    to,
    subject: `New order #${shortOrderId(data.orderId)} — ${data.customerName}`,
    html: emailShell("New order received", body),
    replyTo: data.customerEmail || undefined,
  });
}

export async function sendOrderCustomerEmail(to: string, data: OrderEmailData) {
  const appUrl = getAppUrl();
  const body = `
    <p style="font-size: 14px;">Hi ${data.customerName},</p>
    <p style="font-size: 14px;">
      Thank you for your order! Your order <strong>#${shortOrderId(data.orderId)}</strong> has been placed and is
      currently <strong>pending</strong>. We will confirm it once your transfer/deposit is received.
    </p>
    ${deliveryBlock(data)}
    <p style="font-size: 14px;"><strong>Payment method:</strong> Bank transfer / deposit</p>
    ${bankBlock()}
    ${itemsTable(data)}
    <p style="margin-top: 18px;">
      <a href="${appUrl}/account" style="background: #b8860b; color: #ffffff; padding: 11px 22px; border-radius: 9999px; text-decoration: none; font-weight: bold;">
        Track my order
      </a>
    </p>
    <p style="font-size: 13px; color: #777;">
      Please send your bank transfer/deposit details via WhatsApp or email so we can process your order quickly.
    </p>
  `;
  await sendEmail({
    to,
    subject: `Order #${shortOrderId(data.orderId)} confirmed — Vins Watch`,
    html: emailShell(`Order #${shortOrderId(data.orderId)} placed`, body),
  });
}

type SendVerificationEmailInput = {
  to: string;
  name?: string | null;
  url: string;
};

export async function sendVerificationEmail({ to, name, url }: SendVerificationEmailInput) {
  const greeting = name?.trim() ? `Hi ${name.trim()},` : "Hi,";
  await sendEmail({
    to,
    subject: "Verify your Vins Watch email address",
    html: emailShell(
      "Welcome to Vins Watch",
      `
        <p style="font-size: 14px;">${greeting}</p>
        <p style="font-size: 14px;">Thanks for creating an account. Please confirm your email address to activate it.</p>
        <p style="margin: 28px 0;">
          <a href="${url}" style="background: #b8860b; color: #ffffff; padding: 12px 24px; border-radius: 9999px; text-decoration: none; font-weight: bold;">
            Verify my email
          </a>
        </p>
        <p style="font-size: 14px;">Or copy and paste this link into your browser:</p>
        <p style="font-size: 12px; word-break: break-all; color: #555555;">${url}</p>
        <p style="color: #888888; font-size: 12px; margin-top: 28px;">
          This link expires in 24 hours. If you did not create an account, you can safely ignore this email.
        </p>
      `,
    ),
  });
}
