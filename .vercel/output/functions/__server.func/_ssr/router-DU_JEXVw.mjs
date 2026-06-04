import { b as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { T as Toaster } from "../_libs/sonner.mjs";
import { s as supabase } from "./client-DqJ_k-uM.mjs";
import { S as Shield, a as ShoppingBag, U as User, L as LogOut, M as MapPin, P as Phone } from "../_libs/lucide-react.mjs";
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
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const appCss = "/assets/styles-_-U-rk5S.css";
const Ctx$1 = reactExports.createContext(null);
function AuthProvider({ children }) {
  const [session, setSession] = reactExports.useState(null);
  const [isAdmin, setIsAdmin] = reactExports.useState(false);
  const [loading, setLoading] = reactExports.useState(true);
  const loadRole = async (uid) => {
    if (!uid) return setIsAdmin(false);
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid);
    setIsAdmin(!!data?.some((r) => r.role === "admin"));
  };
  reactExports.useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setTimeout(() => loadRole(s?.user?.id), 0);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      loadRole(data.session?.user?.id).finally(() => setLoading(false));
    });
    return () => sub.subscription.unsubscribe();
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Ctx$1.Provider,
    {
      value: {
        user: session?.user ?? null,
        session,
        isAdmin,
        loading,
        signOut: async () => {
          await supabase.auth.signOut();
        },
        refreshRole: () => loadRole(session?.user?.id)
      },
      children
    }
  );
}
function useAuth() {
  const c = reactExports.useContext(Ctx$1);
  if (!c) throw new Error("useAuth requires AuthProvider");
  return c;
}
const Ctx = reactExports.createContext(null);
const KEY = "vins_cart_v1";
function CartProvider({ children }) {
  const [items, setItems] = reactExports.useState([]);
  const [ready, setReady] = reactExports.useState(false);
  reactExports.useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
    }
    setReady(true);
  }, []);
  reactExports.useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, ready]);
  const add = (item, qty = 1) => setItems((cur) => {
    const ex = cur.find((c) => c.id === item.id);
    if (ex) return cur.map((c) => c.id === item.id ? { ...c, quantity: c.quantity + qty } : c);
    return [...cur, { ...item, quantity: qty }];
  });
  const remove = (id) => setItems((cur) => cur.filter((c) => c.id !== id));
  const setQty = (id, qty) => setItems(
    (cur) => qty <= 0 ? cur.filter((c) => c.id !== id) : cur.map((c) => c.id === id ? { ...c, quantity: qty } : c)
  );
  const clear = () => setItems([]);
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Ctx.Provider, { value: { items, add, remove, setQty, clear, total, count }, children });
}
function useCart() {
  const c = reactExports.useContext(Ctx);
  if (!c) throw new Error("useCart must be used within CartProvider");
  return c;
}
const formatLKR = (n) => new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", maximumFractionDigits: 0 }).format(n);
function VinsLogo({ className, showWordmark = false }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex items-center gap-2 ${className ?? ""}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "img",
    {
      src: "/asset/Vins logo 01ss.png",
      alt: "Vins Watch",
      width: 200,
      height: 200,
      style: { filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.45))" },
      className: "object-contain"
    }
  ) });
}
function SiteHeader() {
  const { count } = useCart();
  const { user, isAdmin, signOut } = useAuth();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-40 glass border-b border-[var(--color-border)]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "flex items-center gap-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(VinsLogo, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "hidden md:flex mr-10 items-center gap-7 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "hover:text-[var(--color-gold-soft)] transition-colors", activeProps: { className: "text-[var(--color-gold-soft)]" }, children: "Home" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/shop", className: "hover:text-[var(--color-gold-soft)] transition-colors", activeProps: { className: "text-[var(--color-gold-soft)]" }, children: "Shop" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/about", className: "hover:text-[var(--color-gold-soft)] transition-colors", activeProps: { className: "text-[var(--color-gold-soft)]" }, children: "About" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/contact", className: "hover:text-[var(--color-gold-soft)] transition-colors", activeProps: { className: "text-[var(--color-gold-soft)]" }, children: "Contact" }),
      isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin", className: "flex items-center gap-1 text-[var(--color-gold-soft)]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-4 h-4" }),
        " Admin"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/cart", className: "relative p-2 rounded-full btn-glass", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-4 h-4" }),
        count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-1 -right-1 text-[10px] rounded-full w-5 h-5 flex items-center justify-center btn-gold", children: count })
      ] }),
      user ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/account", className: "p-2 rounded-full btn-glass", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-4 h-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => signOut(), className: "p-2 rounded-full btn-glass", "aria-label": "Sign out", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "w-4 h-4" }) })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth", search: { redirect: "/" }, className: "px-4 py-2 rounded-full btn-gold text-sm", children: "Sign in" })
    ] })
  ] }) });
}
function SiteFooter() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "mt-24 border-t border-[var(--color-border)]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(VinsLogo, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm ml-2 text-muted-foreground", children: "Crafted timepieces for those who measure life in moments, not minutes." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-display text-lg mb-3 text-[var(--color-gold-soft)]", children: "Visit Us" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-start gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-4 h-4 mt-0.5 text-[var(--color-gold)]" }),
          " 43 Greens Rd, Negombo"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "w-4 h-4 text-[var(--color-gold)]" }),
          " 0312 230 598"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-display text-lg mb-3 text-[var(--color-gold-soft)]", children: "Explore" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/shop", className: "block hover:text-[var(--color-gold-soft)]", children: "Shop watches" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/about", className: "block hover:text-[var(--color-gold-soft)]", children: "About us" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/contact", className: "block hover:text-[var(--color-gold-soft)]", children: "Contact" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/account", className: "block hover:text-[var(--color-gold-soft)]", children: "My account" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-[var(--color-border)] py-5 text-center text-xs text-muted-foreground", children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " Vins Watch. All rights reserved."
    ] })
  ] });
}
function WatchFace({
  size = 280,
  transparent = false,
  animatedHands = false
}) {
  const [now, setNow] = reactExports.useState(/* @__PURE__ */ new Date());
  const secRef = reactExports.useRef(null);
  const minRef = reactExports.useRef(null);
  const hrRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (animatedHands) return;
    const i = setInterval(() => setNow(/* @__PURE__ */ new Date()), 1e3);
    return () => clearInterval(i);
  }, [animatedHands]);
  reactExports.useEffect(() => {
    if (!animatedHands) return;
    let raf = 0;
    const start = performance.now();
    const c2 = size / 2;
    const tick = (t) => {
      const elapsed = (t - start) / 1e3;
      const secDeg2 = elapsed * 6 % 360;
      const minDeg2 = elapsed * 0.1 * 60 % 360;
      const hrDeg2 = elapsed * 0.5 % 360;
      if (secRef.current) secRef.current.setAttribute("transform", `rotate(${secDeg2} ${c2} ${c2})`);
      if (minRef.current) minRef.current.setAttribute("transform", `rotate(${minDeg2} ${c2} ${c2})`);
      if (hrRef.current) hrRef.current.setAttribute("transform", `rotate(${hrDeg2} ${c2} ${c2})`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [animatedHands, size]);
  const s = now.getSeconds();
  const m = now.getMinutes();
  const h = now.getHours() % 12;
  const secDeg = s * 6;
  const minDeg = m * 6 + s * 0.1;
  const hrDeg = h * 30 + m * 0.5;
  const c = size / 2;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", style: { width: size, height: size }, children: [
    !transparent && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "absolute inset-0 rounded-full blur-2xl opacity-50",
        style: { background: "var(--gradient-gold)" }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: `0 0 ${size} ${size}`, width: size, height: size, className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: "dial", cx: "50%", cy: "40%", r: "60%", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "oklch(0.32 0.02 70)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "oklch(0.16 0.012 60)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "bezel", x1: "0", y1: "0", x2: "1", y2: "1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "oklch(0.88 0.09 85)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "50%", stopColor: "oklch(0.65 0.13 70)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "oklch(0.86 0.09 85)" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "circle",
        {
          cx: c,
          cy: c,
          r: c - 4,
          fill: transparent ? "none" : "url(#bezel)",
          stroke: transparent ? "oklch(0.78 0.13 82 / 0.5)" : "none",
          strokeWidth: transparent ? 1.5 : 0
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "circle",
        {
          cx: c,
          cy: c,
          r: c - 14,
          fill: transparent ? "none" : "url(#dial)",
          stroke: transparent ? "oklch(0.78 0.13 82 / 0.25)" : "none",
          strokeWidth: transparent ? 0.8 : 0
        }
      ),
      Array.from({ length: 12 }).map((_, i) => {
        const a = i * 30 * Math.PI / 180;
        const r1 = c - 22;
        const r2 = i % 3 === 0 ? c - 36 : c - 30;
        const x1 = c + Math.sin(a) * r1;
        const y1 = c - Math.cos(a) * r1;
        const x2 = c + Math.sin(a) * r2;
        const y2 = c - Math.cos(a) * r2;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1,
            y1,
            x2,
            y2,
            stroke: "oklch(0.86 0.09 85)",
            strokeWidth: i % 3 === 0 ? 3 : 1.5,
            strokeLinecap: "round"
          },
          i
        );
      }),
      !transparent && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "text",
          {
            x: c,
            y: c - 30,
            textAnchor: "middle",
            fill: "oklch(0.86 0.09 85)",
            style: { font: '600 8px "Cormorant Garamond", serif', letterSpacing: "3px" },
            children: "VINS"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "text",
          {
            x: c,
            y: c + 38,
            textAnchor: "middle",
            fill: "oklch(0.72 0.025 80)",
            style: { font: "400 6px Inter, sans-serif", letterSpacing: "2px" },
            children: "NEGOMBO"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("g", { ref: hrRef, transform: `rotate(${hrDeg} ${c} ${c})`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: c - 2.5, y: c - (c - 60), width: "5", height: c - 60, rx: "2", fill: "oklch(0.86 0.09 85)" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("g", { ref: minRef, transform: `rotate(${minDeg} ${c} ${c})`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: c - 1.8, y: c - (c - 40), width: "3.6", height: c - 40, rx: "2", fill: "oklch(0.92 0.06 85)" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { ref: secRef, transform: `rotate(${secDeg} ${c} ${c})`, style: animatedHands ? void 0 : { transition: "transform 0.1s" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: c - 0.6, y: c - (c - 25), width: "1.2", height: c - 18, fill: "oklch(0.78 0.18 35)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: c, cy: c, r: "5", fill: "oklch(0.78 0.18 35)" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: c, cy: c, r: "2.5", fill: "oklch(0.16 0.012 60)" })
    ] })
  ] });
}
function Gear({ size = 120, opacity = 0.08 }) {
  const teeth = 12;
  const r = size / 2;
  const innerR = r * 0.55;
  const toothLen = r * 0.18;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: `0 0 ${size} ${size}`, width: size, height: size, style: { opacity }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: `gearGrad-${size}`, x1: "0", y1: "0", x2: "1", y2: "1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "oklch(0.86 0.09 85)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "oklch(0.6 0.12 70)" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { transform: `translate(${r} ${r})`, children: [
      Array.from({ length: teeth }).map((_, i) => {
        const a = i * 360 / teeth;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "rect",
          {
            x: -toothLen / 2,
            y: -r,
            width: toothLen,
            height: toothLen * 1.5,
            rx: 2,
            transform: `rotate(${a})`,
            fill: `url(#gearGrad-${size})`
          },
          i
        );
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { r: r * 0.78, fill: "none", stroke: `url(#gearGrad-${size})`, strokeWidth: "6" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { r: innerR, fill: "none", stroke: `url(#gearGrad-${size})`, strokeWidth: "3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { r: r * 0.15, fill: `url(#gearGrad-${size})` }),
      Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "rect",
        {
          x: -2,
          y: -innerR + 4,
          width: 4,
          height: innerR - r * 0.18,
          transform: `rotate(${i * 72})`,
          fill: `url(#gearGrad-${size})`
        },
        i
      ))
    ] })
  ] });
}
function BackgroundScene() {
  const watchRef = reactExports.useRef(null);
  const sceneRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY || 0;
        const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const p = Math.min(1, y / max);
        if (watchRef.current) {
          const tx = p * 220;
          const ty = y * 0.35;
          const scale = 1 + p * 0.25;
          const rot = p * 90;
          watchRef.current.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${scale}) rotate(${rot}deg)`;
          watchRef.current.style.opacity = String(0.35 - p * 0.15);
        }
        if (sceneRef.current) {
          sceneRef.current.style.setProperty("--scroll-p", String(p));
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      ref: sceneRef,
      "aria-hidden": true,
      className: "fixed inset-0 -z-10 overflow-hidden pointer-events-none",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "orb orb-a" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "orb orb-b" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "orb orb-c" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "float-slow absolute top-[8%] left-[4%]", style: { animationDuration: "22s" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "spin-slow", style: { animationDuration: "60s" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Gear, { size: 160, opacity: 0.07 }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "float-slow absolute top-[60%] left-[78%]", style: { animationDuration: "28s", animationDelay: "-6s" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "spin-rev", style: { animationDuration: "80s" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Gear, { size: 220, opacity: 0.06 }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "float-slow absolute top-[78%] left-[10%]", style: { animationDuration: "24s", animationDelay: "-3s" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "spin-slow", style: { animationDuration: "45s" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Gear, { size: 110, opacity: 0.08 }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "float-slow absolute top-[18%] left-[68%]", style: { animationDuration: "30s", animationDelay: "-12s" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "spin-rev", style: { animationDuration: "55s" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Gear, { size: 90, opacity: 0.1 }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            ref: watchRef,
            className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mix-blend-screen will-change-transform",
            style: { opacity: 0.35, transition: "opacity 0.2s linear" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(WatchFace, { size: 720, transparent: true, animatedHands: true })
          }
        ),
        Array.from({ length: 24 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "particle",
            style: {
              top: `${i * 37 % 100}%`,
              left: `${i * 53 % 100}%`,
              animationDelay: `${i % 8 * -1.3}s`,
              animationDuration: `${4 + i % 5}s`
            }
          },
          i
        ))
      ]
    }
  );
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-strong rounded-3xl p-12 max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-display text-gradient-gold", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 text-xl font-display", children: "Lost in time" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "mt-6 inline-block px-6 py-2 rounded-full btn-gold text-sm", children: "Back home" })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-strong rounded-3xl p-10 max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-display", children: "Something went wrong" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: error.message }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => {
          router2.invalidate();
          reset();
        },
        className: "mt-6 px-6 py-2 rounded-full btn-gold text-sm",
        children: "Try again"
      }
    )
  ] }) });
}
const Route$l = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Vins Watch — Luxury Timepieces in Negombo" },
      { name: "description", content: "Curated luxury watches from Vins Watch, Negombo. Premium timepieces, expert service, in-store and online." },
      { property: "og:title", content: "Vins Watch — Luxury Timepieces in Negombo" },
      { property: "og:description", content: "Curated luxury watches from Vins Watch, Negombo. Premium timepieces, expert service, in-store and online." },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "Vins Watch — Luxury Timepieces in Negombo" },
      { name: "twitter:description", content: "Curated luxury watches from Vins Watch, Negombo. Premium timepieces, expert service, in-store and online." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/cf886105-6ce5-4fe5-972f-2c11681c2534/id-preview-b7c67747--645bf079-bec0-4e4f-a4d2-3977bac13775.lovable.app-1780311316880.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/cf886105-6ce5-4fe5-972f-2c11681c2534/id-preview-b7c67747--645bf079-bec0-4e4f-a4d2-3977bac13775.lovable.app-1780311316880.png" },
      { name: "twitter:card", content: "summary_large_image" }
    ],
    links: [
      { rel: "icon", type: "image/png", href: "/asset/Vins logo 01sss.png" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$l.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AuthProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CartProvider, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(BackgroundScene, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SiteHeader, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SiteFooter, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { theme: "dark", position: "top-right" })
  ] }) }) });
}
const $$splitComponentImporter$k = () => import("./shop-CK5gYkyA.mjs");
const Route$k = createFileRoute("/shop")({
  component: lazyRouteComponent($$splitComponentImporter$k, "component"),
  head: () => ({
    meta: [{
      title: "Shop — Vins Watch"
    }, {
      name: "description",
      content: "Browse luxury timepieces at Vins Watch, Negombo."
    }]
  })
});
const $$splitComponentImporter$j = () => import("./contact-CWQUXeRl.mjs");
const Route$j = createFileRoute("/contact")({
  component: lazyRouteComponent($$splitComponentImporter$j, "component"),
  head: () => ({
    meta: [{
      title: "Contact — Vins Watch, Negombo"
    }, {
      name: "description",
      content: "Visit Vins Watch at 43 Greens Rd, Negombo. Call 0312 230 598."
    }]
  })
});
const $$splitComponentImporter$i = () => import("./checkout-CUsOjd_V.mjs");
const Route$i = createFileRoute("/checkout")({
  component: lazyRouteComponent($$splitComponentImporter$i, "component")
});
const $$splitComponentImporter$h = () => import("./cart-CxhNZJbc.mjs");
const Route$h = createFileRoute("/cart")({
  component: lazyRouteComponent($$splitComponentImporter$h, "component")
});
const $$splitComponentImporter$g = () => import("./auth-Bfw_zrxn.mjs");
const Route$g = createFileRoute("/auth")({
  component: lazyRouteComponent($$splitComponentImporter$g, "component"),
  validateSearch: (s) => ({
    redirect: s.redirect || "/"
  })
});
const $$splitComponentImporter$f = () => import("./about-CDV6s-Y6.mjs");
const Route$f = createFileRoute("/about")({
  component: lazyRouteComponent($$splitComponentImporter$f, "component"),
  head: () => ({
    meta: [{
      title: "About — Vins Watch, Negombo"
    }, {
      name: "description",
      content: "Learn about Vins Watch. Expert watch specialists in Negombo since 1980. Authentic luxury timepieces, warranty, and personalised service."
    }, {
      property: "og:title",
      content: "About Vins Watch — Luxury Timepieces in Negombo"
    }, {
      property: "og:description",
      content: "Discover Vins Watch story, our commitment to authenticity, and the trusted service behind every timepiece."
    }]
  })
});
const $$splitComponentImporter$e = () => import("../_authenticated-Bmftlzhm.mjs");
const Route$e = createFileRoute("/_authenticated")({
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./index-CXOUYe47.mjs");
const Route$d = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter$d, "component"),
  head: () => ({
    meta: [{
      title: "Vins Watch — Luxury Timepieces in Negombo"
    }, {
      name: "description",
      content: "Discover premium luxury watches at Vins Watch in Negombo. Curated brands, certified authenticity, island-wide delivery."
    }]
  })
});
const $$splitComponentImporter$c = () => import("./watch._id-DPrdX5gW.mjs");
const Route$c = createFileRoute("/watch/$id")({
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./admin-DUDmry78.mjs");
const Route$b = createFileRoute("/_authenticated/admin")({
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./account-B36ShupO.mjs");
const Route$a = createFileRoute("/_authenticated/account")({
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./index-D3hgLZ40.mjs");
const Route$9 = createFileRoute("/_authenticated/admin/")({
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./watches-BZpHn9Cg.mjs");
const Route$8 = createFileRoute("/_authenticated/admin/watches")({
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./promotions-DeMQKSYE.mjs");
const Route$7 = createFileRoute("/_authenticated/admin/promotions")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
function Modal({
  children,
  onClose
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-auto", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { onClick: (e) => e.stopPropagation(), className: "glass-strong rounded-3xl p-6 w-full max-w-lg my-auto", children }) });
}
function Actions({
  onCancel,
  label
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: onCancel, className: "flex-1 py-2.5 rounded-full btn-glass", children: "Cancel" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "flex-1 py-2.5 rounded-full btn-gold", children: label })
  ] });
}
function Input({
  label,
  value,
  onChange,
  type = "text",
  multiline,
  required = true,
  placeholder
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: label }),
    multiline ? /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value, onChange: (e) => onChange(e.target.value), required, placeholder, rows: 3, className: "mt-1 w-full glass rounded-xl px-3 py-2 text-sm outline-none focus:border-[var(--color-gold)]" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type, value, onChange: (e) => onChange(e.target.value), required, placeholder, className: "mt-1 w-full glass rounded-xl px-3 py-2 text-sm outline-none focus:border-[var(--color-gold)]" })
  ] });
}
const $$splitComponentImporter$6 = () => import("./orders-rcilyrcg.mjs");
const Route$6 = createFileRoute("/_authenticated/admin/orders")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./messages-BzyZb1Wj.mjs");
const Route$5 = createFileRoute("/_authenticated/admin/messages")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./discounts-Crs0JaGQ.mjs");
const Route$4 = createFileRoute("/_authenticated/admin/discounts")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./collections-kyikIHee.mjs");
const Route$3 = createFileRoute("/_authenticated/admin/collections")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./brands-DTPlSMrh.mjs");
const Route$2 = createFileRoute("/_authenticated/admin/brands")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./brand-categories-D1O0SoTd.mjs");
const Route$1 = createFileRoute("/_authenticated/admin/brand-categories")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./banners-C-Byv_La.mjs");
const Route = createFileRoute("/_authenticated/admin/banners")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const ShopRoute = Route$k.update({
  id: "/shop",
  path: "/shop",
  getParentRoute: () => Route$l
});
const ContactRoute = Route$j.update({
  id: "/contact",
  path: "/contact",
  getParentRoute: () => Route$l
});
const CheckoutRoute = Route$i.update({
  id: "/checkout",
  path: "/checkout",
  getParentRoute: () => Route$l
});
const CartRoute = Route$h.update({
  id: "/cart",
  path: "/cart",
  getParentRoute: () => Route$l
});
const AuthRoute = Route$g.update({
  id: "/auth",
  path: "/auth",
  getParentRoute: () => Route$l
});
const AboutRoute = Route$f.update({
  id: "/about",
  path: "/about",
  getParentRoute: () => Route$l
});
const AuthenticatedRoute = Route$e.update({
  id: "/_authenticated",
  getParentRoute: () => Route$l
});
const IndexRoute = Route$d.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$l
});
const WatchIdRoute = Route$c.update({
  id: "/watch/$id",
  path: "/watch/$id",
  getParentRoute: () => Route$l
});
const AuthenticatedAdminRoute = Route$b.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedAccountRoute = Route$a.update({
  id: "/account",
  path: "/account",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedAdminIndexRoute = Route$9.update({
  id: "/",
  path: "/",
  getParentRoute: () => AuthenticatedAdminRoute
});
const AuthenticatedAdminWatchesRoute = Route$8.update({
  id: "/watches",
  path: "/watches",
  getParentRoute: () => AuthenticatedAdminRoute
});
const AuthenticatedAdminPromotionsRoute = Route$7.update({
  id: "/promotions",
  path: "/promotions",
  getParentRoute: () => AuthenticatedAdminRoute
});
const AuthenticatedAdminOrdersRoute = Route$6.update({
  id: "/orders",
  path: "/orders",
  getParentRoute: () => AuthenticatedAdminRoute
});
const AuthenticatedAdminMessagesRoute = Route$5.update({
  id: "/messages",
  path: "/messages",
  getParentRoute: () => AuthenticatedAdminRoute
});
const AuthenticatedAdminDiscountsRoute = Route$4.update({
  id: "/discounts",
  path: "/discounts",
  getParentRoute: () => AuthenticatedAdminRoute
});
const AuthenticatedAdminCollectionsRoute = Route$3.update({
  id: "/collections",
  path: "/collections",
  getParentRoute: () => AuthenticatedAdminRoute
});
const AuthenticatedAdminBrandsRoute = Route$2.update({
  id: "/brands",
  path: "/brands",
  getParentRoute: () => AuthenticatedAdminRoute
});
const AuthenticatedAdminBrandCategoriesRoute = Route$1.update({
  id: "/brand-categories",
  path: "/brand-categories",
  getParentRoute: () => AuthenticatedAdminRoute
});
const AuthenticatedAdminBannersRoute = Route.update({
  id: "/banners",
  path: "/banners",
  getParentRoute: () => AuthenticatedAdminRoute
});
const AuthenticatedAdminRouteChildren = {
  AuthenticatedAdminBannersRoute,
  AuthenticatedAdminBrandCategoriesRoute,
  AuthenticatedAdminBrandsRoute,
  AuthenticatedAdminCollectionsRoute,
  AuthenticatedAdminDiscountsRoute,
  AuthenticatedAdminMessagesRoute,
  AuthenticatedAdminOrdersRoute,
  AuthenticatedAdminPromotionsRoute,
  AuthenticatedAdminWatchesRoute,
  AuthenticatedAdminIndexRoute
};
const AuthenticatedAdminRouteWithChildren = AuthenticatedAdminRoute._addFileChildren(AuthenticatedAdminRouteChildren);
const AuthenticatedRouteChildren = {
  AuthenticatedAccountRoute,
  AuthenticatedAdminRoute: AuthenticatedAdminRouteWithChildren
};
const AuthenticatedRouteWithChildren = AuthenticatedRoute._addFileChildren(
  AuthenticatedRouteChildren
);
const rootRouteChildren = {
  IndexRoute,
  AuthenticatedRoute: AuthenticatedRouteWithChildren,
  AboutRoute,
  AuthRoute,
  CartRoute,
  CheckoutRoute,
  ContactRoute,
  ShopRoute,
  WatchIdRoute
};
const routeTree = Route$l._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Actions as A,
  Input as I,
  Modal as M,
  Route$g as R,
  useAuth as a,
  Route$c as b,
  formatLKR as f,
  router as r,
  useCart as u
};
