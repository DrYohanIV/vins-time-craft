import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Upload, Loader2, X, ImagePlus } from "lucide-react";
import { Modal, Actions, Input } from "./promotions";

export const Route = createFileRoute("/_authenticated/admin/brands")({ component: AdminBrands });

type Form = { id?: string; name: string; image_url: string; sort_order: string; active: boolean };
const empty: Form = { name: "", image_url: "", sort_order: "0", active: true };

async function uploadFile(file: File): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `brand-${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("watch-images").upload(path, file, { cacheControl: "3600", contentType: file.type });
  if (error) throw error;
  return supabase.storage.from("watch-images").getPublicUrl(path).data.publicUrl;
}

function AdminBrands() {
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
      sort_order: Number(editing.sort_order) || 0,
      active: editing.active,
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
        <h2 className="font-display text-2xl">Brand categories</h2>
        <button onClick={() => setEditing({ ...empty })} className="px-4 py-2 rounded-full btn-gold text-sm inline-flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add brand
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {rows?.map((b) => (
          <div key={b.id} className="glass rounded-2xl overflow-hidden">
            <div className="aspect-square bg-black/30 flex items-center justify-center">
              {b.image_url ? <img src={b.image_url} alt={b.name} className="w-full h-full object-cover" /> : <ImagePlus className="w-8 h-8 text-muted-foreground" />}
            </div>
            <div className="p-3 flex justify-between items-center gap-2">
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{b.name}</div>
                {!b.active && <div className="text-[10px] text-muted-foreground">inactive</div>}
              </div>
              <div className="flex gap-0.5 shrink-0">
                <button onClick={() => setEditing({ id: b.id, name: b.name, image_url: b.image_url ?? "", sort_order: String(b.sort_order), active: b.active })} className="p-1.5 hover:text-[var(--color-gold)]"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => remove(b.id)} className="p-1.5 hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </div>
        ))}
        {!rows?.length && <div className="col-span-full glass rounded-2xl p-12 text-center text-muted-foreground">No brand categories yet.</div>}
      </div>

      {editing && (
        <Modal onClose={() => setEditing(null)}>
          <form onSubmit={save} className="space-y-3">
            <h3 className="font-display text-2xl">{editing.id ? "Edit" : "Add"} brand</h3>
            <Input label="Name" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} />
            <ImageField value={editing.image_url} onChange={(v) => setEditing({ ...editing, image_url: v })} />
            <Input label="Sort order" type="number" value={editing.sort_order} onChange={(v) => setEditing({ ...editing, sort_order: v })} />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} /> Active</label>
            <Actions onCancel={() => setEditing(null)} label={editing.id ? "Save" : "Add"} />
          </form>
        </Modal>
      )}
    </div>
  );
}

function ImageField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  const pick = async (file: File) => {
    setBusy(true);
    try { onChange(await uploadFile(file)); toast.success("Uploaded"); }
    catch (e: any) { toast.error(e.message ?? "Upload failed"); }
    finally { setBusy(false); }
  };
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Image</div>
      <div className="flex items-start gap-3">
        <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 glass flex items-center justify-center">
          {value ? (
            <>
              <img src={value} alt="" className="w-full h-full object-cover" />
              <button type="button" onClick={() => onChange("")} className="absolute top-1 right-1 bg-black/70 rounded-full p-1"><X className="w-3 h-3" /></button>
            </>
          ) : <ImagePlus className="w-6 h-6 text-muted-foreground" />}
        </div>
        <div className="flex-1 space-y-2">
          <button type="button" disabled={busy} onClick={() => ref.current?.click()} className="inline-flex items-center gap-2 px-4 py-2 rounded-full btn-glass text-sm disabled:opacity-50">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {value ? "Replace" : "Upload"}
          </button>
          <input ref={ref} type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && pick(e.target.files[0])} />
          <input type="url" value={value} onChange={(e) => onChange(e.target.value)} placeholder="…or paste URL" className="w-full glass rounded-xl px-3 py-2 text-sm outline-none focus:border-[var(--color-gold)]" />
        </div>
      </div>
    </div>
  );
}
