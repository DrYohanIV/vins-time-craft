import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { s as supabase } from "./client-DqJ_k-uM.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { M as MapPin, P as Phone, C as Clock, c as Send } from "../_libs/lucide-react.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
function Contact() {
  const [form, setForm] = reactExports.useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    body: ""
  });
  const [sending, setSending] = reactExports.useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    const {
      error
    } = await supabase.from("messages").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      subject: form.subject.trim() || null,
      body: form.body.trim()
    });
    setSending(false);
    if (error) return toast.error("Couldn't send. Try again.");
    toast.success("Message sent! We'll be in touch.");
    setForm({
      name: "",
      email: "",
      phone: "",
      subject: "",
      body: ""
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto px-4 sm:px-6 py-16", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-[0.3em] text-[var(--color-gold-soft)]", children: "Get in touch" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-5xl mt-2", children: "Visit our store" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-3 max-w-xl mx-auto", children: "Experience the Vins Watch collection in person at our Negombo boutique." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-3 gap-5 mb-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { icon: MapPin, title: "Address", lines: ["43 Greens Rd", "Negombo, Sri Lanka"] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { icon: Phone, title: "Phone", lines: ["0312 230 598"] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { icon: Clock, title: "Hours", lines: ["Mon – Sat · 9:00 – 19:00", "Sunday · 10:00 – 17:00"] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "glass-strong rounded-3xl p-6 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl mb-2", children: "Send us a message" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Name", value: form.name, onChange: (v) => setForm({
            ...form,
            name: v
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Email", type: "email", value: form.email, onChange: (v) => setForm({
            ...form,
            email: v
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Phone", value: form.phone, onChange: (v) => setForm({
            ...form,
            phone: v
          }), required: false }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Subject", value: form.subject, onChange: (v) => setForm({
            ...form,
            subject: v
          }), required: false })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Message", multiline: true, value: form.body, onChange: (v) => setForm({
          ...form,
          body: v
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { disabled: sending, className: "w-full py-3 rounded-full btn-gold inline-flex items-center justify-center gap-2 disabled:opacity-50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-4 h-4" }),
          " ",
          sending ? "Sending…" : "Send message"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass-strong rounded-3xl overflow-hidden min-h-[400px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("iframe", { title: "Vins Watch — Negombo", src: "https://www.google.com/maps?q=43+Greens+Rd+Negombo&output=embed", className: "w-full h-full border-0 min-h-[400px]", loading: "lazy" }) })
    ] })
  ] });
}
function Info({
  icon: Icon,
  title,
  lines
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-6 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-6 h-6 mx-auto text-[var(--color-gold)]" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-xl mt-3", children: title }),
    lines.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: l }, l))
  ] });
}
function F({
  label,
  value,
  onChange,
  type = "text",
  multiline,
  required = true
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: label }),
    multiline ? /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { required, value, onChange: (e) => onChange(e.target.value), rows: 4, className: "mt-1 w-full glass rounded-xl px-3 py-2 text-sm outline-none focus:border-[var(--color-gold)]" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type, required, value, onChange: (e) => onChange(e.target.value), className: "mt-1 w-full glass rounded-xl px-3 py-2 text-sm outline-none focus:border-[var(--color-gold)]" })
  ] });
}
export {
  Contact as component
};
