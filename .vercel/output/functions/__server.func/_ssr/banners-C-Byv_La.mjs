import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-DqJ_k-uM.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { M as Modal, I as Input, A as Actions } from "./router-DU_JEXVw.mjs";
import { e as Plus, u as Pencil, T as Trash2 } from "../_libs/lucide-react.mjs";
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
const SIZES = ["small", "medium", "large", "full", "tall"];
const empty = {
  title: "",
  subtitle: "",
  image_url: "",
  cta_label: "",
  cta_url: "",
  active: true,
  sort_order: "0",
  size: "medium"
};
function AdminBanners() {
  const qc = useQueryClient();
  const {
    data: rows
  } = useQuery({
    queryKey: ["admin-banners"],
    queryFn: async () => (await supabase.from("banners").select("*").order("sort_order")).data ?? []
  });
  const [editing, setEditing] = reactExports.useState(null);
  const save = async (e) => {
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
      size: editing.size || "medium"
    };
    const {
      error
    } = editing.id ? await supabase.from("banners").update(payload).eq("id", editing.id) : await supabase.from("banners").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEditing(null);
    qc.invalidateQueries({
      queryKey: ["admin-banners"]
    });
    qc.invalidateQueries({
      queryKey: ["home-banners"]
    });
  };
  const remove = async (id) => {
    if (!confirm("Delete?")) return;
    await supabase.from("banners").delete().eq("id", id);
    qc.invalidateQueries({
      queryKey: ["admin-banners"]
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl", children: "Homepage banners" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setEditing({
        ...empty
      }), className: "px-4 py-2 rounded-full btn-gold text-sm inline-flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
        " Add banner"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [
      rows?.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl overflow-hidden", children: [
        b.image_url && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: b.image_url, alt: "", className: "w-full h-40 object-cover" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 flex justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display text-lg", children: [
              b.title,
              " ",
              !b.active && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground ml-2", children: "(inactive)" })
            ] }),
            b.subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: b.subtitle }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mt-1 uppercase tracking-wider", children: [
              "Size: ",
              b.size ?? "medium"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setEditing({
              id: b.id,
              title: b.title,
              subtitle: b.subtitle ?? "",
              image_url: b.image_url ?? "",
              cta_label: b.cta_label ?? "",
              cta_url: b.cta_url ?? "",
              active: b.active,
              sort_order: String(b.sort_order),
              size: b.size ?? "medium"
            }), className: "p-2 hover:text-[var(--color-gold)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => remove(b.id), className: "p-2 hover:text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" }) })
          ] })
        ] })
      ] }, b.id)),
      !rows?.length && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:col-span-2 glass rounded-2xl p-12 text-center text-muted-foreground", children: "No banners yet." })
    ] }),
    editing && /* @__PURE__ */ jsxRuntimeExports.jsx(Modal, { onClose: () => setEditing(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: save, className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display text-2xl", children: [
        editing.id ? "Edit" : "Add",
        " banner"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Title", value: editing.title, onChange: (v) => setEditing({
        ...editing,
        title: v
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Subtitle", value: editing.subtitle, onChange: (v) => setEditing({
        ...editing,
        subtitle: v
      }), required: false, multiline: true }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Image URL", value: editing.image_url, onChange: (v) => setEditing({
        ...editing,
        image_url: v
      }), required: false, placeholder: "https://…" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "CTA label", value: editing.cta_label, onChange: (v) => setEditing({
          ...editing,
          cta_label: v
        }), required: false }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "CTA URL", value: editing.cta_url, onChange: (v) => setEditing({
          ...editing,
          cta_url: v
        }), required: false })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm text-muted-foreground mb-1", children: "Size" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: editing.size, onChange: (e) => setEditing({
          ...editing,
          size: e.target.value
        }), className: "w-full bg-background border border-border rounded-xl px-3 py-2 text-sm", children: SIZES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s, children: s }, s)) })
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
export {
  AdminBanners as component
};
