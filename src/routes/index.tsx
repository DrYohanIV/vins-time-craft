import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Award, ShieldCheck, Sparkles } from "lucide-react";
import heroImg from "@/assets/hero-watch.jpg";
import { supabase } from "@/integrations/supabase/client";
import { WatchCard } from "@/components/watch-card";


export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Vins Watch — Luxury Timepieces in Negombo" },
      { name: "description", content: "Discover premium luxury watches at Vins Watch in Negombo. Curated brands, certified authenticity, island-wide delivery." },
    ],
  }),
});

function Home() {
  const { data: featured } = useQuery({
    queryKey: ["featured-watches"],
    queryFn: async () => (await supabase.from("watches").select("*").order("featured", { ascending: false }).order("created_at", { ascending: false }).limit(6)).data ?? [],
  });
  const { data: banners } = useQuery({
    queryKey: ["home-banners"],
    queryFn: async () => (await supabase.from("banners").select("*").eq("active", true).order("sort_order")).data ?? [],
  });
  const { data: promos } = useQuery({
    queryKey: ["home-promotions"],
    queryFn: async () => (await supabase.from("promotions").select("*").eq("active", true).order("sort_order")).data ?? [],
  });

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-28 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full text-xs text-[var(--color-gold-soft)] mb-8 animate-fade-in">
            <Sparkles className="w-3 h-3" /> Est. Negombo · Luxury Timepieces
          </div>
          <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl leading-[1.02] max-w-4xl">
            Time, <span className="shimmer-gold italic">refined</span>
            <br />in matte gold.
          </h1>
          <p className="mt-8 text-lg text-muted-foreground max-w-xl">
            A curated collection of precision timepieces. Hand-picked by Vins Watch — Negombo's
            destination for fine horology.
          </p>
          <div className="mt-10 flex flex-wrap gap-3 justify-center">
            <Link to="/shop" className="px-8 py-3.5 rounded-full btn-gold inline-flex items-center gap-2">
              Shop collection <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/contact" className="px-8 py-3.5 rounded-full btn-glass">
              Visit our store
            </Link>
          </div>

          <div className="mt-6 text-xs uppercase tracking-[0.4em] text-muted-foreground">
            Live · Negombo · <LiveTime />
          </div>
        </div>

        {/* Hero image strip */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="glass rounded-3xl overflow-hidden relative">
            <img src={heroImg} alt="Luxury gold wristwatch" width={1920} height={1080} className="w-full h-[300px] sm:h-[420px] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* Promotions strip */}
      {promos && promos.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {promos.map((p) => (
            <div key={p.id} className="glass rounded-2xl p-5">
              <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold-soft)] mb-2">Promotion</div>
              <div className="font-display text-xl">{p.title}</div>
              {p.subtitle && <div className="text-sm text-muted-foreground mt-1">{p.subtitle}</div>}
              {p.cta_label && p.cta_url && (
                <a href={p.cta_url} className="inline-block mt-3 text-sm text-[var(--color-gold)] hover:underline">{p.cta_label} →</a>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Banners */}
      {banners && banners.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-16 space-y-5">
          {banners.map((b) => (
            <div key={b.id} className="glass rounded-3xl overflow-hidden relative">
              {b.image_url && <img src={b.image_url} alt={b.title} className="w-full h-[260px] sm:h-[340px] object-cover" />}
              <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent flex flex-col justify-center p-8 sm:p-12">
                <h3 className="font-display text-3xl sm:text-4xl max-w-md">{b.title}</h3>
                {b.subtitle && <p className="text-muted-foreground mt-2 max-w-md">{b.subtitle}</p>}
                {b.cta_label && b.cta_url && (
                  <a href={b.cta_url} className="mt-4 px-6 py-2.5 rounded-full btn-gold text-sm w-fit">{b.cta_label}</a>
                )}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-20 grid sm:grid-cols-3 gap-5">
        {[
          { icon: Award, t: "Authentic", d: "Every timepiece certified by Vins specialists." },
          { icon: ShieldCheck, t: "Warranty", d: "International manufacturer warranty included." },
          { icon: Sparkles, t: "Free delivery", d: "Island-wide shipping on orders above LKR 50,000." },
        ].map((f) => (
          <div key={f.t} className="glass rounded-2xl p-6">
            <f.icon className="w-6 h-6 text-[var(--color-gold)]" />
            <div className="font-display text-xl mt-3">{f.t}</div>
            <div className="text-sm text-muted-foreground mt-1">{f.d}</div>
          </div>
        ))}
      </section>

      {/* Featured */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-24">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold-soft)]">Featured</div>
            <h2 className="font-display text-4xl mt-1">New arrivals</h2>
          </div>
          <Link to="/shop" className="text-sm text-[var(--color-gold-soft)] hover:underline">View all →</Link>
        </div>

        {!featured?.length ? (
          <div className="glass rounded-2xl p-12 text-center text-muted-foreground">
            No watches yet. Visit the admin panel to add your first timepiece.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {featured.map((w) => (
              <WatchCard key={w.id} {...w} price={Number(w.price)} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function LiveTime() {
  const [t, setT] = useState<string>("");
  useEffect(() => {
    const update = () => setT(new Date().toLocaleTimeString("en-LK", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }));
    update();
    const i = setInterval(update, 1000);
    return () => clearInterval(i);
  }, []);
  return <span className="text-[var(--color-gold-soft)] tabular-nums">{t || "--:--:--"}</span>;
}
