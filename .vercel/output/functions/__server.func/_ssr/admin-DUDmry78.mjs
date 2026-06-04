import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useRouterState, L as Link, O as Outlet } from "../_libs/tanstack__react-router.mjs";
import { a as useAuth } from "./router-DU_JEXVw.mjs";
import { s as supabase } from "./client-DqJ_k-uM.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { m as LayoutDashboard, n as Package, a as ShoppingBag, o as MessageSquare, p as Megaphone, q as Tag, I as Image, G as Grid3x3, r as Layers } from "../_libs/lucide-react.mjs";
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
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
function AdminLayout() {
  const {
    isAdmin,
    loading,
    refreshRole
  } = useAuth();
  const [claiming, setClaiming] = reactExports.useState(false);
  const pathname = useRouterState({
    select: (r) => r.location.pathname
  });
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-20 text-muted-foreground", children: "Loading…" });
  if (!isAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-md mx-auto py-20 px-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-strong rounded-3xl p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl text-gradient-gold mb-2", children: "Admin access" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-6", children: "You are not an admin yet. If no admin has been set up for this store, you can claim the admin role with the button below — this works only once." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: claiming, onClick: async () => {
        setClaiming(true);
        const {
          data,
          error
        } = await supabase.rpc("claim_admin");
        if (error || !data) toast.error("Admin already claimed by another account.");
        else {
          toast.success("You are now the admin!");
          await refreshRole();
        }
        setClaiming(false);
      }, className: "px-6 py-3 rounded-full btn-gold disabled:opacity-50", children: claiming ? "Claiming…" : "Claim admin role" })
    ] }) });
  }
  const tabs = [{
    to: "/admin",
    label: "Overview",
    icon: LayoutDashboard
  }, {
    to: "/admin/watches",
    label: "Watches",
    icon: Package
  }, {
    to: "/admin/orders",
    label: "Orders",
    icon: ShoppingBag
  }, {
    to: "/admin/messages",
    label: "Messages",
    icon: MessageSquare
  }, {
    to: "/admin/promotions",
    label: "Promotions",
    icon: Megaphone
  }, {
    to: "/admin/discounts",
    label: "Discounts",
    icon: Tag
  }, {
    to: "/admin/banners",
    label: "Banners",
    icon: Image
  }, {
    to: "/admin/brands",
    label: "Brands",
    icon: Grid3x3
  }, {
    to: "/admin/collections",
    label: "Collections",
    icon: Layers
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 py-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-[0.3em] text-[var(--color-gold-soft)]", children: "Admin" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl mt-1", children: "Vins Watch Console" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-2xl p-1.5 inline-flex gap-1 mb-6 flex-wrap", children: tabs.map((t) => {
      const active = pathname === t.to;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: t.to, className: `px-4 py-2 rounded-xl text-sm inline-flex items-center gap-2 transition-all ${active ? "btn-gold" : "hover:bg-white/5"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(t.icon, { className: "w-4 h-4" }),
        " ",
        t.label
      ] }, t.to);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {})
  ] });
}
export {
  AdminLayout as component
};
