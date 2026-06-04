import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-BTzMKr_B.mjs";
import { b as Route$c, u as useCart, f as formatLKR } from "./router-BI-Nvu9e.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { d as Minus, e as Plus, a as ShoppingBag } from "../_libs/lucide-react.mjs";
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
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
function WatchDetail() {
  const {
    id
  } = Route$c.useParams();
  const navigate = useNavigate();
  const {
    add
  } = useCart();
  const [qty, setQty] = reactExports.useState(1);
  const [activeImg, setActiveImg] = reactExports.useState(0);
  const {
    data: watch,
    isLoading
  } = useQuery({
    queryKey: ["watch", id],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("watches").select("*").eq("id", id).single();
      return data;
    }
  });
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-20 text-muted-foreground", children: "Loading…" });
  if (!watch) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-20 text-muted-foreground", children: "Watch not found." });
  const inStock = watch.stock > 0;
  const gallery = [watch.image_url, ...watch.images ?? []].filter(Boolean);
  const active = gallery[Math.min(activeImg, Math.max(0, gallery.length - 1))];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto px-4 sm:px-6 py-12 grid md:grid-cols-2 gap-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass-strong rounded-3xl overflow-hidden aspect-square", children: active ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: active, alt: watch.name, className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-48 h-48 rounded-full", style: {
        background: "var(--gradient-gold)",
        opacity: 0.4
      } }) }) }),
      gallery.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 grid grid-cols-5 gap-2", children: gallery.map((url, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setActiveImg(i), className: `aspect-square rounded-xl overflow-hidden glass transition ${i === activeImg ? "ring-2 ring-[var(--color-gold)]" : "opacity-70 hover:opacity-100"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: url, alt: "", className: "w-full h-full object-cover" }) }, url + i)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-[0.3em] text-[var(--color-gold-soft)]", children: watch.brand }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-5xl mt-2", children: watch.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 text-3xl text-gradient-gold font-semibold", children: formatLKR(Number(watch.price)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-muted-foreground leading-relaxed", children: watch.description || "A timeless piece from our curated Vins Watch collection." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-full flex items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setQty((q) => Math.max(1, q - 1)), className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "w-4 h-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 text-center", children: qty }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setQty((q) => q + 1), className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: inStock ? `${watch.stock} in stock` : "Sold out" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-wrap gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { disabled: !inStock, onClick: () => {
          add({
            id: watch.id,
            name: watch.name,
            brand: watch.brand,
            price: Number(watch.price),
            image_url: watch.image_url
          }, qty);
          toast.success("Added to cart");
        }, className: "px-7 py-3 rounded-full btn-gold inline-flex items-center gap-2 disabled:opacity-50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-4 h-4" }),
          " Add to cart"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: !inStock, onClick: () => {
          add({
            id: watch.id,
            name: watch.name,
            brand: watch.brand,
            price: Number(watch.price),
            image_url: watch.image_url
          }, qty);
          navigate({
            to: "/checkout"
          });
        }, className: "px-7 py-3 rounded-full btn-glass disabled:opacity-50", children: "Buy now" })
      ] })
    ] })
  ] });
}
export {
  WatchDetail as component
};
