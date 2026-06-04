import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Modal, Actions, Input } from "./promotions";

export const Route = createFileRoute("/_authenticated/admin/brand-categories")({ component: AdminBrandCategories });

type Form = { id?: string; name: string; image_url: string; sort_order: string; active: boolean };
const empty: Form = { name: "", image_url: "", sort_order: "0", active: true };

function AdminBrandCategories() {
  const qc = useQueryClient();
  const { data: rows } = useQuery({
    queryKey: ["admin-brand-categories"],
    queryFn: async () => (await supabase.from("brand_categories").select("*").order("sort_order")).data ?? [],
  });
  const [editing, setEditing] = useState<Form | null>(null);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const payload = {
      name: editing.name,
      image_url: editing.image_url || null,
      active: editing.active,
      sort_order: Number(editing.sort_order) || 0,
    };
    const { error } = editing.id
      ? await supabase.from("brand_categories").update(payload).eq("id", editing.id)
      : await supabase.from("brand_categories").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEditing(null);
    qc.invalidateQueries({ queryKey: ["admin-brand-categories"] });
    qc.invalidateQueries({ queryKey: ["home-brand-categories"] });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("brand_categories").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin-brand-categories"] });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-display text-2xl">Brand Categories</h2>
        <button onClick={() => setEditing({ ...empty })} className="px-4 py-2 rounded-full btn-gold text-sm inline-flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add brand
        </button>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {rows?.map((b) => (
          <div key={b.id} className="glass rounded-2xl overflow-hidden">
            {b.image_url ? (
              <img src={b.image_url} alt="" className="w-full h-32 object-cover" />
            ) : (
              <div className="w-full h-32 flex items-center justify-center text-muted-foreground text-sm glass">No image</div>
            )}
            <div className="p-4 flex justify-between gap-3 items-center">
              <div>
                <div className="font-display text-lg">{b.name} {!b.active && <span className="text-xs text-muted-foreground ml-2">(inactive)</span>}</div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => setEditing({ id: b.id, name: b.name, image_url: b.image_url ?? "", sort_order: String(b.sort_order), active: b.active })} className="p-2 hover:text-[var(--color-gold)]"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => remove(b.id)} className="p-2 hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
        {!rows?.length && <div className="md:col-span-3 glass rounded-2xl p-12 text-center text-muted-foreground">No brand categories yet.</div>}
      </div>

      {editing && (
        <Modal onClose={() => setEditing(null)}>
          <form onSubmit={save} className="space-y-3">
            <h3 className="font-display text-2xl">{editing.id ? "Edit" : "Add"} brand category</h3>
            <Input label="Brand name" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} />
            <Input label="Image URL" value={editing.image_url} onChange={(v) => setEditing({ ...editing, image_url: v })} required={false} placeholder="https://…" />
            <Input label="Sort order" type="number" value={editing.sort_order} onChange={(v) => setEditing({ ...editing, sort_order: v })} />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} /> Active</label>
            <Actions onCancel={() => setEditing(null)} label={editing.id ? "Save" : "Add"} />
          </form>
        </Modal>
      )}
    </div>
  );
}
