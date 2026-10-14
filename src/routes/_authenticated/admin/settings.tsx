import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: AdminSettings,
});

function AdminSettings() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["store-settings"],
    queryFn: async () =>
      (await supabase.from("store_settings").select("*").eq("id", 1).maybeSingle()).data,
  });

  const [form, setForm] = useState({
    notification_email: "",
    whatsapp_number: "",
    callmebot_api_key: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) {
      setForm({
        notification_email: data.notification_email ?? "",
        whatsapp_number: data.whatsapp_number ?? "",
        callmebot_api_key: data.callmebot_api_key ?? "",
      });
    }
  }, [data]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = form.notification_email.trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return toast.error("Enter a valid email address");
    }
    setSaving(true);
    const { error } = await supabase.from("store_settings").upsert({
      id: 1,
      notification_email: email || null,
      whatsapp_number: form.whatsapp_number.trim() || null,
      callmebot_api_key: form.callmebot_api_key.trim() || null,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Settings saved");
    qc.invalidateQueries({ queryKey: ["store-settings"] });
  };

  return (
    <div className="max-w-2xl">
      <h2 className="font-display text-2xl mb-1">Notification settings</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Where new order alerts are sent. Customers always receive their own confirmation email
        automatically.
      </p>

      {isLoading ? (
        <div className="glass rounded-2xl p-12 text-center text-muted-foreground">Loading…</div>
      ) : (
        <form onSubmit={save} className="glass-strong rounded-2xl p-6 space-y-5">
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              Admin notification email
            </span>
            <input
              type="email"
              value={form.notification_email}
              onChange={(e) => setForm({ ...form, notification_email: e.target.value })}
              placeholder="orders@vinswatch.lk"
              className="mt-1 w-full glass rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--color-gold)]"
            />
            <span className="text-xs text-muted-foreground">
              Receives a full order summary with a link to the admin orders page.
            </span>
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              WhatsApp number
            </span>
            <input
              value={form.whatsapp_number}
              onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })}
              placeholder="+94771234567"
              className="mt-1 w-full glass rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--color-gold)]"
            />
            <span className="text-xs text-muted-foreground">
              Include the country code, e.g. +94… . Leave blank to disable WhatsApp alerts.
            </span>
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              CallMeBot API key
            </span>
            <input
              value={form.callmebot_api_key}
              onChange={(e) => setForm({ ...form, callmebot_api_key: e.target.value })}
              placeholder="123456"
              className="mt-1 w-full glass rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--color-gold)]"
            />
            <span className="text-xs text-muted-foreground">
              Free WhatsApp alerts via CallMeBot. On the admin WhatsApp number, send{" "}
              <em>“I allow callmebot to send me messages”</em> to +34 644 51 95 23 and use the API
              key it replies with.
            </span>
          </label>

          <button disabled={saving} className="px-6 py-3 rounded-full btn-gold disabled:opacity-50">
            {saving ? "Saving…" : "Save settings"}
          </button>
        </form>
      )}
    </div>
  );
}
