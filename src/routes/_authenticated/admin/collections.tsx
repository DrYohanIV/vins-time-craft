import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Upload, Loader2, X, ImagePlus } from "lucide-react";
import { Modal, Actions, Input } from "./promotions";

export const Route = createFileRoute("/_authenticated/admin/collections")({ component: AdminCollections });

type Size = "small" | "medium" | "large" | "wide" | "tall";
type Form = { id?: string; title: string; subtitle: string; image_url: string; link_url: string; size: Size; sort_order: string; active: boolean };
const empty: Form = { title: "", subtitle: "", image_url: "", link_url: "", size: "medium", sort_order: "0", active: true };

async function uploadFile(file: File): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `collection-${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("watch-images").upload(path, file, { cacheControl: "3600", contentType: file.type });
  if (error) throw error;
  return supabase.storage.from("watch-images").getPublicUrl(path).data.publicUrl;
}

function AdminCollections() {
  const qc = useQueryClient();
  const { data: rows } = useQuery({
    queryKey: ["admin-collections"],
    queryFn: async () => (await supabase.from("collections").select("*").order("sort_order")).data ?? [],
  });
  const [editing, setEditing] = useState<Form | null>(null);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const payload = {
      title: editing.title,
      subtitle: editing.subtitle || null,
      image_url: editing.image_url || null,
      link_url: editing.link_url || null,
      size: editing.size,
      sort_order: Number(editing.sort_order) || 0,
      active: editing.active,
    };
    const { error } = editing.id
      ? await supabase.from("collections").update(payload).eq("id", editing.id)
      : await supabase.from("collections").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEditing(null);
    qc.invalidateQueries({ queryKey: ["admin-collections"] });
    qc.invalidateQueries({ queryKey: ["home-collections"] });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("collections").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin-collections"] });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-display text-2xl">Collections</h2>
        <button onClick={() => setEditing({ ...empty })} className="px-4 py-2 rounded-full btn-gold text-sm inline-flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add collection
        </button>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {rows?.map((c) => (
          <div key={c.id} className="glass rounded-2xl overflow-hidden">
            {c.image_url && <img src={c.image_url} alt={c.title} className="w-full h-36 object-cover" />}
            <div className="p-3 flex justify-between items-start gap-2">
              <div className="min-w-0">
                <div className="font-medium truncate">{c.title} <span className="text-[10px] text-muted-foreground uppercase ml-1">{c.size}</span></div>
                {c.subtitle && <div className="text-xs text-muted-foreground truncate">{c.subtitle}</div>}
                {!c.active && <div className="text-[10px] text-muted-foreground">inactive</div>}
              </div>
              <div className="flex gap-0.5 shrink-0">
                <button onClick={() => setEditing({ id: c.id, title: c.title, subtitle: c.subtitle ?? "", image_url: c.image_url ?? "", link_url: c.link_url ?? "", size: c.size as Size, sort_order: String(c.sort_order), active: c.active })} className="p-1.5 hover:text-[var(--color-gold)]"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => remove(c.id)} className="p-1.5 hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </div>
        ))}
        {!rows?.length && <div className="col-span-full glass rounded-2xl p-12 text-center text-muted-foreground">No collections yet.</div>}
      </div>

      {editing && (
        <Modal onClose={() => setEditing(null)}>
          <form onSubmit={save} className="space-y-3">
            <h3 className="font-display text-2xl">{editing.id ? "Edit" : "Add"} collection</h3>
            <Input label="Title" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} />
            <Input label="Subtitle" value={editing.subtitle} onChange={(v) => setEditing({ ...editing, subtitle: v })} required={false} />
            <ImageField value={editing.image_url} onChange={(v) => setEditing({ ...editing, image_url: v })} />
            <Input label="Link URL (e.g. /shop?brand=Rolex)" value={editing.link_url} onChange={(v) => setEditing({ ...editing, link_url: v })} required={false} />
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Size</span>
              <select value={editing.size} onChange={(e) => setEditing({ ...editing, size: e.target.value as Size })} className="mt-1 w-full glass rounded-xl px-3 py-2 text-sm outline-none">
                <option value="small">Small (1×1)</option>
                <option value="medium">Medium (2×1)</option>
                <option value="large">Large (2×2)</option>
                <option value="wide">Wide (3×1)</option>
                <option value="tall">Tall (1×2)</option>
              </select>
            </label>
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
        <div className="relative w-28 h-20 rounded-xl overflow-hidden shrink-0 glass flex items-center justify-center">
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
