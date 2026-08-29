import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useRef, useState, useMemo } from "react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { unzipSync } from "fflate";
import {
  Plus,
  Pencil,
  Trash2,
  Star,
  AlertTriangle,
  Upload,
  X,
  ImagePlus,
  Loader2,
  Search,
  FileSpreadsheet,
  Download,
  CheckCircle2,
} from "lucide-react";

const LOW_STOCK_THRESHOLD = 3;
const PAGE_SIZE = 10;
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
  images: string[];
  featured: boolean;
  hot_seller: boolean;
};

const emptyForm: WatchForm = {
  name: "",
  brand: "",
  description: "",
  price: "",
  stock: "1",
  image_url: "",
  images: [],
  featured: false,
  hot_seller: false,
};

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
    queryFn: async () =>
      (await supabase.from("watches").select("*").order("created_at", { ascending: false })).data ??
      [],
  });
  const [editing, setEditing] = useState<WatchForm | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pct, setPct] = useState("");
  const [applying, setApplying] = useState(false);

  const filtered = useMemo(() => {
    if (!watches) return [];
    const q = searchQuery.trim().toLowerCase();
    if (!q) return watches;
    return watches.filter(
      (w) => w.name.toLowerCase().includes(q) || w.brand.toLowerCase().includes(q),
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

  const filteredIds = filtered.map((w) => w.id);
  const allSelected = filteredIds.length > 0 && filteredIds.every((id) => selected.has(id));

  const toggleOne = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(filteredIds));

  const applyPercent = async () => {
    const p = Number(pct);
    if (!pct.trim() || !Number.isFinite(p) || p === 0)
      return toast.error("Enter a non-zero percentage, e.g. 10 or -5");
    if (!selected.size || !watches) return;
    if (
      !confirm(
        `Change price by ${p > 0 ? "+" : ""}${p}% for ${selected.size} watch${selected.size === 1 ? "" : "es"}?`,
      )
    )
      return;
    setApplying(true);
    try {
      const targets = watches.filter((w) => selected.has(w.id));
      const results = await Promise.all(
        targets.map((w) =>
          supabase
            .from("watches")
            .update({ price: Math.round(Number(w.price) * (1 + p / 100)) })
            .eq("id", w.id),
        ),
      );
      const firstError = results.map((r) => r.error).find(Boolean);
      if (firstError) return toast.error(firstError.message);
      toast.success(
        `Price${selected.size === 1 ? "" : "s"} updated by ${p > 0 ? "+" : ""}${p}% for ${targets.length} watch${targets.length === 1 ? "" : "es"}`,
      );
      setSelected(new Set());
      setPct("");
      qc.invalidateQueries({ queryKey: ["admin-watches"] });
      qc.invalidateQueries({ queryKey: ["watches"] });
      qc.invalidateQueries({ queryKey: ["featured-watches"] });
      qc.invalidateQueries({ queryKey: ["hot-sellers"] });
      qc.invalidateQueries({ queryKey: ["new-arrivals"] });
    } finally {
      setApplying(false);
    }
  };

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
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search watches or brands…"
              className="w-full glass rounded-full pl-9 pr-4 py-2 text-sm outline-none focus:border-[var(--color-gold)]"
            />
          </div>
          <button
            onClick={() => setImportOpen(true)}
            className="px-4 py-2 rounded-full btn-glass text-sm inline-flex items-center gap-2 shrink-0"
          >
            <FileSpreadsheet className="w-4 h-4" /> Import Excel
          </button>
          <button
            onClick={() => setEditing({ ...emptyForm })}
            className="px-4 py-2 rounded-full btn-gold text-sm inline-flex items-center gap-2 shrink-0"
          >
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
              {lowStock.length} watch{lowStock.length === 1 ? "" : "es"} at or below{" "}
              {LOW_STOCK_THRESHOLD} units:{" "}
              {lowStock.map((w) => `${w.name} (${w.stock})`).join(", ")}
            </div>
          </div>
        </div>
      )}

      {selected.size > 0 && (
        <div className="glass rounded-2xl p-4 mb-4 flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          <div className="text-sm font-medium shrink-0">
            {selected.size} watch{selected.size === 1 ? "" : "es"} selected
          </div>
          <div className="flex items-center gap-2 flex-1 flex-wrap">
            <input
              type="number"
              step="any"
              value={pct}
              onChange={(e) => setPct(e.target.value)}
              placeholder="% e.g. 10 or -5"
              className="glass rounded-xl px-3 py-2 text-sm w-36 outline-none focus:border-[var(--color-gold)]"
            />
            <span className="text-sm text-muted-foreground">%</span>
            <button
              onClick={applyPercent}
              disabled={applying || !pct.trim()}
              className="px-4 py-2 rounded-full btn-gold text-sm inline-flex items-center gap-2 disabled:opacity-50"
            >
              {applying && <Loader2 className="w-4 h-4 animate-spin" />}
              Apply to {selected.size}
            </button>
            <span className="text-xs text-muted-foreground hidden md:inline">
              Positive raises prices, negative gives a discount. Rounded to the nearest rupee.
            </span>
            <button
              onClick={() => setSelected(new Set())}
              disabled={applying}
              className="ml-auto text-sm text-muted-foreground hover:text-foreground shrink-0"
            >
              Clear selection
            </button>
          </div>
        </div>
      )}

      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-left text-muted-foreground border-b border-[var(--color-border)]">
            <tr>
              <th className="p-3 w-8">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  aria-label="Select all"
                />
              </th>
              <th className="p-3">Watch</th>
              <th className="p-3">Brand</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Images</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((w) => (
              <tr key={w.id} className="border-b border-[var(--color-border)] last:border-0">
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selected.has(w.id)}
                    onChange={() => toggleOne(w.id)}
                    aria-label={`Select ${w.name}`}
                  />
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg overflow-hidden shrink-0"
                      style={{ background: "var(--gradient-bg)" }}
                    >
                      {w.image_url && (
                        <img src={w.image_url} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium flex items-center gap-1">
                        {w.name}
                        {w.featured && (
                          <Star className="w-3 h-3 text-[var(--color-gold)] fill-[var(--color-gold)]" />
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-3 text-muted-foreground">{w.brand}</td>
                <td className="p-3">{formatLKR(Number(w.price))}</td>
                <td className="p-3">
                  {w.stock === 0 ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-rose-500/20 text-rose-300">
                      Out of stock
                    </span>
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
                  <button
                    onClick={() =>
                      setEditing({
                        id: w.id,
                        name: w.name,
                        brand: w.brand,
                        description: w.description ?? "",
                        price: String(w.price),
                        stock: String(w.stock),
                        image_url: w.image_url ?? "",
                        images: w.images ?? [],
                        featured: w.featured,
                        hot_seller: (w as any).hot_seller ?? false,
                      })
                    }
                    className="p-2 hover:text-[var(--color-gold)]"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => remove(w.id)} className="p-2 hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {!paginated.length && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-muted-foreground">
                  {searchQuery
                    ? "No watches match your search."
                    : "No watches yet. Add your first."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm">
          <div className="text-muted-foreground">
            Showing {(currentPage - 1) * PAGE_SIZE + 1}–
            {Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}
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

      {importOpen && <ExcelImport onClose={() => setImportOpen(false)} />}

      {editing && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-auto"
          onClick={() => setEditing(null)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={save}
            className="glass-strong rounded-3xl p-6 w-full max-w-2xl space-y-3 my-auto"
          >
            <h3 className="font-display text-2xl">{editing.id ? "Edit watch" : "Add watch"}</h3>
            <Input
              label="Name"
              value={editing.name}
              onChange={(v) => setEditing({ ...editing, name: v })}
            />
            <Input
              label="Brand"
              value={editing.brand}
              onChange={(v) => setEditing({ ...editing, brand: v })}
            />
            <Input
              label="Description"
              multiline
              value={editing.description}
              onChange={(v) => setEditing({ ...editing, description: v })}
              required={false}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Price (LKR)"
                type="number"
                value={editing.price}
                onChange={(v) => setEditing({ ...editing, price: v })}
              />
              <Input
                label="Stock"
                type="number"
                value={editing.stock}
                onChange={(v) => setEditing({ ...editing, stock: v })}
              />
            </div>

            <MainImageField
              value={editing.image_url}
              onChange={(v) => setEditing({ ...editing, image_url: v })}
            />
            <GalleryField
              values={editing.images}
              onChange={(v) => setEditing({ ...editing, images: v })}
            />

            <div className="flex flex-col sm:flex-row gap-3">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editing.featured}
                  onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                />
                New arrival (featured)
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editing.hot_seller}
                  onChange={(e) => setEditing({ ...editing, hot_seller: e.target.checked })}
                />
                Hot seller
              </label>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="flex-1 py-2.5 rounded-full btn-glass"
              >
                Cancel
              </button>
              <button className="flex-1 py-2.5 rounded-full btn-gold">
                {editing.id ? "Save" : "Add watch"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

type ImportRow = {
  row: number;
  name: string;
  brand: string;
  description: string;
  price: string;
  stock: string;
  image_url: string;
  images: string[];
  embedded: File[];
  featured: boolean;
  hot_seller: boolean;
};

const HEADER_MAP: Record<keyof Omit<ImportRow, "row" | "embedded">, string[]> = {
  name: ["name", "title", "productname", "watchname", "modelname", "model"],
  brand: ["brand", "brandname", "company", "make"],
  description: ["description", "desc", "details", "about"],
  price: [
    "price",
    "pricelkr",
    "unitprice",
    "sellingprice",
    "cost",
    "rate",
    "mrp",
    "amount",
    "lkr",
    "rs",
  ],
  stock: ["stock", "qty", "quantity", "inventory", "stockqty", "availableqty", "count"],
  image_url: [
    "image",
    "imageurl",
    "mainimage",
    "imagelink",
    "photo",
    "photourl",
    "img",
    "imgurl",
    "thumbnail",
    "picture",
    "image1",
  ],
  images: [
    "images",
    "imageurls",
    "gallery",
    "galleryimages",
    "additionalimages",
    "moreimages",
    "otherimages",
  ],
  featured: ["featured", "isfeatured", "newarrival", "feature"],
  hot_seller: ["hotseller", "ishotseller", "bestseller", "isbestseller", "hot"],
};

function normHeader(h: string) {
  return h.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function toNumber(v: string): number | null {
  const cleaned = v.replace(/[^\d.,-]/g, "").replace(/,/g, "");
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function toBool(v: string) {
  return /^(true|yes|y|1)$/i.test(v.trim());
}

function validateRow(r: ImportRow): string | null {
  if (!r.name) return "Missing name";
  if (!r.brand) return "Missing brand";
  if (toNumber(r.price) === null || toNumber(r.price)! < 0) return "Invalid price";
  if (r.stock && !/^\d+$/.test(r.stock)) return "Invalid stock";
  return null;
}

const IMAGE_MIME: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  bmp: "image/bmp",
  avif: "image/avif",
};

function zipPath(baseDir: string, target: string): string {
  if (target.startsWith("/")) return target.slice(1);
  const out: string[] = [];
  for (const part of `${baseDir}/${target}`.split("/")) {
    if (!part || part === ".") continue;
    if (part === "..") out.pop();
    else out.push(part);
  }
  return out.join("/");
}

function relTarget(xml: string, predicate: (tag: string) => boolean): string | null {
  for (const tag of xml.match(/<Relationship\b[^>]*\/?>/g) ?? []) {
    if (!predicate(tag)) continue;
    const t = /\bTarget="([^"]+)"/.exec(tag);
    if (t) return t[1];
  }
  return null;
}

const relTargetById = (xml: string, id: string) =>
  relTarget(xml, (t) => new RegExp(`\\bId="${id}"`).test(t));
const relTargetByType = (xml: string, suffix: string) =>
  relTarget(xml, (t) => new RegExp(`\\bType="[^"]*/${suffix}"`).test(t));

function extractEmbeddedImages(buf: ArrayBuffer): Map<number, File[]> {
  const byRow = new Map<number, File[]>();
  let zip: Record<string, Uint8Array>;
  try {
    zip = unzipSync(new Uint8Array(buf));
  } catch {
    return byRow;
  }
  const text = (p: string) => (zip[p] ? new TextDecoder().decode(zip[p]) : "");
  const firstSheetTag = /<sheet\b[^>]*>/.exec(text("xl/workbook.xml"))?.[0] ?? "";
  const sheetRid = /\br:id="([^"]+)"/.exec(firstSheetTag)?.[1];
  if (!sheetRid) return byRow;
  const sheetPath = zipPath(
    "xl",
    relTargetById(text("xl/_rels/workbook.xml.rels"), sheetRid) ?? "",
  );
  if (!zip[sheetPath]) return byRow;
  const sheetDir = sheetPath.includes("/") ? sheetPath.replace(/\/[^/]+$/, "") : "";
  const drawingTarget = relTargetByType(
    text(sheetPath.replace(/([^/]+)$/, "_rels/$1.rels")),
    "drawing",
  );
  if (!drawingTarget) return byRow;
  const drawingPath = zipPath(sheetDir, drawingTarget);
  const drawingXml = text(drawingPath);
  if (!drawingXml) return byRow;
  const drawingRels = text(drawingPath.replace(/([^/]+)$/, "_rels/$1.rels"));

  for (const anchor of drawingXml.match(
    /<xdr:(?:two|one)CellAnchor\b[\s\S]*?<\/xdr:(?:two|one)CellAnchor>/g,
  ) ?? []) {
    const rows = [...anchor.matchAll(/<xdr:row>(\d+)<\/xdr:row>/g)].map((m) => parseInt(m[1], 10));
    const rid = /\br:embed="([^"]+)"/.exec(anchor)?.[1];
    if (!rows.length || !rid) continue;
    const dataIdx = Math.round((rows[0] + rows[rows.length - 1]) / 2) - 1;
    if (dataIdx < 0) continue;
    const mediaPath = zipPath(sheetDir, relTargetById(drawingRels, rid) ?? "");
    const bytes = zip[mediaPath];
    if (!bytes) continue;
    const fname = mediaPath.split("/").pop() ?? "image";
    const ext = (fname.split(".").pop() ?? "").toLowerCase();
    if (!(ext in IMAGE_MIME)) continue;
    const file = new File([new Uint8Array(bytes)], fname, { type: IMAGE_MIME[ext] });
    const list = byRow.get(dataIdx) ?? [];
    list.push(file);
    byRow.set(dataIdx, list);
  }
  return byRow;
}

async function parseSpreadsheet(file: File): Promise<{
  rows: ImportRow[];
  skipped: number;
  embeddedCount: number;
}> {
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: "" });
  const embeddedByRow = /\.csv$/i.test(file.name)
    ? new Map<number, File[]>()
    : extractEmbeddedImages(buf);
  const rows: ImportRow[] = [];
  let skipped = 0;
  json.forEach((raw, i) => {
    const lookup: Record<string, string> = {};
    for (const [k, v] of Object.entries(raw)) {
      const s = v instanceof Date ? v.toISOString() : String(v ?? "");
      lookup[normHeader(k)] = s.trim();
    }
    const get = (field: keyof typeof HEADER_MAP) => {
      for (const key of HEADER_MAP[field]) if (lookup[key]) return lookup[key];
      return "";
    };
    const r: ImportRow = {
      row: i + 2,
      name: get("name"),
      brand: get("brand"),
      description: get("description"),
      price: get("price"),
      stock: get("stock"),
      image_url: get("image_url"),
      images: get("images")
        ? get("images")
            .split(/[|;\n]+/)
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      embedded: embeddedByRow.get(i) ?? [],
      featured: toBool(get("featured")),
      hot_seller: toBool(get("hot_seller")),
    };
    if (!r.name && !r.brand && !r.price) {
      skipped++;
      return;
    }
    rows.push(r);
  });
  return {
    rows,
    skipped,
    embeddedCount: rows.reduce((n, r) => n + r.embedded.length, 0),
  };
}

function downloadTemplate() {
  const csv = [
    "Name,Brand,Description,Price,Stock,Image URL,Images,Featured,Hot Seller",
    'Seiko 5 Sports SNK809,Seiko,"Automatic watch with canvas strap",68500,12,https://example.com/main.jpg,https://example.com/2.jpg|https://example.com/3.jpg,Yes,No',
  ].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "watches-import-template.csv";
  a.click();
  URL.revokeObjectURL(url);
}

const IMPORT_CHUNK = 100;

function ExcelImport({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const [rows, setRows] = useState<ImportRow[] | null>(null);
  const [skipped, setSkipped] = useState(0);
  const [embeddedCount, setEmbeddedCount] = useState(0);
  const [fileName, setFileName] = useState("");
  const [busy, setBusy] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [importedCount, setImportedCount] = useState<number | null>(null);

  const invalid = rows?.map((r) => ({ r, error: validateRow(r) })).filter((x) => x.error) ?? [];
  const valid = rows?.filter((r) => !validateRow(r)) ?? [];

  const pickFile = async (file: File) => {
    setBusy(true);
    try {
      const res = await parseSpreadsheet(file);
      setRows(res.rows);
      setSkipped(res.skipped);
      setEmbeddedCount(res.embeddedCount);
      setFileName(file.name);
      setImportedCount(null);
      if (!res.rows.length) toast.error("No data rows found in this file");
      else if (res.embeddedCount)
        toast.success(
          `${res.embeddedCount} embedded picture${res.embeddedCount === 1 ? "" : "s"} found`,
        );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not read file");
    } finally {
      setBusy(false);
    }
  };

  const runImport = async () => {
    setBusy(true);
    setProgressText("");
    let done = 0;
    try {
      const totalImages = valid.reduce((n, r) => n + r.embedded.length, 0);
      let uploaded = 0;
      const payloads = [];
      for (const r of valid) {
        let mainUrl = r.image_url || null;
        let gallery = [...r.images];
        if (r.embedded.length) {
          const urls: string[] = [];
          for (const f of r.embedded) {
            setProgressText(`Uploading picture ${uploaded + 1}/${totalImages}…`);
            urls.push(await uploadFile(f));
            uploaded++;
          }
          mainUrl = urls[0];
          gallery = [...urls.slice(1), ...gallery];
        }
        payloads.push({
          name: r.name,
          brand: r.brand,
          description: r.description || null,
          price: toNumber(r.price)!,
          stock: r.stock ? parseInt(r.stock, 10) : 0,
          image_url: mainUrl,
          images: gallery,
          featured: r.featured,
          hot_seller: r.hot_seller,
        });
      }
      for (let i = 0; i < payloads.length; i += IMPORT_CHUNK) {
        setProgressText(
          `Saving watches ${Math.min(i + IMPORT_CHUNK, payloads.length)}/${payloads.length}…`,
        );
        const { error } = await supabase
          .from("watches")
          .insert(payloads.slice(i, i + IMPORT_CHUNK));
        if (error)
          throw new Error(
            `${error.message} (rows ${i + 1}–${Math.min(i + IMPORT_CHUNK, payloads.length)} of batch)`,
          );
        done += Math.min(IMPORT_CHUNK, payloads.length - i);
      }
      qc.invalidateQueries({ queryKey: ["admin-watches"] });
      qc.invalidateQueries({ queryKey: ["watches"] });
      qc.invalidateQueries({ queryKey: ["featured-watches"] });
      qc.invalidateQueries({ queryKey: ["hot-sellers"] });
      qc.invalidateQueries({ queryKey: ["new-arrivals"] });
      toast.success(`Imported ${done} watch${done === 1 ? "" : "es"}`);
      setImportedCount(done);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Import failed");
    } finally {
      setBusy(false);
      setProgressText("");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass-strong rounded-3xl p-6 w-full max-w-3xl space-y-4 my-auto"
      >
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-2xl">Import watches from Excel</h3>
          <button type="button" onClick={onClose} className="p-1 hover:text-[var(--color-gold)]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {importedCount !== null ? (
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3 text-emerald-300">
              <CheckCircle2 className="w-8 h-8 shrink-0" />
              <div>
                <div className="font-medium text-base">Import complete</div>
                <div className="text-muted-foreground">
                  {importedCount} watch{importedCount === 1 ? "" : "es"} added to your catalog.
                </div>
              </div>
            </div>
            <button onClick={onClose} className="w-full py-2.5 rounded-full btn-gold">
              Done
            </button>
          </div>
        ) : !rows ? (
          <div className="space-y-4 text-sm">
            <p className="text-muted-foreground">
              Upload an <span className="text-foreground">.xlsx</span>,{" "}
              <span className="text-foreground">.xls</span> or{" "}
              <span className="text-foreground">.csv</span> file. The first sheet is imported and
              the first row must contain column headers. Recognized columns: Name, Brand,
              Description, Price, Stock, Image URL, Images (separate multiple with <code>|</code>),
              Featured, Hot Seller. Pictures embedded inside the workbook are detected automatically
              and uploaded to your catalog.
            </p>
            <label className="flex flex-col items-center justify-center gap-2 glass rounded-2xl border-dashed border-2 border-[var(--color-border)] p-10 cursor-pointer hover:border-[var(--color-gold)] transition-colors">
              {busy ? (
                <Loader2 className="w-8 h-8 animate-spin text-[var(--color-gold)]" />
              ) : (
                <FileSpreadsheet className="w-8 h-8 text-[var(--color-gold)]" />
              )}
              <span>{busy ? "Reading file…" : "Click to choose a file"}</span>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                hidden
                disabled={busy}
                onChange={(e) => e.target.files?.[0] && pickFile(e.target.files[0])}
              />
            </label>
            <button
              type="button"
              onClick={downloadTemplate}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-[var(--color-gold)]"
            >
              <Download className="w-4 h-4" /> Download sample template
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <FileSpreadsheet className="w-4 h-4" /> {fileName}
              </span>
              <span>
                <span className="text-emerald-300 font-medium">{valid.length}</span> ready
              </span>
              {invalid.length > 0 && (
                <span>
                  <span className="text-rose-300 font-medium">{invalid.length}</span> will be
                  skipped
                </span>
              )}
              {skipped > 0 && (
                <span>
                  {skipped} empty row{skipped === 1 ? "" : "s"} ignored
                </span>
              )}
              {embeddedCount > 0 && (
                <span className="text-[var(--color-gold)]">
                  <ImagePlus className="inline w-4 h-4 mr-0.5 -mt-0.5" />
                  {embeddedCount} embedded picture{embeddedCount === 1 ? "" : "s"} will be uploaded
                </span>
              )}
            </div>

            <div className="glass rounded-xl overflow-auto max-h-72">
              <table className="w-full text-sm">
                <thead className="text-left text-muted-foreground border-b border-[var(--color-border)] sticky top-0 bg-black/40 backdrop-blur">
                  <tr>
                    <th className="p-2">Name</th>
                    <th className="p-2">Brand</th>
                    <th className="p-2">Price</th>
                    <th className="p-2">Stock</th>
                    <th className="p-2">Images</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => {
                    const error = validateRow(r);
                    return (
                      <tr
                        key={r.row}
                        className="border-b border-[var(--color-border)] last:border-0"
                      >
                        <td className="p-2 max-w-48 truncate">
                          {r.name || <span className="text-muted-foreground">—</span>}
                        </td>
                        <td className="p-2">
                          {r.brand || <span className="text-muted-foreground">—</span>}
                        </td>
                        <td className="p-2">
                          {r.price ? (
                            formatLKR(toNumber(r.price)!)
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="p-2">{r.stock || 0}</td>
                        <td className="p-2 text-muted-foreground">
                          {r.embedded.length + r.images.length + (r.image_url ? 1 : 0)}
                        </td>
                        <td className="p-2">
                          {error ? (
                            <span className="text-rose-300 text-xs">{error}</span>
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {!rows.length && (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-muted-foreground">
                        No data rows found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setRows(null)}
                disabled={busy}
                className="flex-1 py-2.5 rounded-full btn-glass disabled:opacity-50"
              >
                Choose another file
              </button>
              <button
                type="button"
                onClick={runImport}
                disabled={busy || !valid.length}
                className="flex-1 py-2.5 rounded-full btn-gold inline-flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {busy && <Loader2 className="w-4 h-4 animate-spin" />}
                {busy
                  ? progressText || "Importing…"
                  : `Import ${valid.length} watch${valid.length === 1 ? "" : "es"}`}
              </button>
            </div>
          </div>
        )}
      </div>
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
              <button
                type="button"
                onClick={() => onChange("")}
                className="absolute top-1 right-1 bg-black/70 rounded-full p-1 hover:bg-black"
              >
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
            <button
              type="button"
              onClick={() => onChange(values.filter((_, j) => j !== i))}
              className="absolute top-0.5 right-0.5 bg-black/70 rounded-full p-1 hover:bg-black"
            >
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
          {busy ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Plus className="w-5 h-5 text-muted-foreground" />
          )}
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

function Input({
  label,
  value,
  onChange,
  type = "text",
  multiline,
  required = true,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  multiline?: boolean;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          rows={3}
          className="mt-1 w-full glass rounded-xl px-3 py-2 text-sm outline-none focus:border-[var(--color-gold)]"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          className="mt-1 w-full glass rounded-xl px-3 py-2 text-sm outline-none focus:border-[var(--color-gold)]"
        />
      )}
    </label>
  );
}
