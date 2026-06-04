import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useCart, f as formatLKR } from "./router-DU_JEXVw.mjs";
import "../_libs/sonner.mjs";
import { d as Minus, e as Plus, T as Trash2 } from "../_libs/lucide-react.mjs";
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
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "./client-DqJ_k-uM.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
function Cart() {
  const {
    items,
    setQty,
    remove,
    total
  } = useCart();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto px-4 sm:px-6 py-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-5xl mb-8", children: "Your cart" }),
    items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-12 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Your cart is empty." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/shop", className: "inline-block mt-5 px-6 py-2 rounded-full btn-gold text-sm", children: "Browse watches" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-[1fr_360px] gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: items.map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-4 flex gap-4 items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-xl overflow-hidden shrink-0", style: {
          background: "var(--gradient-bg)"
        }, children: i.image_url && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: i.image_url, alt: i.name, className: "w-full h-full object-cover" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wider text-[var(--color-gold-soft)]", children: i.brand }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-lg truncate", children: i.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gradient-gold", children: formatLKR(i.price) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-full flex items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setQty(i.id, i.quantity - 1), className: "p-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "w-3 h-3" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 text-center text-sm", children: i.quantity }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setQty(i.id, i.quantity + 1), className: "p-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => remove(i.id), className: "p-2 text-muted-foreground hover:text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" }) })
      ] }, i.id)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-strong rounded-2xl p-6 h-fit sticky top-24", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-2xl mb-4", children: "Summary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Subtotal" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatLKR(total) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Shipping" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: total >= 5e4 ? "Free" : "Calculated at checkout" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between font-display text-xl border-t border-[var(--color-border)] pt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient-gold", children: formatLKR(total) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/checkout", className: "block text-center mt-6 px-6 py-3 rounded-full btn-gold", children: "Checkout" })
      ] })
    ] })
  ] });
}
export {
  Cart as component
};
