import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/use-auth";
import { formatLKR } from "@/lib/cart";

export const Route = createFileRoute("/_authenticated/account")({ component: Account });

const STATUS_COLORS: Record<string, string> = {
  pending: "text-amber-300",
  confirmed: "text-blue-300",
  shipped: "text-purple-300",
  delivered: "text-emerald-300",
  cancelled: "text-rose-300",
};

function Account() {
  const { user } = useAuth();

  const { data: orders } = useQuery({
    queryKey: ["my-orders", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold-soft)]">My account</div>
        <h1 className="font-display text-4xl mt-1">Orders</h1>
        <p className="text-sm text-muted-foreground mt-1">{user?.email}</p>
      </div>

      {!orders?.length ? (
        <div className="glass rounded-2xl p-12 text-center text-muted-foreground">No orders yet.</div>
      ) : (
        <div className="space-y-4">
          {orders.map((o: any) => (
            <div key={o.id} className="glass rounded-2xl p-5">
              <div className="flex flex-wrap justify-between gap-2 mb-3">
                <div>
                  <div className="text-xs text-muted-foreground">Order #{o.id.slice(0, 8)}</div>
                  <div className="text-sm">{new Date(o.created_at).toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className={`text-sm uppercase tracking-wider ${STATUS_COLORS[o.status] ?? ""}`}>{o.status}</div>
                  <div className="text-gradient-gold font-semibold">{formatLKR(Number(o.total))}</div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground border-t border-[var(--color-border)] pt-3 space-y-1">
                {o.order_items?.map((it: any) => (
                  <div key={it.id} className="flex justify-between">
                    <span>{it.watch_name} × {it.quantity}</span>
                    <span>{formatLKR(Number(it.unit_price) * it.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="text-xs text-muted-foreground mt-3">
                {o.payment_method === "cod" ? "Cash on Delivery" : "Online Payment"} · {o.customer_address}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
