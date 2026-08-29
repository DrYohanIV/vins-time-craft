import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { WatchCard } from "@/components/watch-card";
import { formatLKR } from "@/lib/cart";
import { Search, X } from "lucide-react";

const PRICE_MIN = 0;
const PRICE_MAX = 500000;
const PRICE_STEP = 5000;

const RANGE_CLS =
  "pointer-events-none appearance-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--color-gold)] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[var(--color-espresso)] [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-grab active:[&::-webkit-slider-thumb]:cursor-grabbing [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[var(--color-gold)] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[var(--color-espresso)] [&::-moz-range-thumb]:cursor-grab";

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
  const [brandFilter, setBrandFilter] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState(PRICE_MIN);
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX);

  const { data: watches, isLoading } = useQuery({
    queryKey: ["watches"],
    queryFn: async () => {
      const { data } = await supabase
        .from("watches")
        .select("*")
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const brands = useMemo(() => {
    const set = new Set((watches ?? []).map((w) => w.brand));
    return Array.from(set).sort();
  }, [watches]);

  const filtered = useMemo(() => {
    let result = watches ?? [];
    const s = q.toLowerCase().trim();
    if (s) {
      result = result.filter(
        (w) => w.name.toLowerCase().includes(s) || w.brand.toLowerCase().includes(s),
      );
    }
    if (brandFilter) {
      result = result.filter((w) => w.brand === brandFilter);
    }
    result = result.filter((w) => {
      const p = Number(w.price);
      return p >= minPrice && (maxPrice >= PRICE_MAX || p <= maxPrice);
    });
    return result;
  }, [q, brandFilter, minPrice, maxPrice, watches]);

  const priceFiltered = minPrice > PRICE_MIN || maxPrice < PRICE_MAX;
  const resetFilters = () => {
    setQ("");
    setBrandFilter(null);
    setMinPrice(PRICE_MIN);
    setMaxPrice(PRICE_MAX);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold-soft)]">
            Collection
          </div>
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

      {brands.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <button
            onClick={() => setBrandFilter(null)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              brandFilter === null
                ? "bg-[var(--color-gold)] text-[var(--color-espresso)]"
                : "glass text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          {brands.map((b) => (
            <button
              key={b}
              onClick={() => setBrandFilter(b)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                brandFilter === b
                  ? "bg-[var(--color-gold)] text-[var(--color-espresso)]"
                  : "glass text-muted-foreground hover:text-foreground"
              }`}
            >
              {b}
            </button>
          ))}
          {brandFilter && (
            <button
              onClick={() => setBrandFilter(null)}
              className="ml-1 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-3 mb-8">
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground shrink-0">
          Price
        </span>
        <div className="relative w-full sm:w-72 h-5 flex items-center select-none">
          <div className="absolute inset-x-0 h-1 rounded-full bg-white/10" />
          <div
            className="absolute h-1 rounded-full bg-[var(--color-gold)]"
            style={{
              left: `${(minPrice / PRICE_MAX) * 100}%`,
              width: `${((maxPrice - minPrice) / PRICE_MAX) * 100}%`,
            }}
          />
          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={PRICE_STEP}
            value={minPrice}
            onChange={(e) => setMinPrice(Math.min(Number(e.target.value), maxPrice - PRICE_STEP))}
            aria-label="Minimum price"
            className={`price-range-input absolute w-full bg-transparent ${RANGE_CLS}`}
          />
          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={PRICE_STEP}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Math.max(Number(e.target.value), minPrice + PRICE_STEP))}
            aria-label="Maximum price"
            className={`price-range-input absolute w-full bg-transparent ${RANGE_CLS}`}
          />
        </div>
        <div className="text-sm tabular-nums text-muted-foreground">
          {formatLKR(minPrice)} —{" "}
          {maxPrice >= PRICE_MAX ? `${formatLKR(PRICE_MAX)}+` : formatLKR(maxPrice)}
        </div>
        {(minPrice > PRICE_MIN || maxPrice < PRICE_MAX) && (
          <button
            onClick={() => {
              setMinPrice(PRICE_MIN);
              setMaxPrice(PRICE_MAX);
            }}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="text-center text-muted-foreground py-20">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center text-muted-foreground">
          {q || brandFilter || priceFiltered ? (
            <>
              No watches match your filters.{" "}
              <button
                onClick={resetFilters}
                className="underline underline-offset-2 hover:text-[var(--color-gold)]"
              >
                Clear all
              </button>
            </>
          ) : (
            "No watches available yet."
          )}
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
