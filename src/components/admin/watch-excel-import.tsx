import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { FileSpreadsheet, Loader2, Upload, X, CheckCircle2, AlertTriangle, ImageOff } from "lucide-react";
import { formatLKR } from "@/lib/cart";
import { extractSheetImages, type EmbeddedImage } from "@/lib/xlsx-images";

type ParsedRow = {
  name: string;
  brand: string;
  description: string | null;
  price: number;
  stock: number;
  featured: boolean;
  hot_seller: boolean;
  image?: EmbeddedImage;
  previewUrl?: string;
  error?: string;
};

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

const FIELD_ALIASES: Record<string, string[]> = {
  name: ["name", "model", "watchname", "watchmodel", "modelname", "title", "product", "productname"],
  brand: ["brand", "make", "manufacturer", "brandname"],
  description: ["description", "desc", "details", "detail", "notes"],
  price: ["price", "pricelkr", "priceinlkr", "amount", "sellingprice", "rate"],
  stock: ["stock", "qty", "quantity", "instock", "stockqty", "available"],
  featured: ["featured", "newarrival", "new"],
  hot_seller: ["hotseller", "hot", "bestseller", "trending"],
};

function pickKey(keys: string[], aliases: string[]) {
  for (const alias of aliases) {
    const hit = keys.find((k) => norm(k) === alias);
    if (hit) return hit;
  }
  for (const alias of aliases) {
    const hit = keys.find((k) => norm(k).includes(alias));
    if (hit) return hit;
  }
  return undefined;
}

function truthy(v: unknown) {
  if (typeof v === "boolean") return v;
  const s = String(v ?? "").trim().toLowerCase();
  return ["1", "true", "yes", "y", "x"].includes(s);
}

function parseSheet(rows: Record<string, unknown>[], images: Map<number, EmbeddedImage>): ParsedRow[] {
  if (!rows.length) return [];
  const keys = Object.keys(rows[0]);
  const map = Object.fromEntries(
    Object.entries(FIELD_ALIASES).map(([field, aliases]) => [field, pickKey(keys, aliases)]),
  ) as Record<string, string | undefined>;

  return rows.map((row, i) => {
    const get = (field: string) => (map[field] ? row[map[field]!] : undefined);
    const str = (field: string) => String(get(field) ?? "").trim();

    const name = str("name");
    const rawPrice = String(get("price") ?? "").replace(/[^0-9.]/g, "");
    const price = Number(rawPrice);
    const rawStock = String(get("stock") ?? "").replace(/[^0-9.-]/g, "");
    const stock = rawStock === "" ? 1 : Math.max(0, Math.round(Number(rawStock)));

    const image = images.get(i);

    let error: string | undefined;
    if (!name) error = "Missing watch name/model";
    else if (!Number.isFinite(price) || price <= 0) error = "Missing or invalid price";

    return {
      name,
      brand: str("brand") || "Vins",
      description: str("description") || null,
      price: Number.isFinite(price) ? price : 0,
      stock: Number.isFinite(stock) ? stock : 1,
      featured: truthy(get("featured")),
      hot_seller: truthy(get("hot_seller")),
      image,
      previewUrl: image ? URL.createObjectURL(image.blob) : undefined,
      error,
    };
  });
}

async function uploadImage(image: EmbeddedImage): Promise<string> {
  const path = `import-${crypto.randomUUID()}.${image.ext}`;
  const { error } = await supabase.storage.from("watch-images").upload(path, image.blob, {
    cacheControl: "3600",
    contentType: image.blob.type || "image/png",
  });
  if (error) throw error;
  return supabase.storage.from("watch-images").getPublicUrl(path).data.publicUrl;
}

export function WatchExcelImport({ onImported }: { onImported: () => void }) {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<ParsedRow[] | null>(null);
  const [fileName, setFileName] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setFileName(file.name);
    try {
      const buf = await file.arrayBuffer();
      const images = extractSheetImages(buf);
      const wb = XLSX.read(buf, { type: "array" });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
      const parsed = parseSheet(json, images);
      if (!parsed.length) return toast.error("No rows found in the first sheet.");
      setRows(parsed);
      setProgress(0);
      setOpen(true);
      if (!images.size) toast.warning("No embedded images found in this sheet.");
    } catch (e: any) {
      toast.error(e?.message ?? "Could not read that file");
    }
  };

  const valid = rows?.filter((r) => !r.error) ?? [];
  const invalid = rows?.filter((r) => r.error) ?? [];
  const withImages = valid.filter((r) => r.image).length;

  const importAll = async () => {
    if (!valid.length) return;
    setBusy(true);
    setProgress(0);
    let inserted = 0;
    try {
      for (const r of valid) {
        let image_url: string | null = null;
        if (r.image) {
          try {
            image_url = await uploadImage(r.image);
          } catch (e: any) {
            toast.error(`Image upload failed for ${r.name}: ${e?.message ?? "unknown error"}`);
          }
        }
        const { error } = await supabase.from("watches").insert({
          name: r.name,
          brand: r.brand,
          description: r.description,
          price: r.price,
          stock: r.stock,
          featured: r.featured,
          hot_seller: r.hot_seller,
          image_url,
          images: [],
        });
        if (error) throw new Error(error.message);
        inserted += 1;
        setProgress(inserted);
      }
      toast.success(`${inserted} watch${inserted === 1 ? "" : "es"} imported`);
      setOpen(false);
      setRows(null);
    } catch (e: any) {
      toast.error(`Import stopped after ${inserted} watches: ${e?.message ?? "unknown error"}`);
    } finally {
      setBusy(false);
      onImported();
    }
  };

  return (
    <>
      <button
        onClick={() => inputRef.current?.click()}
        className="px-4 py-2 rounded-full btn-glass text-sm inline-flex items-center gap-2 shrink-0"
      >
        <FileSpreadsheet className="w-4 h-4" /> Import Excel
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (f) handleFile(f);
        }}
      />

      {open && rows && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-auto">
          <div className="glass-strong rounded-3xl p-6 w-full max-w-4xl my-auto">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="font-display text-2xl">Import watches</h3>
                <p className="text-sm text-muted-foreground mt-1">{fileName}</p>
              </div>
              <button onClick={() => setOpen(false)} className="p-2 hover:text-[var(--color-gold)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-3 mb-4 text-sm">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300">
                <CheckCircle2 className="w-4 h-4" /> {valid.length} ready
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-gold)]/15 text-[var(--color-gold)]">
                <Upload className="w-4 h-4" /> {withImages} images to upload
              </span>
              {invalid.length > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300">
                  <AlertTriangle className="w-4 h-4" /> {invalid.length} skipped
                </span>
              )}
            </div>

            <div className="glass rounded-2xl overflow-hidden max-h-[50vh] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-muted-foreground border-b border-[var(--color-border)] sticky top-0 backdrop-blur-md">
                  <tr>
                    <th className="p-3">Image</th>
                    <th className="p-3">Model</th>
                    <th className="p-3">Brand</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Stock</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i} className="border-b border-[var(--color-border)] last:border-0">
                      <td className="p-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden glass flex items-center justify-center">
                          {r.previewUrl ? (
                            <img src={r.previewUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <ImageOff className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                      </td>
                      <td className="p-3">{r.name || <span className="text-muted-foreground">—</span>}</td>
                      <td className="p-3 text-muted-foreground">{r.brand}</td>
                      <td className="p-3">{r.price ? formatLKR(r.price) : "—"}</td>
                      <td className="p-3">{r.stock}</td>
                      <td className="p-3">
                        {r.error ? (
                          <span className="text-xs text-amber-300">{r.error}</span>
                        ) : (
                          <span className="text-xs text-emerald-300">Ready</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-muted-foreground mt-3">
              Pictures embedded in the sheet are uploaded to your store gallery — image link columns are ignored.
              Recognised columns: model/name, brand, description, price, stock/qty, featured, hot seller.
            </p>

            <div className="flex gap-2 pt-4">
              <button onClick={() => setOpen(false)} className="flex-1 py-2.5 rounded-full btn-glass">
                Cancel
              </button>
              <button
                onClick={importAll}
                disabled={busy || !valid.length}
                className="flex-1 py-2.5 rounded-full btn-gold inline-flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {busy ? `Uploading ${progress}/${valid.length}…` : `Import ${valid.length} watch${valid.length === 1 ? "" : "es"}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
