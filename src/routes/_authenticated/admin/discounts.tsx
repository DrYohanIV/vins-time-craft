import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Modal, Actions, Input } from "./promotions";

export const Route = createFileRoute("/_authenticated/admin/discounts")({ component: AdminDiscounts });

type Form = { id?: string; code: string; description: string; percent_off: string; amount_off: string; min_order: string; expires_at: string; active: boolean };
const empty: Form = { code: "", description: "", percent_off: "", amount_off: "", min_order: "0", expires_at: "", active: true };

function AdminDiscounts() {
  const qc = useQueryClient();
  const { data: rows } = useQuery({
    queryKey: ["admin-discounts"],
    queryFn: async () => (await supabase.from("discount_codes").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  const [editing, setEditing] = useState<Form | null>(null);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const payload: any = {
      code: editing.code.toUpperCase().trim(),
      description: editing.description || null,
      percent_off: editing.percent_off ? Number(editing.percent_off) : null,
      amount_off: editing.amount_off ? Number(editing.amount_off) : null,
      min_order: Number(editing.min_order) || 0,
      expires_at: editing.expires_at ? new Date(editing.expires_at).toISOString() : null,
      active: editing.active,
    };
    const { error } = editing.id
      ? await supabase.from("discount_codes").update(payload).eq("id", editing.id)
      : await supabase.from("discount_codes").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEditing(null);
    qc.invalidateQueries({ queryKey: ["admin-discounts"] });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("discount_codes").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin-discounts"] });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-display text-2xl">Discount codes</h2>
        <button onClick={() => setEditing({ ...empty })} className="px-4 py-2 rounded-full btn-gold text-sm inline-flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add code
        </button>
      </div>
      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-left text-muted-foreground border-b border-[var(--color-border)]">
            <tr><th className="p-3">Code</th><th className="p-3">Discount</th><th className="p-3">Min order</th><th className="p-3">Expires</th><th className="p-3">Status</th><th></th></tr>
          </thead>
          <tbody>
            {rows?.map((d) => (
              <tr key={d.id} className="border-b border-[var(--color-border)] last:border-0">
                <td className="p-3 font-mono text-[var(--color-gold-soft)]">{d.code}</td>
                <td className="p-3">{d.percent_off ? `${d.percent_off}%` : d.amount_off ? `LKR ${Number(d.amount_off).toLocaleString()}` : "—"}</td>
                <td className="p-3 text-muted-foreground">LKR {Number(d.min_order).toLocaleString()}</td>
                <td className="p-3 text-muted-foreground">{d.expires_at ? new Date(d.expires_at).toLocaleDateString() : "—"}</td>
                <td className="p-3">{d.active ? <span className="text-[var(--color-gold)]">Active</span> : <span className="text-muted-foreground">Inactive</span>}</td>
                <td className="p-3 text-right">
                  <button onClick={() => setEditing({ id: d.id, code: d.code, description: d.description ?? "", percent_off: d.percent_off?.toString() ?? "", amount_off: d.amount_off?.toString() ?? "", min_order: String(d.min_order), expires_at: d.expires_at ? d.expires_at.slice(0, 10) : "", active: d.active })} className="p-2 hover:text-[var(--color-gold)]"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => remove(d.id)} className="p-2 hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {!rows?.length && <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No discount codes yet.</td></tr>}
          </tbody>
        </table>
      </div>

      {editing && (
        <Modal onClose={() => setEditing(null)}>
          <form onSubmit={save} className="space-y-3">
            <h3 className="font-display text-2xl">{editing.id ? "Edit" : "Add"} discount code</h3>
            <Input label="Code" value={editing.code} onChange={(v) => setEditing({ ...editing, code: v.toUpperCase() })} placeholder="SUMMER25" />
            <Input label="Description" value={editing.description} onChange={(v) => setEditing({ ...editing, description: v })} required={false} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Percent off (%)" type="number" value={editing.percent_off} onChange={(v) => setEditing({ ...editing, percent_off: v, amount_off: v ? "" : editing.amount_off })} required={false} />
              <Input label="Amount off (LKR)" type="number" value={editing.amount_off} onChange={(v) => setEditing({ ...editing, amount_off: v, percent_off: v ? "" : editing.percent_off })} required={false} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Min order (LKR)" type="number" value={editing.min_order} onChange={(v) => setEditing({ ...editing, min_order: v })} />
              <Input label="Expires on" type="date" value={editing.expires_at} onChange={(v) => setEditing({ ...editing, expires_at: v })} required={false} />
            </div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} /> Active</label>
            <Actions onCancel={() => setEditing(null)} label={editing.id ? "Save" : "Add"} />
          </form>
        </Modal>
      )}
    </div>
  );
}
