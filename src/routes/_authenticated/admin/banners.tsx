import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Modal, Actions, Input } from "./promotions";

export const Route = createFileRoute("/_authenticated/admin/banners")({ component: AdminBanners });

const SIZES = ["small", "medium", "large", "full", "tall"] as const;
type Form = { id?: string; title: string; subtitle: string; image_url: string; cta_label: string; cta_url: string; active: boolean; sort_order: string; size: string };
const empty: Form = { title: "", subtitle: "", image_url: "", cta_label: "", cta_url: "", active: true, sort_order: "0", size: "medium" };

function AdminBanners() {
  const qc = useQueryClient();
  const { data: rows } = useQuery({
    queryKey: ["admin-banners"],
    queryFn: async () => (await supabase.from("banners").select("*").order("sort_order")).data ?? [],
  });
  const [editing, setEditing] = useState<Form | null>(null);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const payload = {
      title: editing.title,
      subtitle: editing.subtitle || null,
      image_url: editing.image_url || null,
      cta_label: editing.cta_label || null,
      cta_url: editing.cta_url || null,
      active: editing.active,
      sort_order: Number(editing.sort_order) || 0,
      size: editing.size || "medium",
    };
    const { error } = editing.id
      ? await supabase.from("banners").update(payload).eq("id", editing.id)
      : await supabase.from("banners").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEditing(null);
    qc.invalidateQueries({ queryKey: ["admin-banners"] });
    qc.invalidateQueries({ queryKey: ["home-banners"] });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("banners").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin-banners"] });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-display text-2xl">Homepage banners</h2>
        <button onClick={() => setEditing({ ...empty })} className="px-4 py-2 rounded-full btn-gold text-sm inline-flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add banner
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {rows?.map((b) => (
          <div key={b.id} className="glass rounded-2xl overflow-hidden">
            {b.image_url && <img src={b.image_url} alt="" className="w-full h-40 object-cover" />}
            <div className="p-4 flex justify-between gap-3">
              <div>
                <div className="font-display text-lg">{b.title} {!b.active && <span className="text-xs text-muted-foreground ml-2">(inactive)</span>}</div>
                {b.subtitle && <div className="text-sm text-muted-foreground">{b.subtitle}</div>}
                <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">Size: {b.size ?? "medium"}</div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => setEditing({ id: b.id, title: b.title, subtitle: b.subtitle ?? "", image_url: b.image_url ?? "", cta_label: b.cta_label ?? "", cta_url: b.cta_url ?? "", active: b.active, sort_order: String(b.sort_order), size: b.size ?? "medium" })} className="p-2 hover:text-[var(--color-gold)]"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => remove(b.id)} className="p-2 hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
        {!rows?.length && <div className="md:col-span-2 glass rounded-2xl p-12 text-center text-muted-foreground">No banners yet.</div>}
      </div>

      {editing && (
        <Modal onClose={() => setEditing(null)}>
          <form onSubmit={save} className="space-y-3">
            <h3 className="font-display text-2xl">{editing.id ? "Edit" : "Add"} banner</h3>
            <Input label="Title" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} />
            <Input label="Subtitle" value={editing.subtitle} onChange={(v) => setEditing({ ...editing, subtitle: v })} required={false} multiline />
            <Input label="Image URL" value={editing.image_url} onChange={(v) => setEditing({ ...editing, image_url: v })} required={false} placeholder="https://…" />
            <div className="grid grid-cols-2 gap-3">
              <Input label="CTA label" value={editing.cta_label} onChange={(v) => setEditing({ ...editing, cta_label: v })} required={false} />
              <Input label="CTA URL" value={editing.cta_url} onChange={(v) => setEditing({ ...editing, cta_url: v })} required={false} />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Size</label>
              <select value={editing.size} onChange={(e) => setEditing({ ...editing, size: e.target.value })} className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm">
                {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
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
