import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-BTzMKr_B.mjs";
import { f as formatLKR } from "./router-BI-Nvu9e.mjs";
import { t as toast } from "../_libs/sonner.mjs";
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
const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
function AdminOrders() {
  const qc = useQueryClient();
  const {
    data: orders
  } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => (await supabase.from("orders").select("*, order_items(*)").order("created_at", {
      ascending: false
    })).data ?? []
  });
  const setStatus = async (id, status) => {
    const {
      error
    } = await supabase.from("orders").update({
      status
    }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Status updated");
    qc.invalidateQueries({
      queryKey: ["admin-orders"]
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl mb-4", children: "Orders" }),
    !orders?.length ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-2xl p-12 text-center text-muted-foreground", children: "No orders yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: orders.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap justify-between gap-3 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
            "Order #",
            o.id.slice(0, 8),
            " · ",
            new Date(o.created_at).toLocaleString()
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-lg", children: o.customer_name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
            o.customer_phone,
            " · ",
            o.customer_address
          ] }),
          o.notes && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mt-1 italic", children: [
            "Note: ",
            o.notes
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-gradient-gold font-semibold text-lg", children: formatLKR(Number(o.total)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground uppercase tracking-wider mt-1", children: o.payment_method === "cod" ? "Cash on delivery" : "Online payment" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: o.status, onChange: (e) => setStatus(o.id, e.target.value), className: "mt-2 glass rounded-full px-3 py-1.5 text-xs outline-none", children: STATUSES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s, className: "bg-[var(--background)]", children: s }, s)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm border-t border-[var(--color-border)] pt-3 space-y-1", children: o.order_items?.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          it.watch_name,
          " × ",
          it.quantity
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: formatLKR(Number(it.unit_price) * it.quantity) })
      ] }, it.id)) })
    ] }, o.id)) })
  ] });
}
export {
  AdminOrders as component
};
