import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-DqJ_k-uM.mjs";
import { a as useAuth, f as formatLKR } from "./router-DU_JEXVw.mjs";
import "../_libs/sonner.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/tanstack__react-router.mjs";
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
import "../_libs/lucide-react.mjs";
const STATUS_COLORS = {
  pending: "text-amber-300",
  confirmed: "text-blue-300",
  shipped: "text-purple-300",
  delivered: "text-emerald-300",
  cancelled: "text-rose-300"
};
function Account() {
  const {
    user
  } = useAuth();
  const {
    data: orders
  } = useQuery({
    queryKey: ["my-orders", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const {
        data
      } = await supabase.from("orders").select("*, order_items(*)").eq("user_id", user.id).order("created_at", {
        ascending: false
      });
      return data ?? [];
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto px-4 sm:px-6 py-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-[0.3em] text-[var(--color-gold-soft)]", children: "My account" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl mt-1", children: "Orders" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: user?.email })
    ] }),
    !orders?.length ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-2xl p-12 text-center text-muted-foreground", children: "No orders yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: orders.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap justify-between gap-2 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
            "Order #",
            o.id.slice(0, 8)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm", children: new Date(o.created_at).toLocaleString() })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-sm uppercase tracking-wider ${STATUS_COLORS[o.status] ?? ""}`, children: o.status }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gradient-gold font-semibold", children: formatLKR(Number(o.total)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground border-t border-[var(--color-border)] pt-3 space-y-1", children: o.order_items?.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          it.watch_name,
          " × ",
          it.quantity
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatLKR(Number(it.unit_price) * it.quantity) })
      ] }, it.id)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mt-3", children: [
        o.payment_method === "cod" ? "Cash on Delivery" : "Online Payment",
        " · ",
        o.customer_address
      ] })
    ] }, o.id)) })
  ] });
}
export {
  Account as component
};
