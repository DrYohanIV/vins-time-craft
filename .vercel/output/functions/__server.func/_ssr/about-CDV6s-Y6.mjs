import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { R as Root2, I as Item, H as Header, T as Trigger2, C as Content2 } from "../_libs/radix-ui__react-accordion.mjs";
import { c as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { A as Award, f as ShieldCheck, H as Heart, M as MapPin, P as Phone, g as Mail, C as Clock, h as ChevronDown } from "../_libs/lucide-react.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/radix-ui__react-collapsible.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/radix-ui__react-direction.mjs";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const Accordion = Root2;
const AccordionItem = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Item, { ref, className: cn("border-b", className), ...props }));
AccordionItem.displayName = "AccordionItem";
const AccordionTrigger = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Header, { className: "flex", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
  Trigger2,
  {
    ref,
    className: cn(
      "flex flex-1 items-center justify-between py-4 text-sm font-medium cursor-pointer transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" })
    ]
  }
) }));
AccordionTrigger.displayName = Trigger2.displayName;
const AccordionContent = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content2,
  {
    ref,
    className: "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("pb-4 pt-0", className), children })
  }
));
AccordionContent.displayName = Content2.displayName;
const FAQS = [{
  q: "Do you sell authentic branded watches?",
  a: "Yes. Every timepiece at Vins Watch is sourced directly from authorised distributors or verified international partners. Each watch comes with its original box, papers, and manufacturer warranty."
}, {
  q: "What is your return or exchange policy?",
  a: "We accept returns within 7 days for unused watches in original condition with all packaging intact. Exchanges can be arranged within 14 days. Please keep your receipt or digital order confirmation."
}, {
  q: "Do you offer island-wide delivery?",
  a: "Absolutely. We offer free insured delivery across Sri Lanka for orders above LKR 50,000. Below that, a flat LKR 500 delivery fee applies. All shipments are fully insured and tracked."
}, {
  q: "Can I visit your Negombo store to try watches?",
  a: "Of course. Our boutique at 43 Greens Road, Negombo is open Monday to Saturday 9 AM – 7 PM and Sunday 10 AM – 5 PM. Walk-ins are welcome, and we recommend booking an appointment for high-value pieces."
}, {
  q: "Do the watches come with a warranty?",
  a: "Yes. All watches include the manufacturer's international warranty, typically 2 years. We also provide a store-level service guarantee for any issues within the first 30 days."
}, {
  q: "Do you buy or trade pre-owned watches?",
  a: "Yes. We offer trade-in and consignment services for select luxury brands. Bring your watch to the store for a free evaluation by our specialists."
}];
const VALUES = [{
  icon: Award,
  t: "Certified Authenticity",
  d: "Every watch inspected and authenticated by our in-house specialists before it reaches the showroom."
}, {
  icon: ShieldCheck,
  t: "Trusted Warranty",
  d: "Full manufacturer warranty on every piece, backed by direct relationships with global distributors."
}, {
  icon: Heart,
  t: "Personal Service",
  d: "Family-run since 1980. We treat every customer like a guest in our home, not a transaction."
}];
function About() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto px-4 sm:px-6 py-16 space-y-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-[0.3em] text-[var(--color-gold-soft)]", children: "Since 1980" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-5xl sm:text-6xl mt-3", children: "Our Story" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-4 max-w-2xl mx-auto text-lg", children: "Vins Watch began as a small family counter on Negombo's bustling Greens Road. Four decades later, we remain Sri Lanka's trusted destination for fine timepieces — blending heritage, expertise, and uncompromising quality." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-3xl overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?q=80&w=900&auto=format&fit=crop", alt: "Luxury watch showcase in boutique", className: "w-full h-[320px] sm:h-[380px] object-cover" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-3xl overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "https://images.unsplash.com/photo-1523170335258-b5f6c2be6f2e?q=80&w=900&auto=format&fit=crop", alt: "Close-up of a luxury watch mechanism", className: "w-full h-[320px] sm:h-[380px] object-cover" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-[0.3em] text-[var(--color-gold-soft)]", children: "Why choose us" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-4xl mt-2", children: "The Vins Promise" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-3 gap-5", children: VALUES.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-6 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-[var(--color-gold)]/10 flex items-center justify-center mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(v.icon, { className: "w-6 h-6 text-[var(--color-gold)]" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-xl mt-4", children: v.t }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground mt-2", children: v.d })
      ] }, v.t)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-[0.3em] text-[var(--color-gold-soft)]", children: "Customer questions" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-4xl mt-2", children: "Frequently Asked" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-3xl p-6 sm:p-8 max-w-3xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Accordion, { type: "single", collapsible: true, className: "w-full", children: FAQS.map((faq, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(AccordionItem, { value: `item-${i}`, className: "border-[var(--color-border)]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionTrigger, { className: "text-left text-sm sm:text-base font-medium hover:no-underline", children: faq.q }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionContent, { className: "text-sm text-muted-foreground leading-relaxed", children: faq.a })
      ] }, i)) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-[0.3em] text-[var(--color-gold-soft)]", children: "Reach out" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-4xl mt-2", children: "Get in Touch" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-3 max-w-xl mx-auto", children: "Visit our boutique, call us, or drop a message — we are here to help you find the perfect timepiece." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-3xl p-6 space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ContactRow, { icon: MapPin, title: "Visit us", lines: ["43 Greens Road, Negombo", "Sri Lanka"] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ContactRow, { icon: Phone, title: "Call us", lines: ["0312 230 598"] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ContactRow, { icon: Mail, title: "Email us", lines: ["info@vinswatch.lk"] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ContactRow, { icon: Clock, title: "Opening hours", lines: ["Mon – Sat · 9:00 – 19:00", "Sunday · 10:00 – 17:00"] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass-strong rounded-3xl overflow-hidden min-h-[320px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("iframe", { title: "Vins Watch — Negombo", src: "https://www.google.com/maps?q=43+Greens+Rd+Negombo&output=embed", className: "w-full h-full border-0 min-h-[320px]", loading: "lazy" }) })
      ] })
    ] })
  ] });
}
function ContactRow({
  icon: Icon,
  title,
  lines
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-[var(--color-gold)]/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-5 h-5 text-[var(--color-gold)]" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-lg", children: title }),
      lines.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: l }, l))
    ] })
  ] });
}
export {
  About as component
};
