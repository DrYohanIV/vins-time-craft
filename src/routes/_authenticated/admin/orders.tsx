import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatLKR } from "@/lib/cart";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/orders")({ component: AdminOrders });

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"] as const;

function AdminOrders() {
  const qc = useQueryClient();
  const { data: orders } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () =>
      (await supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false })).data ?? [],
  });

  const setStatus = async (id: string, status: typeof STATUSES[number]) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Status updated");
    qc.invalidateQueries({ queryKey: ["admin-orders"] });
  };

  return (
    <div>
      <h2 className="font-display text-2xl mb-4">Orders</h2>
      {!orders?.length ? (
        <div className="glass rounded-2xl p-12 text-center text-muted-foreground">No orders yet.</div>
      ) : (
        <div className="space-y-3">
          {orders.map((o: any) => (
            <div key={o.id} className="glass rounded-2xl p-5">
              <div className="flex flex-wrap justify-between gap-3 mb-3">
                <div>
                  <div className="text-xs text-muted-foreground">Order #{o.id.slice(0, 8)} · {new Date(o.created_at).toLocaleString()}</div>
                  <div className="font-display text-lg">{o.customer_name}</div>
                  <div className="text-sm text-muted-foreground">{o.customer_phone} · {o.customer_address}</div>
                  {o.notes && <div className="text-xs text-muted-foreground mt-1 italic">Note: {o.notes}</div>}
                </div>
                <div className="text-right">
                  <div className="text-gradient-gold font-semibold text-lg">{formatLKR(Number(o.total))}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                    {o.payment_method === "cod" ? "Cash on delivery" : "Online payment"}
                  </div>
                  <select value={o.status} onChange={(e) => setStatus(o.id, e.target.value as typeof STATUSES[number])} className="mt-2 glass rounded-full px-3 py-1.5 text-xs outline-none">
                    {STATUSES.map((s) => <option key={s} value={s} className="bg-[var(--background)]">{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="text-sm border-t border-[var(--color-border)] pt-3 space-y-1">
                {o.order_items?.map((it: any) => (
                  <div key={it.id} className="flex justify-between">
                    <span>{it.watch_name} × {it.quantity}</span>
                    <span className="text-muted-foreground">{formatLKR(Number(it.unit_price) * it.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
