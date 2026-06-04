import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-DqJ_k-uM.mjs";
import { f as formatLKR } from "./router-DU_JEXVw.mjs";
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
function AdminHome() {
  const {
    data
  } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [watches, orders] = await Promise.all([supabase.from("watches").select("id, stock"), supabase.from("orders").select("id, total, status, created_at")]);
      const revenue = (orders.data ?? []).filter((o) => o.status !== "cancelled").reduce((s, o) => s + Number(o.total), 0);
      const pending = (orders.data ?? []).filter((o) => o.status === "pending").length;
      const lowStock = (watches.data ?? []).filter((w) => w.stock <= 3).length;
      return {
        watchCount: watches.data?.length ?? 0,
        totalStock: (watches.data ?? []).reduce((s, w) => s + w.stock, 0),
        orderCount: orders.data?.length ?? 0,
        revenue,
        pending,
        lowStock
      };
    }
  });
  const stats = [{
    label: "Watches",
    value: data?.watchCount ?? 0
  }, {
    label: "Total stock",
    value: data?.totalStock ?? 0
  }, {
    label: "Low stock",
    value: data?.lowStock ?? 0,
    warn: (data?.lowStock ?? 0) > 0
  }, {
    label: "Orders",
    value: data?.orderCount ?? 0
  }, {
    label: "Pending",
    value: data?.pending ?? 0
  }, {
    label: "Revenue",
    value: formatLKR(data?.revenue ?? 0)
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-6 gap-4", children: stats.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `glass rounded-2xl p-5 ${s.warn ? "border border-amber-500/40" : ""}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: s.label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `font-display text-3xl mt-1 ${s.warn ? "text-amber-300" : "text-gradient-gold"}`, children: s.value })
  ] }, s.label)) });
}
export {
  AdminHome as component
};
