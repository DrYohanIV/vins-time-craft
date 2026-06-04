import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-BTzMKr_B.mjs";
import { t as toast } from "../_libs/sonner.mjs";
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
const empty = {
  title: "",
  subtitle: "",
  cta_label: "",
  cta_url: "",
  active: true,
  sort_order: "0"
};
function AdminPromotions() {
  const qc = useQueryClient();
  const {
    data: rows
  } = useQuery({
    queryKey: ["admin-promotions"],
    queryFn: async () => (await supabase.from("promotions").select("*").order("sort_order")).data ?? []
  });
  const [editing, setEditing] = reactExports.useState(null);
  const save = async (e) => {
    e.preventDefault();
    if (!editing) return;
    const payload = {
      title: editing.title,
      subtitle: editing.subtitle || null,
      cta_label: editing.cta_label || null,
      cta_url: editing.cta_url || null,
      active: editing.active,
      sort_order: Number(editing.sort_order) || 0
    };
    const {
      error
    } = editing.id ? await supabase.from("promotions").update(payload).eq("id", editing.id) : await supabase.from("promotions").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEditing(null);
    qc.invalidateQueries({
      queryKey: ["admin-promotions"]
    });
    qc.invalidateQueries({
      queryKey: ["home-promotions"]
    });
  };
  const remove = async (id) => {
    if (!confirm("Delete?")) return;
    await supabase.from("promotions").delete().eq("id", id);
    qc.invalidateQueries({
      queryKey: ["admin-promotions"]
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl", children: "Promotions" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setEditing({
        ...empty
      }), className: "px-4 py-2 rounded-full btn-gold text-sm inline-flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
        " Add promotion"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      rows?.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-5 flex justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display text-lg", children: [
            p.title,
            " ",
            !p.active && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground ml-2", children: "(inactive)" })
          ] }),
          p.subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: p.subtitle }),
          p.cta_label && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-[var(--color-gold-soft)] mt-1", children: [
            p.cta_label,
            " → ",
            p.cta_url
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setEditing({
            id: p.id,
            title: p.title,
            subtitle: p.subtitle ?? "",
            cta_label: p.cta_label ?? "",
            cta_url: p.cta_url ?? "",
            active: p.active,
            sort_order: String(p.sort_order)
          }), className: "p-2 hover:text-[var(--color-gold)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-4 h-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => remove(p.id), className: "p-2 hover:text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" }) })
        ] })
      ] }, p.id)),
      !rows?.length && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-2xl p-12 text-center text-muted-foreground", children: "No promotions yet." })
    ] }),
    editing && /* @__PURE__ */ jsxRuntimeExports.jsx(Modal, { onClose: () => setEditing(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: save, className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display text-2xl", children: [
        editing.id ? "Edit" : "Add",
        " promotion"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Title", value: editing.title, onChange: (v) => setEditing({
        ...editing,
        title: v
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Subtitle", value: editing.subtitle, onChange: (v) => setEditing({
        ...editing,
        subtitle: v
      }), required: false, multiline: true }),
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
function Modal({
  children,
  onClose
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-auto", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { onClick: (e) => e.stopPropagation(), className: "glass-strong rounded-3xl p-6 w-full max-w-lg my-auto", children }) });
}
function Actions({
  onCancel,
  label
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: onCancel, className: "flex-1 py-2.5 rounded-full btn-glass", children: "Cancel" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "flex-1 py-2.5 rounded-full btn-gold", children: label })
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
  Actions,
  Input,
  Modal,
  AdminPromotions as component
};
