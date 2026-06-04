import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { u as useEmblaCarousel } from "../_libs/embla-carousel-react.mjs";
import { s as supabase } from "./client-DqJ_k-uM.mjs";
import { W as WatchCard } from "./watch-card-CHhXInOt.mjs";
import "../_libs/sonner.mjs";
import { A as Award, f as ShieldCheck, i as Sparkles, F as Flame, j as ArrowRight, k as ChevronLeft, l as ChevronRight } from "../_libs/lucide-react.mjs";
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
import "../_libs/embla-carousel-reactive-utils.mjs";
import "../_libs/embla-carousel.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./router-DU_JEXVw.mjs";
function Home() {
  const {
    data: banners
  } = useQuery({
    queryKey: ["home-banners"],
    queryFn: async () => (await supabase.from("banners").select("*").eq("active", true).order("sort_order")).data ?? []
  });
  const {
    data: brandCategories
  } = useQuery({
    queryKey: ["home-brand-categories"],
    queryFn: async () => (await supabase.from("brand_categories").select("*").eq("active", true).order("sort_order")).data ?? []
  });
  const {
    data: newArrivals
  } = useQuery({
    queryKey: ["new-arrivals"],
    queryFn: async () => (await supabase.from("watches").select("*").eq("featured", true).order("created_at", {
      ascending: false
    }).limit(6)).data ?? []
  });
  const {
    data: hotSellers
  } = useQuery({
    queryKey: ["hot-sellers"],
    queryFn: async () => (await supabase.from("watches").select("*").eq("hot_seller", true).order("created_at", {
      ascending: false
    }).limit(6)).data ?? []
  });
  const {
    data: collections
  } = useQuery({
    queryKey: ["home-collections"],
    queryFn: async () => (await supabase.from("collections").select("*").eq("active", true).order("sort_order")).data ?? []
  });
  const {
    data: promos
  } = useQuery({
    queryKey: ["home-promotions"],
    queryFn: async () => (await supabase.from("promotions").select("*").eq("active", true).order("sort_order")).data ?? []
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(BannerCarousel, { banners: banners ?? [] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 mt-6 text-center text-xs uppercase tracking-[0.4em] text-muted-foreground", children: [
      "Live · Negombo · ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(LiveTime, {})
    ] }),
    brandCategories && brandCategories.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-7xl mx-auto px-4 sm:px-6 mt-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end justify-between mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-[0.3em] text-[var(--color-gold-soft)]", children: "Shop by brand" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl sm:text-4xl mt-1", children: "Iconic makers" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(BrandStrip, { items: brandCategories })
    ] }),
    promos && promos.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "max-w-7xl mx-auto px-4 sm:px-6 mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-4", children: promos.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-[0.3em] text-[var(--color-gold-soft)] mb-2", children: "Promotion" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-xl", children: p.title }),
      p.subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground mt-1", children: p.subtitle }),
      p.cta_label && p.cta_url && /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: p.cta_url, className: "inline-block mt-3 text-sm text-[var(--color-gold)] hover:underline", children: [
        p.cta_label,
        " →"
      ] })
    ] }, p.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "max-w-7xl mx-auto px-4 sm:px-6 mt-20 grid sm:grid-cols-3 gap-5", children: [{
      icon: Award,
      t: "Authentic",
      d: "Every timepiece certified by Vins specialists."
    }, {
      icon: ShieldCheck,
      t: "Warranty",
      d: "International manufacturer warranty included."
    }, {
      icon: Sparkles,
      t: "Free delivery",
      d: "Island-wide shipping on orders above LKR 50,000."
    }].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(f.icon, { className: "w-6 h-6 text-[var(--color-gold)]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-xl mt-3", children: f.t }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground mt-1", children: f.d })
    ] }, f.t)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(WatchRow, { kicker: "Just in", title: "New arrivals", watches: newArrivals ?? [], emptyText: "Mark watches as 'New arrival' in the admin panel to feature them here." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(WatchRow, { kicker: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "w-3 h-3 inline mr-1" }),
      " Trending"
    ] }), title: "Hot sellers", watches: hotSellers ?? [], emptyText: "Mark watches as 'Hot seller' in the admin panel to feature them here." }),
    collections && collections.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-7xl mx-auto px-4 sm:px-6 mt-24 mb-24", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end justify-between mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-[0.3em] text-[var(--color-gold-soft)]", children: "Curated" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-4xl mt-1", children: "Explore collections" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CollectionsGrid, { items: collections })
    ] })
  ] });
}
const BANNER_HEIGHT = {
  small: "h-[320px] sm:h-[400px]",
  medium: "h-[400px] sm:h-[500px] lg:h-[600px]",
  large: "h-[500px] sm:h-[600px] lg:h-[720px]",
  full: "h-[80vh] sm:h-[85vh]",
  tall: "h-[600px] sm:h-[700px] lg:h-[800px]"
};
function BannerCarousel({
  banners
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start"
  });
  const [selected, setSelected] = reactExports.useState(0);
  reactExports.useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    const i = setInterval(() => emblaApi.scrollNext(), 5e3);
    return () => {
      clearInterval(i);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);
  if (!banners.length) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "w-full pt-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-16 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-[0.3em] text-[var(--color-gold-soft)] mb-3", children: "Welcome" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-5xl sm:text-6xl", children: "Vins Watch" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-4 max-w-lg mx-auto", children: "Add banners in the admin panel to showcase featured collections at the top of your store." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/shop", className: "inline-flex items-center gap-2 mt-8 px-8 py-3.5 rounded-full btn-gold", children: [
        "Shop collection ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4" })
      ] })
    ] }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "w-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden", ref: emblaRef, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex", children: banners.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative flex-[0_0_100%] min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `relative ${BANNER_HEIGHT[b.size] ?? BANNER_HEIGHT.medium} overflow-hidden`, children: [
        b.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: b.image_url, alt: b.title, className: "absolute inset-0 w-full h-full object-cover scale-105 animate-[kenburns_20s_ease-in-out_infinite_alternate]" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0", style: {
          background: "var(--gradient-bg)"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-transparent" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-full flex flex-col justify-center px-6 sm:px-14 lg:px-20 max-w-2xl animate-fade-in", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-[0.4em] text-[var(--color-gold-soft)] mb-4", children: "Featured" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-4xl sm:text-6xl lg:text-7xl leading-[1.02]", children: b.title }),
          b.subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-4 text-base sm:text-lg max-w-md", children: b.subtitle }),
          b.cta_label && b.cta_url && /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: b.cta_url, className: "mt-8 px-7 py-3 rounded-full btn-gold w-fit inline-flex items-center gap-2", children: [
            b.cta_label,
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4" })
          ] })
        ] })
      ] }) }, b.id)) }) }),
      banners.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => emblaApi?.scrollPrev(), className: "absolute left-3 top-1/2 -translate-y-1/2 glass-strong rounded-full p-2.5 hover:text-[var(--color-gold)]", "aria-label": "Previous", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-5 h-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => emblaApi?.scrollNext(), className: "absolute right-3 top-1/2 -translate-y-1/2 glass-strong rounded-full p-2.5 hover:text-[var(--color-gold)]", "aria-label": "Next", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-5 h-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2", children: banners.map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => emblaApi?.scrollTo(i), className: `h-1.5 rounded-full transition-all ${i === selected ? "w-8 bg-[var(--color-gold)]" : "w-1.5 bg-white/40"}`, "aria-label": `Slide ${i + 1}` }, i)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `@keyframes kenburns { 0% { transform: scale(1.05) translate(0,0); } 100% { transform: scale(1.15) translate(-2%, -1%); } }` })
  ] });
}
function BrandStrip({
  items
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    loop: items.length > 6
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden", ref: emblaRef, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-4", children: items.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/shop", search: {
      brand: b.name
    }, className: "flex-[0_0_140px] sm:flex-[0_0_160px] group", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "aspect-square glass rounded-2xl overflow-hidden relative hover-scale", children: [
      b.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: b.image_url, alt: b.name, className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center font-display text-2xl text-[var(--color-gold-soft)]", children: b.name[0] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-center truncate", children: b.name }) })
    ] }) }, b.id)) }) }),
    items.length > 4 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => emblaApi?.scrollPrev(), className: "hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 glass-strong rounded-full p-2 hover:text-[var(--color-gold)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => emblaApi?.scrollNext(), className: "hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 glass-strong rounded-full p-2 hover:text-[var(--color-gold)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4" }) })
    ] })
  ] });
}
function WatchRow({
  kicker,
  title,
  watches,
  emptyText
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-7xl mx-auto px-4 sm:px-6 mt-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-[0.3em] text-[var(--color-gold-soft)]", children: kicker }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-4xl mt-1", children: title })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/shop", className: "text-sm text-[var(--color-gold-soft)] hover:underline", children: "View all →" })
    ] }),
    !watches.length ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-2xl p-12 text-center text-muted-foreground", children: emptyText }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-5", children: watches.map((w) => /* @__PURE__ */ jsxRuntimeExports.jsx(WatchCard, { ...w, price: Number(w.price) }, w.id)) })
  ] });
}
const SIZE_CLASS = {
  small: "col-span-1 row-span-1 aspect-square",
  medium: "col-span-2 row-span-1 aspect-[2/1]",
  large: "col-span-2 row-span-2 aspect-square",
  wide: "col-span-3 row-span-1 aspect-[3/1]",
  tall: "col-span-1 row-span-2 aspect-[1/2]"
};
function CollectionsGrid({
  items
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 auto-rows-[160px] sm:auto-rows-[200px] gap-4", children: items.map((c) => {
    const Card = /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full h-full overflow-hidden rounded-2xl glass group", children: [
      c.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: c.image_url, alt: c.title, className: "absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0", style: {
        background: "var(--gradient-bg)"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-full flex flex-col justify-end p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-xl sm:text-2xl", children: c.title }),
        c.subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground mt-1 line-clamp-2", children: c.subtitle }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 text-xs text-[var(--color-gold)] inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition", children: [
          "Explore ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-3 h-3" })
        ] })
      ] })
    ] });
    const cls = `${SIZE_CLASS[c.size] ?? SIZE_CLASS.medium} min-h-0`;
    return c.link_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: c.link_url, className: cls, children: Card }, c.id) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cls, children: Card }, c.id);
  }) });
}
function LiveTime() {
  const [t, setT] = reactExports.useState("");
  reactExports.useEffect(() => {
    const update = () => setT((/* @__PURE__ */ new Date()).toLocaleTimeString("en-LK", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    }));
    update();
    const i = setInterval(update, 1e3);
    return () => clearInterval(i);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[var(--color-gold-soft)] tabular-nums", children: t || "--:--:--" });
}
export {
  Home as component
};
