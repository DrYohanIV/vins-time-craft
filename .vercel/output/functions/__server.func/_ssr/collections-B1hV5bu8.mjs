import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-BTzMKr_B.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { M as Modal, I as Input, A as Actions } from "./router-BI-Nvu9e.mjs";
import { e as Plus, u as Pencil, T as Trash2, X, v as ImagePlus, w as LoaderCircle, x as Upload } from "../_libs/lucide-react.mjs";
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
const empty = {
  title: "",
  subtitle: "",
  image_url: "",
  link_url: "",
  size: "medium",
  sort_order: "0",
  active: true
};
async function uploadFile(file) {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `collection-${crypto.randomUUID()}.${ext}`;
  const {
    error
  } = await supabase.storage.from("watch-images").upload(path, file, {
    cacheControl: "3600",
    contentType: file.type
  });
  if (error) throw error;
  return supabase.storage.from("watch-images").getPublicUrl(path).data.publicUrl;
}
function AdminCollections() {
  const qc = useQueryClient();
  const {
    data: rows
  } = useQuery({
    queryKey: ["admin-collections"],
    queryFn: async () => (await supabase.from("collections").select("*").order("sort_order")).data ?? []
  });
  const [editing, setEditing] = reactExports.useState(null);
  const save = async (e) => {
    e.preventDefault();
    if (!editing) return;
    const payload = {
      title: editing.title,
      subtitle: editing.subtitle || null,
      image_url: editing.image_url || null,
      link_url: editing.link_url || null,
      size: editing.size,
      sort_order: Number(editing.sort_order) || 0,
      active: editing.active
    };
    const {
      error
    } = editing.id ? await supabase.from("collections").update(payload).eq("id", editing.id) : await supabase.from("collections").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEditing(null);
    qc.invalidateQueries({
      queryKey: ["admin-collections"]
    });
    qc.invalidateQueries({
      queryKey: ["home-collections"]
    });
  };
  const remove = async (id) => {
    if (!confirm("Delete?")) return;
    await supabase.from("collections").delete().eq("id", id);
    qc.invalidateQueries({
      queryKey: ["admin-collections"]
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl", children: "Collections" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setEditing({
        ...empty
      }), className: "px-4 py-2 rounded-full btn-gold text-sm inline-flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
        " Add collection"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 md:grid-cols-3 gap-4", children: [
      rows?.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl overflow-hidden", children: [
        c.image_url && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: c.image_url, alt: c.title, className: "w-full h-36 object-cover" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 flex justify-between items-start gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium truncate", children: [
              c.title,
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground uppercase ml-1", children: c.size })
            ] }),
            c.subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground truncate", children: c.subtitle }),
            !c.active && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground", children: "inactive" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-0.5 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setEditing({
              id: c.id,
              title: c.title,
              subtitle: c.subtitle ?? "",
              image_url: c.image_url ?? "",
              link_url: c.link_url ?? "",
              size: c.size,
              sort_order: String(c.sort_order),
              active: c.active
            }), className: "p-1.5 hover:text-[var(--color-gold)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-3.5 h-3.5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => remove(c.id), className: "p-1.5 hover:text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" }) })
          ] })
        ] })
      ] }, c.id)),
      !rows?.length && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-full glass rounded-2xl p-12 text-center text-muted-foreground", children: "No collections yet." })
    ] }),
    editing && /* @__PURE__ */ jsxRuntimeExports.jsx(Modal, { onClose: () => setEditing(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: save, className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display text-2xl", children: [
        editing.id ? "Edit" : "Add",
        " collection"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Title", value: editing.title, onChange: (v) => setEditing({
        ...editing,
        title: v
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Subtitle", value: editing.subtitle, onChange: (v) => setEditing({
        ...editing,
        subtitle: v
      }), required: false }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ImageField, { value: editing.image_url, onChange: (v) => setEditing({
        ...editing,
        image_url: v
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Link URL (e.g. /shop?brand=Rolex)", value: editing.link_url, onChange: (v) => setEditing({
        ...editing,
        link_url: v
      }), required: false }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: "Size" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: editing.size, onChange: (e) => setEditing({
          ...editing,
          size: e.target.value
        }), className: "mt-1 w-full glass rounded-xl px-3 py-2 text-sm outline-none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "small", children: "Small (1×1)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "medium", children: "Medium (2×1)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "large", children: "Large (2×2)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "wide", children: "Wide (3×1)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "tall", children: "Tall (1×2)" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Sort order", type: "number", value: editing.sort_order, onChange: (v) => setEditing({
        ...editing,
        sort_order: v
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: editing.active, onChange: (e) => setEditing({
          ...editing,
          active: e.target.checked
        }) }),
        " Active"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Actions, { onCancel: () => setEditing(null), label: editing.id ? "Save" : "Add" })
    ] }) })
  ] });
}
function ImageField({
  value,
  onChange
}) {
  const [busy, setBusy] = reactExports.useState(false);
  const ref = reactExports.useRef(null);
  const pick = async (file) => {
    setBusy(true);
    try {
      onChange(await uploadFile(file));
      toast.success("Uploaded");
    } catch (e) {
      toast.error(e.message ?? "Upload failed");
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wider text-muted-foreground mb-1", children: "Image" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative w-28 h-20 rounded-xl overflow-hidden shrink-0 glass flex items-center justify-center", children: value ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: value, alt: "", className: "w-full h-full object-cover" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => onChange(""), className: "absolute top-1 right-1 bg-black/70 rounded-full p-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3" }) })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlus, { className: "w-6 h-6 text-muted-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", disabled: busy, onClick: () => ref.current?.click(), className: "inline-flex items-center gap-2 px-4 py-2 rounded-full btn-glass text-sm disabled:opacity-50", children: [
          busy ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-4 h-4" }),
          value ? "Replace" : "Upload"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref, type: "file", accept: "image/*", hidden: true, onChange: (e) => e.target.files?.[0] && pick(e.target.files[0]) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "url", value, onChange: (e) => onChange(e.target.value), placeholder: "…or paste URL", className: "w-full glass rounded-xl px-3 py-2 text-sm outline-none focus:border-[var(--color-gold)]" })
      ] })
    ] })
  ] });
}
export {
  AdminCollections as component
};
