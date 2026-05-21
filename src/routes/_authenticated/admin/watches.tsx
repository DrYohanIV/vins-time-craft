import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Star, AlertTriangle } from "lucide-react";

const LOW_STOCK_THRESHOLD = 3;
import { formatLKR } from "@/lib/cart";

export const Route = createFileRoute("/_authenticated/admin/watches")({ component: AdminWatches });

type WatchForm = {
  id?: string;
  name: string;
  brand: string;
  description: string;
  price: string;
  stock: string;
  image_url: string;
  featured: boolean;
};

const emptyForm: WatchForm = { name: "", brand: "", description: "", price: "", stock: "1", image_url: "", featured: false };

function AdminWatches() {
  const qc = useQueryClient();
  const { data: watches } = useQuery({
    queryKey: ["admin-watches"],
    queryFn: async () => (await supabase.from("watches").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  const [editing, setEditing] = useState<WatchForm | null>(null);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const payload = {
      name: editing.name,
      brand: editing.brand,
      description: editing.description || null,
      price: Number(editing.price),
      stock: Number(editing.stock),
      image_url: editing.image_url || null,
      featured: editing.featured,
    };
    const { error } = editing.id
      ? await supabase.from("watches").update(payload).eq("id", editing.id)
      : await supabase.from("watches").insert(payload);
    if (error) return toast.error(error.message);
    toast.success(editing.id ? "Watch updated" : "Watch added");
    setEditing(null);
    qc.invalidateQueries({ queryKey: ["admin-watches"] });
    qc.invalidateQueries({ queryKey: ["watches"] });
    qc.invalidateQueries({ queryKey: ["featured-watches"] });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this watch?")) return;
    const { error } = await supabase.from("watches").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Watch deleted");
    qc.invalidateQueries({ queryKey: ["admin-watches"] });
    qc.invalidateQueries({ queryKey: ["watches"] });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-display text-2xl">Watches</h2>
        <button onClick={() => setEditing({ ...emptyForm })} className="px-4 py-2 rounded-full btn-gold text-sm inline-flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add watch
        </button>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-left text-muted-foreground border-b border-[var(--color-border)]">
            <tr><th className="p-3">Watch</th><th className="p-3">Brand</th><th className="p-3">Price</th><th className="p-3">Stock</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {watches?.map((w) => (
              <tr key={w.id} className="border-b border-[var(--color-border)] last:border-0">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0" style={{ background: "var(--gradient-bg)" }}>
                      {w.image_url && <img src={w.image_url} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div>
                      <div className="font-medium flex items-center gap-1">{w.name}{w.featured && <Star className="w-3 h-3 text-[var(--color-gold)] fill-[var(--color-gold)]" />}</div>
                    </div>
                  </div>
                </td>
                <td className="p-3 text-muted-foreground">{w.brand}</td>
                <td className="p-3">{formatLKR(Number(w.price))}</td>
                <td className="p-3">{w.stock}</td>
                <td className="p-3 text-right">
                  <button onClick={() => setEditing({ id: w.id, name: w.name, brand: w.brand, description: w.description ?? "", price: String(w.price), stock: String(w.stock), image_url: w.image_url ?? "", featured: w.featured })} className="p-2 hover:text-[var(--color-gold)]"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => remove(w.id)} className="p-2 hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {!watches?.length && (
              <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No watches yet. Add your first.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-auto" onClick={() => setEditing(null)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={save} className="glass-strong rounded-3xl p-6 w-full max-w-lg space-y-3 my-auto">
            <h3 className="font-display text-2xl">{editing.id ? "Edit watch" : "Add watch"}</h3>
            <Input label="Name" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} />
            <Input label="Brand" value={editing.brand} onChange={(v) => setEditing({ ...editing, brand: v })} />
            <Input label="Description" multiline value={editing.description} onChange={(v) => setEditing({ ...editing, description: v })} required={false} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Price (LKR)" type="number" value={editing.price} onChange={(v) => setEditing({ ...editing, price: v })} />
              <Input label="Stock" type="number" value={editing.stock} onChange={(v) => setEditing({ ...editing, stock: v })} />
            </div>
            <Input label="Image URL" value={editing.image_url} onChange={(v) => setEditing({ ...editing, image_url: v })} required={false} placeholder="https://…" />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} />
              Feature on homepage
            </label>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setEditing(null)} className="flex-1 py-2.5 rounded-full btn-glass">Cancel</button>
              <button className="flex-1 py-2.5 rounded-full btn-gold">{editing.id ? "Save" : "Add watch"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function Input({ label, value, onChange, type = "text", multiline, required = true, placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; multiline?: boolean; required?: boolean; placeholder?: string }) {
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
