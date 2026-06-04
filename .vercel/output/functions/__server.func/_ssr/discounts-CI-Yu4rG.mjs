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
  code: "",
  description: "",
  percent_off: "",
  amount_off: "",
  min_order: "0",
  expires_at: "",
  active: true
};
function AdminDiscounts() {
  const qc = useQueryClient();
  const {
    data: rows
  } = useQuery({
    queryKey: ["admin-discounts"],
    queryFn: async () => (await supabase.from("discount_codes").select("*").order("created_at", {
      ascending: false
    })).data ?? []
  });
  const [editing, setEditing] = reactExports.useState(null);
  const save = async (e) => {
    e.preventDefault();
    if (!editing) return;
    const payload = {
      code: editing.code.toUpperCase().trim(),
      description: editing.description || null,
      percent_off: editing.percent_off ? Number(editing.percent_off) : null,
      amount_off: editing.amount_off ? Number(editing.amount_off) : null,
      min_order: Number(editing.min_order) || 0,
      expires_at: editing.expires_at ? new Date(editing.expires_at).toISOString() : null,
      active: editing.active
    };
    const {
      error
    } = editing.id ? await supabase.from("discount_codes").update(payload).eq("id", editing.id) : await supabase.from("discount_codes").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEditing(null);
    qc.invalidateQueries({
      queryKey: ["admin-discounts"]
    });
  };
  const remove = async (id) => {
    if (!confirm("Delete?")) return;
    await supabase.from("discount_codes").delete().eq("id", id);
    qc.invalidateQueries({
      queryKey: ["admin-discounts"]
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl", children: "Discount codes" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setEditing({
        ...empty
      }), className: "px-4 py-2 rounded-full btn-gold text-sm inline-flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
        " Add code"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-2xl overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-left text-muted-foreground border-b border-[var(--color-border)]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Code" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Discount" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Min order" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Expires" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", {})
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        rows?.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-[var(--color-border)] last:border-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 font-mono text-[var(--color-gold-soft)]", children: d.code }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: d.percent_off ? `${d.percent_off}%` : d.amount_off ? `LKR ${Number(d.amount_off).toLocaleString()}` : "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-3 text-muted-foreground", children: [
            "LKR ",
            Number(d.min_order).toLocaleString()
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-muted-foreground", children: d.expires_at ? new Date(d.expires_at).toLocaleDateString() : "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: d.active ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[var(--color-gold)]", children: "Active" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Inactive" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-3 text-right", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setEditing({
              id: d.id,
              code: d.code,
              description: d.description ?? "",
              percent_off: d.percent_off?.toString() ?? "",
              amount_off: d.amount_off?.toString() ?? "",
              min_order: String(d.min_order),
              expires_at: d.expires_at ? d.expires_at.slice(0, 10) : "",
              active: d.active
            }), className: "p-2 hover:text-[var(--color-gold)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => remove(d.id), className: "p-2 hover:text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" }) })
          ] })
        ] }, d.id)),
        !rows?.length && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, className: "p-8 text-center text-muted-foreground", children: "No discount codes yet." }) })
      ] })
    ] }) }),
    editing && /* @__PURE__ */ jsxRuntimeExports.jsx(Modal, { onClose: () => setEditing(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: save, className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display text-2xl", children: [
        editing.id ? "Edit" : "Add",
        " discount code"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Code", value: editing.code, onChange: (v) => setEditing({
        ...editing,
        code: v.toUpperCase()
      }), placeholder: "SUMMER25" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Description", value: editing.description, onChange: (v) => setEditing({
        ...editing,
        description: v
      }), required: false }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Percent off (%)", type: "number", value: editing.percent_off, onChange: (v) => setEditing({
          ...editing,
          percent_off: v,
          amount_off: v ? "" : editing.amount_off
        }), required: false }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Amount off (LKR)", type: "number", value: editing.amount_off, onChange: (v) => setEditing({
          ...editing,
          amount_off: v,
          percent_off: v ? "" : editing.percent_off
        }), required: false })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Min order (LKR)", type: "number", value: editing.min_order, onChange: (v) => setEditing({
          ...editing,
          min_order: v
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Expires on", type: "date", value: editing.expires_at, onChange: (v) => setEditing({
          ...editing,
          expires_at: v
        }), required: false })
      ] }),
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
  AdminDiscounts as component
};
