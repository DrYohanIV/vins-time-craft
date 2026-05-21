import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/promotions")({ component: AdminPromotions });

type Form = { id?: string; title: string; subtitle: string; cta_label: string; cta_url: string; active: boolean; sort_order: string };
const empty: Form = { title: "", subtitle: "", cta_label: "", cta_url: "", active: true, sort_order: "0" };

function AdminPromotions() {
  const qc = useQueryClient();
  const { data: rows } = useQuery({
    queryKey: ["admin-promotions"],
    queryFn: async () => (await supabase.from("promotions").select("*").order("sort_order")).data ?? [],
  });
  const [editing, setEditing] = useState<Form | null>(null);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const payload = {
      title: editing.title,
      subtitle: editing.subtitle || null,
      cta_label: editing.cta_label || null,
      cta_url: editing.cta_url || null,
      active: editing.active,
      sort_order: Number(editing.sort_order) || 0,
    };
    const { error } = editing.id
      ? await supabase.from("promotions").update(payload).eq("id", editing.id)
      : await supabase.from("promotions").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEditing(null);
    qc.invalidateQueries({ queryKey: ["admin-promotions"] });
    qc.invalidateQueries({ queryKey: ["home-promotions"] });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("promotions").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin-promotions"] });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-display text-2xl">Promotions</h2>
        <button onClick={() => setEditing({ ...empty })} className="px-4 py-2 rounded-full btn-gold text-sm inline-flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add promotion
        </button>
      </div>
      <div className="space-y-3">
        {rows?.map((p) => (
          <div key={p.id} className="glass rounded-2xl p-5 flex justify-between gap-3">
            <div>
              <div className="font-display text-lg">{p.title} {!p.active && <span className="text-xs text-muted-foreground ml-2">(inactive)</span>}</div>
              {p.subtitle && <div className="text-sm text-muted-foreground">{p.subtitle}</div>}
              {p.cta_label && <div className="text-xs text-[var(--color-gold-soft)] mt-1">{p.cta_label} → {p.cta_url}</div>}
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => setEditing({ id: p.id, title: p.title, subtitle: p.subtitle ?? "", cta_label: p.cta_label ?? "", cta_url: p.cta_url ?? "", active: p.active, sort_order: String(p.sort_order) })} className="p-2 hover:text-[var(--color-gold)]"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => remove(p.id)} className="p-2 hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {!rows?.length && <div className="glass rounded-2xl p-12 text-center text-muted-foreground">No promotions yet.</div>}
      </div>

      {editing && (
        <Modal onClose={() => setEditing(null)}>
          <form onSubmit={save} className="space-y-3">
            <h3 className="font-display text-2xl">{editing.id ? "Edit" : "Add"} promotion</h3>
            <Input label="Title" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} />
            <Input label="Subtitle" value={editing.subtitle} onChange={(v) => setEditing({ ...editing, subtitle: v })} required={false} multiline />
            <div className="grid grid-cols-2 gap-3">
              <Input label="CTA label" value={editing.cta_label} onChange={(v) => setEditing({ ...editing, cta_label: v })} required={false} />
              <Input label="CTA URL" value={editing.cta_url} onChange={(v) => setEditing({ ...editing, cta_url: v })} required={false} />
            </div>
            <Input label="Sort order" type="number" value={editing.sort_order} onChange={(v) => setEditing({ ...editing, sort_order: v })} />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} /> Active</label>
            <Actions onCancel={() => setEditing(null)} label={editing.id ? "Save" : "Add"} />
          </form>
        </Modal>
      )}
    </div>
  );
}

export function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-auto" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="glass-strong rounded-3xl p-6 w-full max-w-lg my-auto">{children}</div>
    </div>
  );
}
export function Actions({ onCancel, label }: { onCancel: () => void; label: string }) {
  return (
    <div className="flex gap-2 pt-2">
      <button type="button" onClick={onCancel} className="flex-1 py-2.5 rounded-full btn-glass">Cancel</button>
      <button className="flex-1 py-2.5 rounded-full btn-gold">{label}</button>
    </div>
  );
}
export function Input({ label, value, onChange, type = "text", multiline, required = true, placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; multiline?: boolean; required?: boolean; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} required={required} placeholder={placeholder} rows={3} className="mt-1 w-full glass rounded-xl px-3 py-2 text-sm outline-none focus:border-[var(--color-gold)]" />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} placeholder={placeholder} className="mt-1 w-full glass rounded-xl px-3 py-2 text-sm outline-none focus:border-[var(--color-gold)]" />
      )}
    </label>
  );
}
