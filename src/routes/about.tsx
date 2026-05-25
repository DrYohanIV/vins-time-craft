import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone, Clock, Award, ShieldCheck, Heart, Mail } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({
    meta: [
      { title: "About — Vins Watch, Negombo" },
      { name: "description", content: "Learn about Vins Watch. Expert watch specialists in Negombo since 1980. Authentic luxury timepieces, warranty, and personalised service." },
      { property: "og:title", content: "About Vins Watch — Luxury Timepieces in Negombo" },
      { property: "og:description", content: "Discover Vins Watch story, our commitment to authenticity, and the trusted service behind every timepiece." },
    ],
  }),
});

const FAQS = [
  {
    q: "Do you sell authentic branded watches?",
    a: "Yes. Every timepiece at Vins Watch is sourced directly from authorised distributors or verified international partners. Each watch comes with its original box, papers, and manufacturer warranty.",
  },
  {
    q: "What is your return or exchange policy?",
    a: "We accept returns within 7 days for unused watches in original condition with all packaging intact. Exchanges can be arranged within 14 days. Please keep your receipt or digital order confirmation.",
  },
  {
    q: "Do you offer island-wide delivery?",
    a: "Absolutely. We offer free insured delivery across Sri Lanka for orders above LKR 50,000. Below that, a flat LKR 500 delivery fee applies. All shipments are fully insured and tracked.",
  },
  {
    q: "Can I visit your Negombo store to try watches?",
    a: "Of course. Our boutique at 43 Greens Road, Negombo is open Monday to Saturday 9 AM – 7 PM and Sunday 10 AM – 5 PM. Walk-ins are welcome, and we recommend booking an appointment for high-value pieces.",
  },
  {
    q: "Do the watches come with a warranty?",
    a: "Yes. All watches include the manufacturer's international warranty, typically 2 years. We also provide a store-level service guarantee for any issues within the first 30 days.",
  },
  {
    q: "Do you buy or trade pre-owned watches?",
    a: "Yes. We offer trade-in and consignment services for select luxury brands. Bring your watch to the store for a free evaluation by our specialists.",
  },
];

const VALUES = [
  { icon: Award, t: "Certified Authenticity", d: "Every watch inspected and authenticated by our in-house specialists before it reaches the showroom." },
  { icon: ShieldCheck, t: "Trusted Warranty", d: "Full manufacturer warranty on every piece, backed by direct relationships with global distributors." },
  { icon: Heart, t: "Personal Service", d: "Family-run since 1980. We treat every customer like a guest in our home, not a transaction." },
];

function About() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 space-y-24">
      {/* Hero / Story */}
      <section>
        <div className="text-center mb-10">
          <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold-soft)]">Since 1980</div>
          <h1 className="font-display text-5xl sm:text-6xl mt-3">Our Story</h1>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
            Vins Watch began as a small family counter on Negombo's bustling Greens Road. Four decades later, we remain Sri Lanka's trusted destination for fine timepieces — blending heritage, expertise, and uncompromising quality.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="glass rounded-3xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?q=80&w=900&auto=format&fit=crop"
              alt="Luxury watch showcase in boutique"
              className="w-full h-[320px] sm:h-[380px] object-cover"
            />
          </div>
          <div className="glass rounded-3xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1523170335258-b5f6c2be6f2e?q=80&w=900&auto=format&fit=crop"
              alt="Close-up of a luxury watch mechanism"
              className="w-full h-[320px] sm:h-[380px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section>
        <div className="text-center mb-10">
          <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold-soft)]">Why choose us</div>
          <h2 className="font-display text-4xl mt-2">The Vins Promise</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-5">
          {VALUES.map((v) => (
            <div key={v.t} className="glass rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-[var(--color-gold)]/10 flex items-center justify-center mx-auto">
                <v.icon className="w-6 h-6 text-[var(--color-gold)]" />
              </div>
              <div className="font-display text-xl mt-4">{v.t}</div>
              <div className="text-sm text-muted-foreground mt-2">{v.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section>
        <div className="text-center mb-10">
          <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold-soft)]">Customer questions</div>
          <h2 className="font-display text-4xl mt-2">Frequently Asked</h2>
        </div>
        <div className="glass rounded-3xl p-6 sm:p-8 max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-[var(--color-border)]">
                <AccordionTrigger className="text-left text-sm sm:text-base font-medium hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Contact */}
      <section>
        <div className="text-center mb-10">
          <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold-soft)]">Reach out</div>
          <h2 className="font-display text-4xl mt-2">Get in Touch</h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Visit our boutique, call us, or drop a message — we are here to help you find the perfect timepiece.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="glass rounded-3xl p-6 space-y-5">
            <ContactRow icon={MapPin} title="Visit us" lines={["43 Greens Road, Negombo", "Sri Lanka"]} />
            <ContactRow icon={Phone} title="Call us" lines={["0312 230 598"]} />
            <ContactRow icon={Mail} title="Email us" lines={["info@vinswatch.lk"]} />
            <ContactRow icon={Clock} title="Opening hours" lines={["Mon – Sat · 9:00 – 19:00", "Sunday · 10:00 – 17:00"]} />
          </div>
          <div className="glass-strong rounded-3xl overflow-hidden min-h-[320px]">
            <iframe
              title="Vins Watch — Negombo"
              src="https://www.google.com/maps?q=43+Greens+Rd+Negombo&output=embed"
              className="w-full h-full border-0 min-h-[320px]"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function ContactRow({ icon: Icon, title, lines }: { icon: any; title: string; lines: string[] }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-full bg-[var(--color-gold)]/10 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-[var(--color-gold)]" />
      </div>
      <div>
        <div className="font-display text-lg">{title}</div>
        {lines.map((l) => (
          <div key={l} className="text-sm text-muted-foreground">{l}</div>
        ))}
      </div>
    </div>
  );
}
