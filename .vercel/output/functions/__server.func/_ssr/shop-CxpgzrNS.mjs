import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-BTzMKr_B.mjs";
import { W as WatchCard } from "./watch-card-DHZ9fqQB.mjs";
import "../_libs/sonner.mjs";
import { b as Search, X } from "../_libs/lucide-react.mjs";
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
import "./router-BI-Nvu9e.mjs";
function Shop() {
  const [q, setQ] = reactExports.useState("");
  const [brandFilter, setBrandFilter] = reactExports.useState(null);
  const {
    data: watches,
    isLoading
  } = useQuery({
    queryKey: ["watches"],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("watches").select("*").order("created_at", {
        ascending: false
      });
      return data ?? [];
    }
  });
  const brands = reactExports.useMemo(() => {
    const set = new Set((watches ?? []).map((w) => w.brand));
    return Array.from(set).sort();
  }, [watches]);
  const filtered = reactExports.useMemo(() => {
    let result = watches ?? [];
    const s = q.toLowerCase().trim();
    if (s) {
      result = result.filter((w) => w.name.toLowerCase().includes(s) || w.brand.toLowerCase().includes(s));
    }
    if (brandFilter) {
      result = result.filter((w) => w.brand === brandFilter);
    }
    return result;
  }, [q, brandFilter, watches]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 py-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-[0.3em] text-[var(--color-gold-soft)]", children: "Collection" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-5xl mt-1", children: "All watches" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full sm:w-72", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Search brand or name…", className: "w-full glass rounded-full pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[var(--color-gold)]" })
      ] })
    ] }),
    brands.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setBrandFilter(null), className: `px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${brandFilter === null ? "bg-[var(--color-gold)] text-[var(--color-espresso)]" : "glass text-muted-foreground hover:text-foreground"}`, children: "All" }),
      brands.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setBrandFilter(b), className: `px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${brandFilter === b ? "bg-[var(--color-gold)] text-[var(--color-espresso)]" : "glass text-muted-foreground hover:text-foreground"}`, children: b }, b)),
      brandFilter && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setBrandFilter(null), className: "ml-1 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3" }),
        "Clear"
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center text-muted-foreground py-20", children: "Loading…" }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-2xl p-12 text-center text-muted-foreground", children: q || brandFilter ? "No watches match your filters." : "No watches available yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5", children: filtered.map((w) => /* @__PURE__ */ jsxRuntimeExports.jsx(WatchCard, { ...w, price: Number(w.price) }, w.id)) })
  ] });
}
export {
  Shop as component
};
