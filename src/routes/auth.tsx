import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  component: Auth,
  validateSearch: (s: Record<string, unknown>) => ({ redirect: (s.redirect as string) || "/" }),
});

function Auth() {
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { full_name: name },
          },
        });
        if (error) throw error;
        toast.success("Account created! Check your email to verify.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back");
        navigate({ to: redirect });
      }
    } catch (err: any) {
      toast.error(err.message ?? "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="glass-strong rounded-3xl p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full mx-auto mb-3" style={{ background: "var(--gradient-gold)" }} />
          <h1 className="font-display text-3xl text-gradient-gold">
            {mode === "signin" ? "Welcome back" : "Create account"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "signin" ? "Sign in to your Vins Watch account" : "Join the Vins Watch family"}
          </p>
        </div>
        <form onSubmit={submit} className="space-y-3">
          {mode === "signup" && (
            <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--color-gold)]" />
          )}
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--color-gold)]" />
          <input required type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--color-gold)]" />
          <button disabled={loading} className="w-full py-3 rounded-full btn-gold disabled:opacity-50">
            {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>
        <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="w-full mt-4 text-sm text-muted-foreground hover:text-[var(--color-gold-soft)]">
          {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
