import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useRef, useState, useMemo } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Star, Flame, Percent, AlertTriangle, Upload, X, ImagePlus, Loader2, Search, CheckSquare } from "lucide-react";

const LOW_STOCK_THRESHOLD = 3;
const PAGE_SIZE = 10;
import { formatLKR } from "@/lib/cart";
import { WatchExcelImport } from "@/components/admin/watch-excel-import";


export const Route = createFileRoute("/_authenticated/admin/watches")({ component: AdminWatches });

type WatchForm = {
  id?: string;
  name: string;
  brand: string;
  description: string;
  price: string;
  stock: string;
  image_url: string;
  images: string[];
  featured: boolean;
  hot_seller: boolean;
};

const emptyForm: WatchForm = { name: "", brand: "", description: "", price: "", stock: "1", image_url: "", images: [], featured: false, hot_seller: false };

async function uploadFile(file: File): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("watch-images").upload(path, file, {
    cacheControl: "3600",
    contentType: file.type,
  });
  if (error) throw error;
  const { data } = supabase.storage.from("watch-images").getPublicUrl(path);
  return data.publicUrl;
}

function AdminWatches() {
  const qc = useQueryClient();
  const { data: watches } = useQuery({
    queryKey: ["admin-watches"],
    queryFn: async () => (await supabase.from("watches").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  const [editing, setEditing] = useState<WatchForm | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!watches) return [];
    const q = searchQuery.trim().toLowerCase();
    if (!q) return watches;
    return watches.filter(
      (w) =>
        w.name.toLowerCase().includes(q) ||
        w.brand.toLowerCase().includes(q)
    );
  }, [watches, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

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
      images: editing.images,
      featured: editing.featured,
      hot_seller: editing.hot_seller,
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
    qc.invalidateQueries({ queryKey: ["hot-sellers"] });
    qc.invalidateQueries({ queryKey: ["new-arrivals"] });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this watch?")) return;
    const { error } = await supabase.from("watches").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Watch deleted");
    qc.invalidateQueries({ queryKey: ["admin-watches"] });
    qc.invalidateQueries({ queryKey: ["watches"] });
  };

  const lowStock = watches?.filter((w) => w.stock <= LOW_STOCK_THRESHOLD) ?? [];

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <h2 className="font-display text-2xl">Watches</h2>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              placeholder="Search watches or brands…"
              className="w-full glass rounded-full pl-9 pr-4 py-2 text-sm outline-none focus:border-[var(--color-gold)]"
            />
          </div>
          <WatchExcelImport
            onImported={() => {
              qc.invalidateQueries({ queryKey: ["admin-watches"] });
              qc.invalidateQueries({ queryKey: ["watches"] });
              qc.invalidateQueries({ queryKey: ["featured-watches"] });
              qc.invalidateQueries({ queryKey: ["hot-sellers"] });
              qc.invalidateQueries({ queryKey: ["new-arrivals"] });
            }}
          />
          <button onClick={() => setEditing({ ...emptyForm })} className="px-4 py-2 rounded-full btn-gold text-sm inline-flex items-center gap-2 shrink-0">
            <Plus className="w-4 h-4" /> Add watch
          </button>

        </div>
      </div>

      {lowStock.length > 0 && (
        <div className="glass rounded-2xl p-4 mb-4 border border-amber-500/40 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-sm">
            <div className="font-medium text-amber-300">Low stock alert</div>
            <div className="text-muted-foreground mt-0.5">
              {lowStock.length} watch{lowStock.length === 1 ? "" : "es"} at or below {LOW_STOCK_THRESHOLD} units:{" "}
              {lowStock.map((w) => `${w.name} (${w.stock})`).join(", ")}
            </div>
          </div>
        </div>
      )}

      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-left text-muted-foreground border-b border-[var(--color-border)]">
            <tr><th className="p-3">Watch</th><th className="p-3">Brand</th><th className="p-3">Price</th><th className="p-3">Stock</th><th className="p-3">Images</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {paginated.map((w) => (
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
                <td className="p-3">
                  {w.stock === 0 ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-rose-500/20 text-rose-300">Out of stock</span>
                  ) : w.stock <= LOW_STOCK_THRESHOLD ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-amber-500/20 text-amber-300">
                      <AlertTriangle className="w-3 h-3" /> {w.stock} left
                    </span>
                  ) : (
                    w.stock
                  )}
                </td>
                <td className="p-3 text-muted-foreground">{1 + (w.images?.length ?? 0)}</td>
                <td className="p-3 text-right">
                  <button onClick={() => setEditing({ id: w.id, name: w.name, brand: w.brand, description: w.description ?? "", price: String(w.price), stock: String(w.stock), image_url: w.image_url ?? "", images: w.images ?? [], featured: w.featured, hot_seller: (w as any).hot_seller ?? false })} className="p-2 hover:text-[var(--color-gold)]"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => remove(w.id)} className="p-2 hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {!paginated.length && (
              <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">{searchQuery ? "No watches match your search." : "No watches yet. Add your first."}</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm">
          <div className="text-muted-foreground">
            Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg glass text-sm disabled:opacity-40 hover:bg-white/5"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-sm ${p === currentPage ? "btn-gold" : "glass hover:bg-white/5"}`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg glass text-sm disabled:opacity-40 hover:bg-white/5"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-auto" onClick={() => setEditing(null)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={save} className="glass-strong rounded-3xl p-6 w-full max-w-2xl space-y-3 my-auto">
            <h3 className="font-display text-2xl">{editing.id ? "Edit watch" : "Add watch"}</h3>
            <Input label="Name" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} />
            <Input label="Brand" value={editing.brand} onChange={(v) => setEditing({ ...editing, brand: v })} />
            <Input label="Description" multiline value={editing.description} onChange={(v) => setEditing({ ...editing, description: v })} required={false} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Price (LKR)" type="number" value={editing.price} onChange={(v) => setEditing({ ...editing, price: v })} />
              <Input label="Stock" type="number" value={editing.stock} onChange={(v) => setEditing({ ...editing, stock: v })} />
            </div>

            <MainImageField value={editing.image_url} onChange={(v) => setEditing({ ...editing, image_url: v })} />
            <GalleryField values={editing.images} onChange={(v) => setEditing({ ...editing, images: v })} />

            <div className="flex flex-col sm:flex-row gap-3">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} />
                New arrival (featured)
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editing.hot_seller} onChange={(e) => setEditing({ ...editing, hot_seller: e.target.checked })} />
                Hot seller
              </label>
            </div>
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

function MainImageField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const pick = async (file: File) => {
    setBusy(true);
    try {
      const url = await uploadFile(file);
      onChange(url);
      toast.success("Main image uploaded");
    } catch (e: any) {
      toast.error(e.message ?? "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Main image</div>
      <div className="flex items-start gap-3">
        <div className="relative w-28 h-28 rounded-xl overflow-hidden shrink-0 glass flex items-center justify-center">
          {value ? (
            <>
              <img src={value} alt="" className="w-full h-full object-cover" />
              <button type="button" onClick={() => onChange("")} className="absolute top-1 right-1 bg-black/70 rounded-full p-1 hover:bg-black">
                <X className="w-3 h-3" />
              </button>
            </>
          ) : (
            <ImagePlus className="w-6 h-6 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 space-y-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => ref.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full btn-glass text-sm disabled:opacity-50"
          >
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {value ? "Replace image" : "Upload image"}
          </button>
          <input
            ref={ref}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => e.target.files?.[0] && pick(e.target.files[0])}
          />
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="…or paste an image URL"
            className="w-full glass rounded-xl px-3 py-2 text-sm outline-none focus:border-[var(--color-gold)]"
          />
        </div>
      </div>
    </div>
  );
}

function GalleryField({ values, onChange }: { values: string[]; onChange: (v: string[]) => void }) {
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const pick = async (files: FileList) => {
    setBusy(true);
    try {
      const uploaded = await Promise.all(Array.from(files).map(uploadFile));
      onChange([...values, ...uploaded]);
      toast.success(`${uploaded.length} image${uploaded.length === 1 ? "" : "s"} added`);
    } catch (e: any) {
      toast.error(e.message ?? "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1 flex items-center justify-between">
        <span>Gallery (additional images)</span>
        <span className="text-[10px] opacity-70">{values.length} added</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {values.map((url, i) => (
          <div key={url + i} className="relative w-20 h-20 rounded-lg overflow-hidden glass">
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button type="button" onClick={() => onChange(values.filter((_, j) => j !== i))} className="absolute top-0.5 right-0.5 bg-black/70 rounded-full p-1 hover:bg-black">
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        <button
          type="button"
          disabled={busy}
          onClick={() => ref.current?.click()}
          className="w-20 h-20 rounded-lg glass flex items-center justify-center hover:border-[var(--color-gold)] disabled:opacity-50"
        >
          {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5 text-muted-foreground" />}
        </button>
        <input
          ref={ref}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => e.target.files?.length && pick(e.target.files)}
        />
      </div>
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
