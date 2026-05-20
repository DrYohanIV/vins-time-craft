import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { WatchCard } from "@/components/watch-card";
import { Search } from "lucide-react";

export const Route = createFileRoute("/shop")({
  component: Shop,
  head: () => ({
    meta: [
      { title: "Shop — Vins Watch" },
      { name: "description", content: "Browse luxury timepieces at Vins Watch, Negombo." },
    ],
  }),
});

function Shop() {
  const [q, setQ] = useState("");
  const { data: watches, isLoading } = useQuery({
    queryKey: ["watches"],
    queryFn: async () => {
      const { data } = await supabase.from("watches").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const filtered = useMemo(() => {
    const s = q.toLowerCase().trim();
    if (!s) return watches ?? [];
    return (watches ?? []).filter(
      (w) => w.name.toLowerCase().includes(s) || w.brand.toLowerCase().includes(s),
    );
  }, [q, watches]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold-soft)]">Collection</div>
          <h1 className="font-display text-5xl mt-1">All watches</h1>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search brand or name…"
            className="w-full glass rounded-full pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[var(--color-gold)]"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center text-muted-foreground py-20">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center text-muted-foreground">
          {q ? "No watches match your search." : "No watches available yet."}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((w) => (
            <WatchCard key={w.id} {...w} price={Number(w.price)} />
          ))}
        </div>
      )}
    </div>
  );
}
