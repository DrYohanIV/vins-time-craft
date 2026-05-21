import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatLKR } from "@/lib/cart";

export const Route = createFileRoute("/_authenticated/admin/")({ component: AdminHome });

function AdminHome() {
  const { data } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [watches, orders] = await Promise.all([
        supabase.from("watches").select("id, stock"),
        supabase.from("orders").select("id, total, status, created_at"),
      ]);
      const revenue = (orders.data ?? []).filter((o) => o.status !== "cancelled").reduce((s, o) => s + Number(o.total), 0);
      const pending = (orders.data ?? []).filter((o) => o.status === "pending").length;
      const lowStock = (watches.data ?? []).filter((w) => w.stock <= 3).length;
      return {
        watchCount: watches.data?.length ?? 0,
        totalStock: (watches.data ?? []).reduce((s, w) => s + w.stock, 0),
        orderCount: orders.data?.length ?? 0,
        revenue,
        pending,
        lowStock,
      };
    },
  });

  const stats = [
    { label: "Watches", value: data?.watchCount ?? 0 },
    { label: "Total stock", value: data?.totalStock ?? 0 },
    { label: "Low stock", value: data?.lowStock ?? 0, warn: (data?.lowStock ?? 0) > 0 },
    { label: "Orders", value: data?.orderCount ?? 0 },
    { label: "Pending", value: data?.pending ?? 0 },
    { label: "Revenue", value: formatLKR(data?.revenue ?? 0) },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="glass rounded-2xl p-5">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
          <div className="font-display text-3xl text-gradient-gold mt-1">{s.value}</div>
        </div>
      ))}
    </div>
  );
}
