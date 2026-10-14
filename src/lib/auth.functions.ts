import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { generateVerificationToken, hashToken, sendVerificationEmail } from "./email.server";

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

const SignUpSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(6).max(200),
  fullName: z.string().trim().min(1).max(200),
});

const VerifySchema = z.object({
  token: z.string().trim().min(10).max(500),
});

const ResendSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
});

function getAppUrl() {
  const configured = process.env.APP_URL || process.env.VITE_APP_URL;
  if (configured) return configured.replace(/\/+$/, "");
  try {
    const url = new URL(getRequest().url);
    return `${url.protocol}//${url.host}`;
  } catch {
    return "";
  }
}

async function issueVerification(userId: string, email: string, name?: string | null) {
  const { token, tokenHash } = generateVerificationToken();
  const { error } = await supabaseAdmin.from("email_verification_tokens").insert({
    user_id: userId,
    email,
    token_hash: tokenHash,
    expires_at: new Date(Date.now() + TOKEN_TTL_MS).toISOString(),
  });
  if (error) throw new Error(error.message);

  const baseUrl = getAppUrl();
  if (!baseUrl) {
    throw new Error(
      "Email service is not configured: set APP_URL (or call the API via the site URL).",
    );
  }
  const url = `${baseUrl}/verify?token=${encodeURIComponent(token)}`;
  await sendVerificationEmail({ to: email, name, url });
}

export const signUpWithEmail = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => SignUpSchema.parse(data))
  .handler(async ({ data }) => {
    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: false,
      user_metadata: { full_name: data.fullName },
    });

    if (error || !created?.user) {
      const message = error?.message ?? "Could not create account";
      if (/already|registered|exists/i.test(message)) {
        throw new Error(
          "An account with this email already exists. Sign in or request a new verification email.",
        );
      }
      throw new Error(message);
    }

    await issueVerification(created.user.id, data.email, data.fullName);
    return { ok: true };
  });

export const verifyEmailToken = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => VerifySchema.parse(data))
  .handler(async ({ data }) => {
    const tokenHash = hashToken(data.token);
    const { data: row, error } = await supabaseAdmin
      .from("email_verification_tokens")
      .select("id, user_id, email, expires_at, used_at")
      .eq("token_hash", tokenHash)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) throw new Error("This verification link is invalid or has already been used.");
    if (row.used_at) return { ok: true, email: row.email };
    if (new Date(row.expires_at).getTime() < Date.now()) {
      throw new Error("This verification link has expired. Please request a new one.");
    }

    const { error: confirmError } = await supabaseAdmin.auth.admin.updateUserById(row.user_id, {
      email_confirm: true,
    });
    if (confirmError) throw new Error(confirmError.message);

    await supabaseAdmin
      .from("email_verification_tokens")
      .update({ used_at: new Date().toISOString() })
      .eq("id", row.id);

    return { ok: true, email: row.email };
  });

export const resendVerificationEmail = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => ResendSchema.parse(data))
  .handler(async ({ data }) => {
    const { data: latest } = await supabaseAdmin
      .from("email_verification_tokens")
      .select("user_id")
      .eq("email", data.email)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!latest?.user_id) {
      return { ok: true };
    }

    const { data: userRes } = await supabaseAdmin.auth.admin.getUserById(latest.user_id);
    if (!userRes?.user || userRes.user.email_confirmed_at) {
      return { ok: true };
    }

    await issueVerification(
      latest.user_id,
      data.email,
      (userRes.user.user_metadata?.full_name as string | undefined) ?? null,
    );
    return { ok: true };
  });
