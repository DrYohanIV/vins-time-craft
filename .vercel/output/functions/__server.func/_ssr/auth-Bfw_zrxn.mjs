import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { s as supabase } from "./client-DqJ_k-uM.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { R as Route$g } from "./router-DU_JEXVw.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/lucide-react.mjs";
function Auth() {
  const {
    redirect
  } = Route$g.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = reactExports.useState("signin");
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [name, setName] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const {
          error
        } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: name
            }
          }
        });
        if (error) throw error;
        toast.success("Account created! Check your email to verify.");
      } else {
        const {
          error
        } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        toast.success("Welcome back");
        navigate({
          to: redirect
        });
      }
    } catch (err) {
      toast.error(err.message ?? "Authentication failed");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-md mx-auto px-4 py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-strong rounded-3xl p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full mx-auto mb-3", style: {
        background: "var(--gradient-gold)"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl text-gradient-gold", children: mode === "signin" ? "Welcome back" : "Create account" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: mode === "signin" ? "Sign in to your Vins Watch account" : "Join the Vins Watch family" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-3", children: [
      mode === "signup" && /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, value: name, onChange: (e) => setName(e.target.value), placeholder: "Full name", className: "w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--color-gold)]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "Email", className: "w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--color-gold)]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, type: "password", minLength: 6, value: password, onChange: (e) => setPassword(e.target.value), placeholder: "Password", className: "w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--color-gold)]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: loading, className: "w-full py-3 rounded-full btn-gold disabled:opacity-50", children: loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setMode(mode === "signin" ? "signup" : "signin"), className: "w-full mt-4 text-sm text-muted-foreground hover:text-[var(--color-gold-soft)]", children: mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in" })
  ] }) });
}
export {
  Auth as component
};
