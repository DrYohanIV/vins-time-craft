import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone, Clock } from "lucide-react";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({
    meta: [
      { title: "Contact — Vins Watch, Negombo" },
      { name: "description", content: "Visit Vins Watch at 43 Greens Rd, Negombo. Call 0312 230 598." },
    ],
  }),
});

function Contact() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-12">
        <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold-soft)]">Get in touch</div>
        <h1 className="font-display text-5xl mt-2">Visit our store</h1>
        <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
          Experience the Vins Watch collection in person at our Negombo boutique.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5 mb-10">
        <Info icon={MapPin} title="Address" lines={["43 Greens Rd", "Negombo, Sri Lanka"]} />
        <Info icon={Phone} title="Phone" lines={["0312 230 598"]} />
        <Info icon={Clock} title="Hours" lines={["Mon – Sat · 9:00 – 19:00", "Sunday · 10:00 – 17:00"]} />
      </div>

      <div className="glass-strong rounded-3xl overflow-hidden h-[400px]">
        <iframe
          title="Vins Watch — Negombo"
          src="https://www.google.com/maps?q=43+Greens+Rd+Negombo&output=embed"
          className="w-full h-full border-0"
          loading="lazy"
        />
      </div>
    </div>
  );
}

function Info({ icon: Icon, title, lines }: { icon: any; title: string; lines: string[] }) {
  return (
    <div className="glass rounded-2xl p-6 text-center">
      <Icon className="w-6 h-6 mx-auto text-[var(--color-gold)]" />
      <div className="font-display text-xl mt-3">{title}</div>
      {lines.map((l) => (
        <div key={l} className="text-sm text-muted-foreground">{l}</div>
      ))}
    </div>
  );
}
