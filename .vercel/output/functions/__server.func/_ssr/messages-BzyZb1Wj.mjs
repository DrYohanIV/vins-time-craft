import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-DqJ_k-uM.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { y as MailOpen, g as Mail, T as Trash2 } from "../_libs/lucide-react.mjs";
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
function AdminMessages() {
  const qc = useQueryClient();
  const {
    data: messages
  } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: async () => (await supabase.from("messages").select("*").order("created_at", {
      ascending: false
    })).data ?? []
  });
  const toggleRead = async (id, is_read) => {
    const {
      error
    } = await supabase.from("messages").update({
      is_read: !is_read
    }).eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({
      queryKey: ["admin-messages"]
    });
  };
  const remove = async (id) => {
    if (!confirm("Delete this message?")) return;
    const {
      error
    } = await supabase.from("messages").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({
      queryKey: ["admin-messages"]
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl mb-4", children: "Messages" }),
    !messages?.length ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-2xl p-12 text-center text-muted-foreground", children: "No messages yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: messages.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `glass rounded-2xl p-5 ${!m.is_read ? "border-[var(--color-gold)]/40" : ""}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-3 mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display text-lg", children: [
            m.name,
            " ",
            !m.is_read && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-[var(--color-gold)] uppercase ml-2", children: "new" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
            m.email,
            m.phone && ` · ${m.phone}`,
            " · ",
            new Date(m.created_at).toLocaleString()
          ] }),
          m.subject && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm mt-1 text-[var(--color-gold-soft)]", children: m.subject })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => toggleRead(m.id, m.is_read), className: "p-2 hover:text-[var(--color-gold)]", title: m.is_read ? "Mark unread" : "Mark read", children: m.is_read ? /* @__PURE__ */ jsxRuntimeExports.jsx(MailOpen, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-4 h-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => remove(m.id), className: "p-2 hover:text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm whitespace-pre-wrap border-t border-[var(--color-border)] pt-3", children: m.body })
    ] }, m.id)) })
  ] });
}
export {
  AdminMessages as component
};
