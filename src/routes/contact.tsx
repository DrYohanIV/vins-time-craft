import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone, Clock, Send } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", body: "" });
  const [sending, setSending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    const { error } = await supabase.from("messages").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      subject: form.subject.trim() || null,
      body: form.body.trim(),
    });
    setSending(false);
    if (error) return toast.error("Couldn't send. Try again.");
    toast.success("Message sent! We'll be in touch.");
    setForm({ name: "", email: "", phone: "", subject: "", body: "" });
  };

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

      <div className="grid md:grid-cols-2 gap-5">
        <form onSubmit={submit} className="glass-strong rounded-3xl p-6 space-y-3">
          <h2 className="font-display text-2xl mb-2">Send us a message</h2>
          <div className="grid grid-cols-2 gap-3">
            <F label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <F label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <F label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required={false} />
            <F label="Subject" value={form.subject} onChange={(v) => setForm({ ...form, subject: v })} required={false} />
          </div>
          <F label="Message" multiline value={form.body} onChange={(v) => setForm({ ...form, body: v })} />
          <button disabled={sending} className="w-full py-3 rounded-full btn-gold inline-flex items-center justify-center gap-2 disabled:opacity-50">
            <Send className="w-4 h-4" /> {sending ? "Sending…" : "Send message"}
          </button>
        </form>
        <div className="glass-strong rounded-3xl overflow-hidden min-h-[400px]">
          <iframe
            title="Vins Watch — Negombo"
            src="https://www.google.com/maps?q=43+Greens+Rd+Negombo&output=embed"
            className="w-full h-full border-0 min-h-[400px]"
            loading="lazy"
          />
        </div>
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

function F({ label, value, onChange, type = "text", multiline, required = true }: { label: string; value: string; onChange: (v: string) => void; type?: string; multiline?: boolean; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      {multiline ? (
        <textarea required={required} value={value} onChange={(e) => onChange(e.target.value)} rows={4} className="mt-1 w-full glass rounded-xl px-3 py-2 text-sm outline-none focus:border-[var(--color-gold)]" />
      ) : (
        <input type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full glass rounded-xl px-3 py-2 text-sm outline-none focus:border-[var(--color-gold)]" />
      )}
    </label>
  );
}
