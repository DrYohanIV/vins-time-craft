import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { f as formatLKR } from "./router-BI-Nvu9e.mjs";
function WatchCard({ id, name, brand, price, image_url, stock }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/watch/$id", params: { id }, className: "group glass rounded-2xl overflow-hidden block transition-all hover:-translate-y-1 hover:border-[var(--color-gold)]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "aspect-square overflow-hidden relative", style: { background: "var(--gradient-bg)" }, children: [
      image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: image_url,
          alt: name,
          loading: "lazy",
          className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-32 h-32 rounded-full", style: { background: "var(--gradient-gold)", opacity: 0.3 } }) }),
      stock !== void 0 && stock <= 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-3 right-3 text-xs px-3 py-1 rounded-full bg-black/60 text-white", children: "Sold out" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wider text-[var(--color-gold-soft)]", children: brand }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-lg mt-0.5 truncate", children: name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 font-semibold text-gradient-gold", children: formatLKR(price) })
    ] })
  ] });
}
export {
  WatchCard as W
};
