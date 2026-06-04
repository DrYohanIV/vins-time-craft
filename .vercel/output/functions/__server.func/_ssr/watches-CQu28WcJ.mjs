import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-BTzMKr_B.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { f as formatLKR } from "./router-BI-Nvu9e.mjs";
import { b as Search, e as Plus, s as TriangleAlert, t as Star, u as Pencil, T as Trash2, X, v as ImagePlus, w as LoaderCircle, x as Upload } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/isbot.mjs";
const LOW_STOCK_THRESHOLD = 3;
const PAGE_SIZE = 10;
const emptyForm = {
  name: "",
  brand: "",
  description: "",
  price: "",
  stock: "1",
  image_url: "",
  images: [],
  featured: false,
  hot_seller: false
};
async function uploadFile(file) {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;
  const {
    error
  } = await supabase.storage.from("watch-images").upload(path, file, {
    cacheControl: "3600",
    contentType: file.type
  });
  if (error) throw error;
  const {
    data
  } = supabase.storage.from("watch-images").getPublicUrl(path);
  return data.publicUrl;
}
function AdminWatches() {
  const qc = useQueryClient();
  const {
    data: watches
  } = useQuery({
    queryKey: ["admin-watches"],
    queryFn: async () => (await supabase.from("watches").select("*").order("created_at", {
      ascending: false
    })).data ?? []
  });
  const [editing, setEditing] = reactExports.useState(null);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [page, setPage] = reactExports.useState(1);
  const filtered = reactExports.useMemo(() => {
    if (!watches) return [];
    const q = searchQuery.trim().toLowerCase();
    if (!q) return watches;
    return watches.filter((w) => w.name.toLowerCase().includes(q) || w.brand.toLowerCase().includes(q));
  }, [watches, searchQuery]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const save = async (e) => {
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
      hot_seller: editing.hot_seller
    };
    const {
      error
    } = editing.id ? await supabase.from("watches").update(payload).eq("id", editing.id) : await supabase.from("watches").insert(payload);
    if (error) return toast.error(error.message);
    toast.success(editing.id ? "Watch updated" : "Watch added");
    setEditing(null);
    qc.invalidateQueries({
      queryKey: ["admin-watches"]
    });
    qc.invalidateQueries({
      queryKey: ["watches"]
    });
    qc.invalidateQueries({
      queryKey: ["featured-watches"]
    });
    qc.invalidateQueries({
      queryKey: ["hot-sellers"]
    });
    qc.invalidateQueries({
      queryKey: ["new-arrivals"]
    });
  };
  const remove = async (id) => {
    if (!confirm("Delete this watch?")) return;
    const {
      error
    } = await supabase.from("watches").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Watch deleted");
    qc.invalidateQueries({
      queryKey: ["admin-watches"]
    });
    qc.invalidateQueries({
      queryKey: ["watches"]
    });
  };
  const lowStock = watches?.filter((w) => w.stock <= LOW_STOCK_THRESHOLD) ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl", children: "Watches" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 w-full sm:w-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 sm:w-64", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: searchQuery, onChange: (e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }, placeholder: "Search watches or brands…", className: "w-full glass rounded-full pl-9 pr-4 py-2 text-sm outline-none focus:border-[var(--color-gold)]" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setEditing({
          ...emptyForm
        }), className: "px-4 py-2 rounded-full btn-gold text-sm inline-flex items-center gap-2 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
          " Add watch"
        ] })
      ] })
    ] }),
    lowStock.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-4 mb-4 border border-amber-500/40 flex items-start gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-5 h-5 text-amber-400 shrink-0 mt-0.5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-amber-300", children: "Low stock alert" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-muted-foreground mt-0.5", children: [
          lowStock.length,
          " watch",
          lowStock.length === 1 ? "" : "es",
          " at or below ",
          LOW_STOCK_THRESHOLD,
          " units:",
          " ",
          lowStock.map((w) => `${w.name} (${w.stock})`).join(", ")
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-2xl overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-left text-muted-foreground border-b border-[var(--color-border)]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Watch" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Brand" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Price" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Stock" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Images" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        paginated.map((w) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-[var(--color-border)] last:border-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg overflow-hidden shrink-0", style: {
              background: "var(--gradient-bg)"
            }, children: w.image_url && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: w.image_url, alt: "", className: "w-full h-full object-cover" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium flex items-center gap-1", children: [
              w.name,
              w.featured && /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-3 h-3 text-[var(--color-gold)] fill-[var(--color-gold)]" })
            ] }) })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-muted-foreground", children: w.brand }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: formatLKR(Number(w.price)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: w.stock === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-rose-500/20 text-rose-300", children: "Out of stock" }) : w.stock <= LOW_STOCK_THRESHOLD ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-amber-500/20 text-amber-300", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-3 h-3" }),
            " ",
            w.stock,
            " left"
          ] }) : w.stock }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-muted-foreground", children: 1 + (w.images?.length ?? 0) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-3 text-right", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setEditing({
              id: w.id,
              name: w.name,
              brand: w.brand,
              description: w.description ?? "",
              price: String(w.price),
              stock: String(w.stock),
              image_url: w.image_url ?? "",
              images: w.images ?? [],
              featured: w.featured,
              hot_seller: w.hot_seller ?? false
            }), className: "p-2 hover:text-[var(--color-gold)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => remove(w.id), className: "p-2 hover:text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" }) })
          ] })
        ] }, w.id)),
        !paginated.length && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, className: "p-8 text-center text-muted-foreground", children: searchQuery ? "No watches match your search." : "No watches yet. Add your first." }) })
      ] })
    ] }) }),
    totalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-4 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-muted-foreground", children: [
        "Showing ",
        (currentPage - 1) * PAGE_SIZE + 1,
        "–",
        Math.min(currentPage * PAGE_SIZE, filtered.length),
        " of ",
        filtered.length
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setPage((p) => Math.max(1, p - 1)), disabled: currentPage === 1, className: "px-3 py-1.5 rounded-lg glass text-sm disabled:opacity-40 hover:bg-white/5", children: "Prev" }),
        Array.from({
          length: totalPages
        }, (_, i) => i + 1).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setPage(p), className: `w-8 h-8 rounded-lg text-sm ${p === currentPage ? "btn-gold" : "glass hover:bg-white/5"}`, children: p }, p)),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setPage((p) => Math.min(totalPages, p + 1)), disabled: currentPage === totalPages, className: "px-3 py-1.5 rounded-lg glass text-sm disabled:opacity-40 hover:bg-white/5", children: "Next" })
      ] })
    ] }),
    editing && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-auto", onClick: () => setEditing(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onClick: (e) => e.stopPropagation(), onSubmit: save, className: "glass-strong rounded-3xl p-6 w-full max-w-2xl space-y-3 my-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-2xl", children: editing.id ? "Edit watch" : "Add watch" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Name", value: editing.name, onChange: (v) => setEditing({
        ...editing,
        name: v
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Brand", value: editing.brand, onChange: (v) => setEditing({
        ...editing,
        brand: v
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Description", multiline: true, value: editing.description, onChange: (v) => setEditing({
        ...editing,
        description: v
      }), required: false }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Price (LKR)", type: "number", value: editing.price, onChange: (v) => setEditing({
          ...editing,
          price: v
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Stock", type: "number", value: editing.stock, onChange: (v) => setEditing({
          ...editing,
          stock: v
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MainImageField, { value: editing.image_url, onChange: (v) => setEditing({
        ...editing,
        image_url: v
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(GalleryField, { values: editing.images, onChange: (v) => setEditing({
        ...editing,
        images: v
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: editing.featured, onChange: (e) => setEditing({
            ...editing,
            featured: e.target.checked
          }) }),
          "New arrival (featured)"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: editing.hot_seller, onChange: (e) => setEditing({
            ...editing,
            hot_seller: e.target.checked
          }) }),
          "Hot seller"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setEditing(null), className: "flex-1 py-2.5 rounded-full btn-glass", children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "flex-1 py-2.5 rounded-full btn-gold", children: editing.id ? "Save" : "Add watch" })
      ] })
    ] }) })
  ] });
}
function MainImageField({
  value,
  onChange
}) {
  const [busy, setBusy] = reactExports.useState(false);
  const ref = reactExports.useRef(null);
  const pick = async (file) => {
    setBusy(true);
    try {
      const url = await uploadFile(file);
      onChange(url);
      toast.success("Main image uploaded");
    } catch (e) {
      toast.error(e.message ?? "Upload failed");
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wider text-muted-foreground mb-1", children: "Main image" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative w-28 h-28 rounded-xl overflow-hidden shrink-0 glass flex items-center justify-center", children: value ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: value, alt: "", className: "w-full h-full object-cover" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => onChange(""), className: "absolute top-1 right-1 bg-black/70 rounded-full p-1 hover:bg-black", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3" }) })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlus, { className: "w-6 h-6 text-muted-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", disabled: busy, onClick: () => ref.current?.click(), className: "inline-flex items-center gap-2 px-4 py-2 rounded-full btn-glass text-sm disabled:opacity-50", children: [
          busy ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-4 h-4" }),
          value ? "Replace image" : "Upload image"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref, type: "file", accept: "image/*", hidden: true, onChange: (e) => e.target.files?.[0] && pick(e.target.files[0]) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "url", value, onChange: (e) => onChange(e.target.value), placeholder: "…or paste an image URL", className: "w-full glass rounded-xl px-3 py-2 text-sm outline-none focus:border-[var(--color-gold)]" })
      ] })
    ] })
  ] });
}
function GalleryField({
  values,
  onChange
}) {
  const [busy, setBusy] = reactExports.useState(false);
  const ref = reactExports.useRef(null);
  const pick = async (files) => {
    setBusy(true);
    try {
      const uploaded = await Promise.all(Array.from(files).map(uploadFile));
      onChange([...values, ...uploaded]);
      toast.success(`${uploaded.length} image${uploaded.length === 1 ? "" : "s"} added`);
    } catch (e) {
      toast.error(e.message ?? "Upload failed");
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs uppercase tracking-wider text-muted-foreground mb-1 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Gallery (additional images)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] opacity-70", children: [
        values.length,
        " added"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
      values.map((url, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-20 h-20 rounded-lg overflow-hidden glass", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: url, alt: "", className: "w-full h-full object-cover" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => onChange(values.filter((_, j) => j !== i)), className: "absolute top-0.5 right-0.5 bg-black/70 rounded-full p-1 hover:bg-black", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3" }) })
      ] }, url + i)),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", disabled: busy, onClick: () => ref.current?.click(), className: "w-20 h-20 rounded-lg glass flex items-center justify-center hover:border-[var(--color-gold)] disabled:opacity-50", children: busy ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-5 h-5 text-muted-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref, type: "file", accept: "image/*", multiple: true, hidden: true, onChange: (e) => e.target.files?.length && pick(e.target.files) })
    ] })
  ] });
}
function Input({
  label,
  value,
  onChange,
  type = "text",
  multiline,
  required = true,
  placeholder
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: label }),
    multiline ? /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value, onChange: (e) => onChange(e.target.value), required, placeholder, rows: 3, className: "mt-1 w-full glass rounded-xl px-3 py-2 text-sm outline-none focus:border-[var(--color-gold)]" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type, value, onChange: (e) => onChange(e.target.value), required, placeholder, className: "mt-1 w-full glass rounded-xl px-3 py-2 text-sm outline-none focus:border-[var(--color-gold)]" })
  ] });
}
export {
  AdminWatches as component
};
