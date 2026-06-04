import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-BTzMKr_B.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { M as Modal, I as Input, A as Actions } from "./router-BI-Nvu9e.mjs";
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
const empty = {
  name: "",
  image_url: "",
  sort_order: "0",
  active: true
};
function AdminBrandCategories() {
  const qc = useQueryClient();
  const {
    data: rows
  } = useQuery({
    queryKey: ["admin-brand-categories"],
    queryFn: async () => (await supabase.from("brand_categories").select("*").order("sort_order")).data ?? []
  });
  const [editing, setEditing] = reactExports.useState(null);
  const save = async (e) => {
    e.preventDefault();
    if (!editing) return;
    const payload = {
      name: editing.name,
      image_url: editing.image_url || null,
      active: editing.active,
      sort_order: Number(editing.sort_order) || 0
    };
    const {
      error
    } = editing.id ? await supabase.from("brand_categories").update(payload).eq("id", editing.id) : await supabase.from("brand_categories").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEditing(null);
    qc.invalidateQueries({
      queryKey: ["admin-brand-categories"]
    });
    qc.invalidateQueries({
      queryKey: ["home-brand-categories"]
    });
  };
  const remove = async (id) => {
    if (!confirm("Delete?")) return;
    await supabase.from("brand_categories").delete().eq("id", id);
    qc.invalidateQueries({
      queryKey: ["admin-brand-categories"]
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl", children: "Brand Categories" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setEditing({
        ...empty
      }), className: "px-4 py-2 rounded-full btn-gold text-sm inline-flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
        " Add brand"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-3 gap-4", children: [
      rows?.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl overflow-hidden", children: [
        b.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: b.image_url, alt: "", className: "w-full h-32 object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-32 flex items-center justify-center text-muted-foreground text-sm glass", children: "No image" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 flex justify-between gap-3 items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display text-lg", children: [
            b.name,
            " ",
            !b.active && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground ml-2", children: "(inactive)" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setEditing({
              id: b.id,
              name: b.name,
              image_url: b.image_url ?? "",
              sort_order: String(b.sort_order),
              active: b.active
            }), className: "p-2 hover:text-[var(--color-gold)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => remove(b.id), className: "p-2 hover:text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" }) })
          ] })
        ] })
      ] }, b.id)),
      !rows?.length && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:col-span-3 glass rounded-2xl p-12 text-center text-muted-foreground", children: "No brand categories yet." })
    ] }),
    editing && /* @__PURE__ */ jsxRuntimeExports.jsx(Modal, { onClose: () => setEditing(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: save, className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display text-2xl", children: [
        editing.id ? "Edit" : "Add",
        " brand category"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Brand name", value: editing.name, onChange: (v) => setEditing({
        ...editing,
        name: v
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Image URL", value: editing.image_url, onChange: (v) => setEditing({
        ...editing,
        image_url: v
      }), required: false, placeholder: "https://…" }),
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
  AdminBrandCategories as component
};
