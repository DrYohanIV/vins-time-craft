import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatLKR, useCart } from "@/lib/cart";
import { toast } from "sonner";
import { ShoppingBag, Minus, Plus } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/watch/$id")({
  component: WatchDetail,
});

function WatchDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  const { data: watch, isLoading } = useQuery({
    queryKey: ["watch", id],
    queryFn: async () => {
      const { data } = await supabase.from("watches").select("*").eq("id", id).single();
      return data;
    },
  });

  if (isLoading) return <div className="text-center py-20 text-muted-foreground">Loading…</div>;
  if (!watch) return <div className="text-center py-20 text-muted-foreground">Watch not found.</div>;

  const inStock = watch.stock > 0;
  const gallery = [watch.image_url, ...((watch.images as string[] | null) ?? [])].filter(Boolean) as string[];
  const active = gallery[Math.min(activeImg, Math.max(0, gallery.length - 1))];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid md:grid-cols-2 gap-10">
      <div>
        <div className="glass-strong rounded-3xl overflow-hidden aspect-square">
          {active ? (
            <img src={active} alt={watch.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-48 h-48 rounded-full" style={{ background: "var(--gradient-gold)", opacity: 0.4 }} />
            </div>
          )}
        </div>
        {gallery.length > 1 && (
          <div className="mt-3 grid grid-cols-5 gap-2">
            {gallery.map((url, i) => (
              <button
                key={url + i}
                onClick={() => setActiveImg(i)}
                className={`aspect-square rounded-xl overflow-hidden glass transition ${i === activeImg ? "ring-2 ring-[var(--color-gold)]" : "opacity-70 hover:opacity-100"}`}
              >
                <img src={url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
      <div>
        <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold-soft)]">{watch.brand}</div>
        <h1 className="font-display text-5xl mt-2">{watch.name}</h1>
        <div className="mt-4 text-3xl text-gradient-gold font-semibold">{formatLKR(Number(watch.price))}</div>
        <p className="mt-6 text-muted-foreground leading-relaxed">{watch.description || "A timeless piece from our curated Vins Watch collection."}</p>

        <div className="mt-8 flex items-center gap-4">
          <div className="glass rounded-full flex items-center">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3"><Minus className="w-4 h-4" /></button>
            <div className="w-10 text-center">{qty}</div>
            <button onClick={() => setQty((q) => q + 1)} className="p-3"><Plus className="w-4 h-4" /></button>
          </div>
          <div className="text-sm text-muted-foreground">
            {inStock ? `${watch.stock} in stock` : "Sold out"}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            disabled={!inStock}
            onClick={() => {
              add({ id: watch.id, name: watch.name, brand: watch.brand, price: Number(watch.price), image_url: watch.image_url }, qty);
              toast.success("Added to cart");
            }}
            className="px-7 py-3 rounded-full btn-gold inline-flex items-center gap-2 disabled:opacity-50"
          >
            <ShoppingBag className="w-4 h-4" /> Add to cart
          </button>
          <button
            disabled={!inStock}
            onClick={() => {
              add({ id: watch.id, name: watch.name, brand: watch.brand, price: Number(watch.price), image_url: watch.image_url }, qty);
              navigate({ to: "/checkout" });
            }}
            className="px-7 py-3 rounded-full btn-glass disabled:opacity-50"
          >
            Buy now
          </button>
        </div>
      </div>
    </div>
  );
}
