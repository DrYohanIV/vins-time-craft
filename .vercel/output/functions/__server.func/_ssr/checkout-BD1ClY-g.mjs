import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useCart, a as useAuth, f as formatLKR } from "./router-BI-Nvu9e.mjs";
import { s as supabase } from "./client-BTzMKr_B.mjs";
import { a as createServerFn, T as TSS_SERVER_FUNCTION, g as getServerFnById } from "./server-PJXmVvWh.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-BQmb0N24.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { o as objectType, a as arrayType, n as numberType, s as stringType, e as enumType } from "../_libs/zod.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/lucide-react.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const PlaceOrderSchema = objectType({
  customer_name: stringType().trim().min(1).max(200),
  customer_phone: stringType().trim().min(3).max(50),
  customer_address: stringType().trim().min(3).max(2e3),
  notes: stringType().max(2e3).optional().nullable(),
  payment_method: enumType(["cod", "online"]),
  items: arrayType(objectType({
    watch_id: stringType().uuid(),
    quantity: numberType().int().min(1).max(100)
  })).min(1).max(50)
});
const placeOrder = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => PlaceOrderSchema.parse(data)).handler(createSsrRpc("a6485a0caa6c7276b8f38fd2e39c7cd965ae3addca5ff318987f97661206380a"));
function Checkout() {
  const {
    items,
    total,
    clear
  } = useCart();
  const {
    user,
    loading
  } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = reactExports.useState({
    name: "",
    phone: "",
    address: "",
    notes: ""
  });
  const [payment, setPayment] = reactExports.useState("cod");
  const [submitting, setSubmitting] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle().then(({
      data
    }) => {
      if (data) setForm((f) => ({
        ...f,
        name: data.full_name ?? f.name,
        phone: data.phone ?? f.phone,
        address: data.address ?? f.address
      }));
    });
  }, [user]);
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-20 text-muted-foreground", children: "Loading…" });
  if (!user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md mx-auto py-20 px-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl mb-3", children: "Sign in to continue" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6", children: "Please sign in to place an order." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth", search: {
        redirect: "/checkout"
      }, className: "px-6 py-3 rounded-full btn-gold", children: "Sign in" })
    ] });
  }
  if (items.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md mx-auto py-20 px-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl mb-3", children: "Your cart is empty" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/shop", className: "px-6 py-3 rounded-full btn-gold", children: "Browse watches" })
    ] });
  }
  const placeOrder$1 = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) {
      toast.error("Please fill all required fields");
      return;
    }
    setSubmitting(true);
    try {
      await placeOrder({
        data: {
          customer_name: form.name,
          customer_phone: form.phone,
          customer_address: form.address,
          notes: form.notes || null,
          payment_method: payment,
          items: items.map((i) => ({
            watch_id: i.id,
            quantity: i.quantity
          }))
        }
      });
      await supabase.from("profiles").update({
        full_name: form.name,
        phone: form.phone,
        address: form.address
      }).eq("id", user.id);
      clear();
      toast.success("Order placed! We'll be in touch.");
      navigate({
        to: "/account"
      });
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Couldn't place order. Try again.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto px-4 sm:px-6 py-12 grid lg:grid-cols-[1fr_360px] gap-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: placeOrder$1, className: "glass-strong rounded-2xl p-6 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl mb-2", children: "Checkout" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Full name", value: form.name, onChange: (v) => setForm({
        ...form,
        name: v
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Phone", value: form.phone, onChange: (v) => setForm({
        ...form,
        phone: v
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Delivery address", value: form.address, onChange: (v) => setForm({
        ...form,
        address: v
      }), multiline: true }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Order notes (optional)", value: form.notes, onChange: (v) => setForm({
        ...form,
        notes: v
      }), required: false, multiline: true }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm mb-2 text-muted-foreground", children: "Payment method" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: ["cod", "online"].map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setPayment(p), className: `p-4 rounded-xl text-sm text-left transition-all ${payment === p ? "btn-gold" : "btn-glass"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: p === "cod" ? "Cash on Delivery" : "Online Payment" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs opacity-80 mt-0.5", children: p === "cod" ? "Pay when your watch arrives" : "Bank transfer — we'll send details" })
        ] }, p)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: submitting, className: "w-full mt-4 py-3 rounded-full btn-gold disabled:opacity-50", children: submitting ? "Placing order…" : `Place order · ${formatLKR(total)}` })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-6 h-fit", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl mb-4", children: "Order summary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: items.map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
          i.name,
          " × ",
          i.quantity
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatLKR(i.price * i.quantity) })
      ] }, i.id)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-[var(--color-border)] mt-4 pt-4 flex justify-between font-display text-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient-gold", children: formatLKR(total) })
      ] })
    ] })
  ] });
}
function Field({
  label,
  value,
  onChange,
  multiline,
  required = true
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: [
      label,
      required && " *"
    ] }),
    multiline ? /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { required, value, onChange: (e) => onChange(e.target.value), rows: 3, className: "mt-1 w-full glass rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--color-gold)]" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required, value, onChange: (e) => onChange(e.target.value), className: "mt-1 w-full glass rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--color-gold)]" })
  ] });
}
export {
  Checkout as component
};
