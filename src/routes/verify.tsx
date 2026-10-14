import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { verifyEmailToken } from "@/lib/auth.functions";

export const Route = createFileRoute("/verify")({
  component: Verify,
  validateSearch: (s: Record<string, unknown>) => ({ token: (s.token as string) || "" }),
  head: () => ({
    meta: [{ title: "Verify email — Vins Watch" }],
  }),
});

type Status = "loading" | "success" | "error";

function Verify() {
  const { token } = Route.useSearch();
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("Verifying your email address…");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("This verification link is missing its token.");
      return;
    }
    let active = true;
    verifyEmailToken({ data: { token } })
      .then(() => {
        if (!active) return;
        setStatus("success");
        setMessage("Your email address has been verified. You can now sign in.");
      })
      .catch((err: unknown) => {
        if (!active) return;
        setStatus("error");
        setMessage(err instanceof Error ? err.message : "Verification failed.");
      });
    return () => {
      active = false;
    };
  }, [token]);

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="glass-strong rounded-3xl p-8 text-center">
        {status === "loading" && (
          <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-[var(--color-gold)]" />
        )}
        {status === "success" && <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-green-500" />}
        {status === "error" && <XCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />}
        <h1 className="font-display text-3xl text-gradient-gold mb-2">
          {status === "success"
            ? "Email verified"
            : status === "error"
              ? "Verification failed"
              : "Verifying…"}
        </h1>
        <p className="text-sm text-muted-foreground">{message}</p>
        <Link
          to="/auth"
          search={{ redirect: "/" }}
          className="inline-block mt-6 px-6 py-3 rounded-full btn-gold"
        >
          Go to sign in
        </Link>
      </div>
    </div>
  );
}
