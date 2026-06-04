import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/lib/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { Package, ShoppingBag, LayoutDashboard, MessageSquare, Megaphone, Tag, Image as ImageIcon, Layers, Grid3x3 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({ component: AdminLayout });

function AdminLayout() {
  const { isAdmin, loading, refreshRole } = useAuth();
  const [claiming, setClaiming] = useState(false);
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  if (loading) return <div className="text-center py-20 text-muted-foreground">Loading…</div>;

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto py-20 px-6 text-center">
        <div className="glass-strong rounded-3xl p-8">
          <h1 className="font-display text-3xl text-gradient-gold mb-2">Admin access</h1>
          <p className="text-sm text-muted-foreground mb-6">
            You are not an admin yet. If no admin has been set up for this store, you can claim the admin role with the button below — this works only once.
          </p>
          <button
            disabled={claiming}
            onClick={async () => {
              setClaiming(true);
              const { data, error } = await supabase.rpc("claim_admin");
              if (error || !data) toast.error("Admin already claimed by another account.");
              else {
                toast.success("You are now the admin!");
                await refreshRole();
              }
              setClaiming(false);
            }}
            className="px-6 py-3 rounded-full btn-gold disabled:opacity-50"
          >
            {claiming ? "Claiming…" : "Claim admin role"}
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { to: "/admin", label: "Overview", icon: LayoutDashboard },
    { to: "/admin/watches", label: "Watches", icon: Package },
    { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
    { to: "/admin/messages", label: "Messages", icon: MessageSquare },
    { to: "/admin/promotions", label: "Promotions", icon: Megaphone },
    { to: "/admin/discounts", label: "Discounts", icon: Tag },
    { to: "/admin/banners", label: "Banners", icon: ImageIcon },
    { to: "/admin/brands", label: "Brands", icon: Grid3x3 },
    { to: "/admin/collections", label: "Collections", icon: Layers },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold-soft)]">Admin</div>
        <h1 className="font-display text-4xl mt-1">Vins Watch Console</h1>
      </div>
      <div className="glass rounded-2xl p-1.5 inline-flex gap-1 mb-6 flex-wrap">
        {tabs.map((t) => {
          const active = pathname === t.to;
          return (
            <Link key={t.to} to={t.to} className={`px-4 py-2 rounded-xl text-sm inline-flex items-center gap-2 transition-all ${active ? "btn-gold" : "hover:bg-white/5"}`}>
              <t.icon className="w-4 h-4" /> {t.label}
            </Link>
          );
        })}
      </div>
      <Outlet />
    </div>
  );
}
