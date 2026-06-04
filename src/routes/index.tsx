import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Award, ShieldCheck, Sparkles, ChevronLeft, ChevronRight, Flame } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
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
  const { data: banners } = useQuery({
    queryKey: ["home-banners"],
    queryFn: async () => (await supabase.from("banners").select("*").eq("active", true).order("sort_order")).data ?? [],
  });
  const { data: brandCategories } = useQuery({
    queryKey: ["home-brand-categories"],
    queryFn: async () => (await supabase.from("brand_categories").select("*").eq("active", true).order("sort_order")).data ?? [],
  });
  const { data: newArrivals } = useQuery({
    queryKey: ["new-arrivals"],
    queryFn: async () => (await supabase.from("watches").select("*").eq("featured", true).order("created_at", { ascending: false }).limit(6)).data ?? [],
  });
  const { data: hotSellers } = useQuery({
    queryKey: ["hot-sellers"],
    queryFn: async () => (await supabase.from("watches").select("*").eq("hot_seller", true).order("created_at", { ascending: false }).limit(6)).data ?? [],
  });
  const { data: collections } = useQuery({
    queryKey: ["home-collections"],
    queryFn: async () => (await supabase.from("collections").select("*").eq("active", true).order("sort_order")).data ?? [],
  });
  const { data: promos } = useQuery({
    queryKey: ["home-promotions"],
    queryFn: async () => (await supabase.from("promotions").select("*").eq("active", true).order("sort_order")).data ?? [],
  });

  return (
    <div>
      {/* Top banner carousel */}
      <BannerCarousel banners={banners ?? []} />

      {/* Live time strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6 text-center text-xs uppercase tracking-[0.4em] text-muted-foreground">
        Live · Negombo · <LiveTime />
      </div>

      {/* Brand categories carousel */}
      {brandCategories && brandCategories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-16">
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold-soft)]">Shop by brand</div>
              <h2 className="font-display text-3xl sm:text-4xl mt-1">Iconic makers</h2>
            </div>
          </div>
          <BrandStrip items={brandCategories} />
        </section>
      )}

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

      {/* New arrivals */}
      <WatchRow
        kicker="Just in"
        title="New arrivals"
        watches={newArrivals ?? []}
        emptyText="Mark watches as 'New arrival' in the admin panel to feature them here."
      />

      {/* Hot sellers */}
      <WatchRow
        kicker={<><Flame className="w-3 h-3 inline mr-1" /> Trending</>}
        title="Hot sellers"
        watches={hotSellers ?? []}
        emptyText="Mark watches as 'Hot seller' in the admin panel to feature them here."
      />

      {/* Explore collections */}
      {collections && collections.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-24 mb-24">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold-soft)]">Curated</div>
              <h2 className="font-display text-4xl mt-1">Explore collections</h2>
            </div>
          </div>
          <CollectionsGrid items={collections} />
        </section>
      )}
    </div>
  );
}

function BannerCarousel({ banners }: { banners: any[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    const i = setInterval(() => emblaApi.scrollNext(), 5000);
    return () => { clearInterval(i); emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  if (!banners.length) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-10">
        <div className="glass rounded-3xl p-16 text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold-soft)] mb-3">Welcome</div>
          <h1 className="font-display text-5xl sm:text-6xl">Vins Watch</h1>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto">Add banners in the admin panel to showcase featured collections at the top of your store.</p>
          <Link to="/shop" className="inline-flex items-center gap-2 mt-8 px-8 py-3.5 rounded-full btn-gold">
            Shop collection <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
      <div className="relative">
        <div className="overflow-hidden rounded-3xl glass" ref={emblaRef}>
          <div className="flex">
            {banners.map((b) => (
              <div key={b.id} className="relative flex-[0_0_100%] min-w-0">
                <div className="relative h-[360px] sm:h-[480px] lg:h-[560px] overflow-hidden">
                  {b.image_url ? (
                    <img src={b.image_url} alt={b.title} className="absolute inset-0 w-full h-full object-cover scale-105 animate-[kenburns_20s_ease-in-out_infinite_alternate]" />
                  ) : (
                    <div className="absolute inset-0" style={{ background: "var(--gradient-bg)" }} />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-transparent" />
                  <div className="relative h-full flex flex-col justify-center px-8 sm:px-14 lg:px-20 max-w-2xl animate-fade-in">
                    <div className="text-xs uppercase tracking-[0.4em] text-[var(--color-gold-soft)] mb-4">Featured</div>
                    <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl leading-[1.02]">{b.title}</h2>
                    {b.subtitle && <p className="text-muted-foreground mt-4 text-base sm:text-lg max-w-md">{b.subtitle}</p>}
                    {b.cta_label && b.cta_url && (
                      <a href={b.cta_url} className="mt-8 px-7 py-3 rounded-full btn-gold w-fit inline-flex items-center gap-2">
                        {b.cta_label} <ArrowRight className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {banners.length > 1 && (
          <>
            <button onClick={() => emblaApi?.scrollPrev()} className="absolute left-3 top-1/2 -translate-y-1/2 glass-strong rounded-full p-2.5 hover:text-[var(--color-gold)]" aria-label="Previous"><ChevronLeft className="w-5 h-5" /></button>
            <button onClick={() => emblaApi?.scrollNext()} className="absolute right-3 top-1/2 -translate-y-1/2 glass-strong rounded-full p-2.5 hover:text-[var(--color-gold)]" aria-label="Next"><ChevronRight className="w-5 h-5" /></button>
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
              {banners.map((_, i) => (
                <button key={i} onClick={() => emblaApi?.scrollTo(i)} className={`h-1.5 rounded-full transition-all ${i === selected ? "w-8 bg-[var(--color-gold)]" : "w-1.5 bg-white/40"}`} aria-label={`Slide ${i + 1}`} />
              ))}
            </div>
          </>
        )}
      </div>

      <style>{`@keyframes kenburns { 0% { transform: scale(1.05) translate(0,0); } 100% { transform: scale(1.15) translate(-2%, -1%); } }`}</style>
    </section>
  );
}

function BrandStrip({ items }: { items: any[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", dragFree: true, loop: items.length > 6 });

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {items.map((b) => (
            <Link
              key={b.id}
              to="/shop"
              search={{ brand: b.name } as any}
              className="flex-[0_0_140px] sm:flex-[0_0_160px] group"
            >
              <div className="aspect-square glass rounded-2xl overflow-hidden relative hover-scale">
                {b.image_url ? (
                  <img src={b.image_url} alt={b.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-display text-2xl text-[var(--color-gold-soft)]">{b.name[0]}</div>
                )}
                <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="text-sm font-medium text-center truncate">{b.name}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      {items.length > 4 && (
        <>
          <button onClick={() => emblaApi?.scrollPrev()} className="hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 glass-strong rounded-full p-2 hover:text-[var(--color-gold)]"><ChevronLeft className="w-4 h-4" /></button>
          <button onClick={() => emblaApi?.scrollNext()} className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 glass-strong rounded-full p-2 hover:text-[var(--color-gold)]"><ChevronRight className="w-4 h-4" /></button>
        </>
      )}
    </div>
  );
}

function WatchRow({ kicker, title, watches, emptyText }: { kicker: React.ReactNode; title: string; watches: any[]; emptyText: string }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-24">
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold-soft)]">{kicker}</div>
          <h2 className="font-display text-4xl mt-1">{title}</h2>
        </div>
        <Link to="/shop" className="text-sm text-[var(--color-gold-soft)] hover:underline">View all →</Link>
      </div>
      {!watches.length ? (
        <div className="glass rounded-2xl p-12 text-center text-muted-foreground">{emptyText}</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {watches.map((w) => <WatchCard key={w.id} {...w} price={Number(w.price)} />)}
        </div>
      )}
    </section>
  );
}

const SIZE_CLASS: Record<string, string> = {
  small: "col-span-1 row-span-1 aspect-square",
  medium: "col-span-2 row-span-1 aspect-[2/1]",
  large: "col-span-2 row-span-2 aspect-square",
  wide: "col-span-3 row-span-1 aspect-[3/1]",
  tall: "col-span-1 row-span-2 aspect-[1/2]",
};

function CollectionsGrid({ items }: { items: any[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[160px] sm:auto-rows-[200px] gap-4">
      {items.map((c) => {
        const Card = (
          <div className="relative w-full h-full overflow-hidden rounded-2xl glass group">
            {c.image_url ? (
              <img src={c.image_url} alt={c.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            ) : (
              <div className="absolute inset-0" style={{ background: "var(--gradient-bg)" }} />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="relative h-full flex flex-col justify-end p-5">
              <div className="font-display text-xl sm:text-2xl">{c.title}</div>
              {c.subtitle && <div className="text-sm text-muted-foreground mt-1 line-clamp-2">{c.subtitle}</div>}
              <div className="mt-2 text-xs text-[var(--color-gold)] inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">Explore <ArrowRight className="w-3 h-3" /></div>
            </div>
          </div>
        );
        const cls = `${SIZE_CLASS[c.size] ?? SIZE_CLASS.medium} min-h-0`;
        return c.link_url ? (
          <a key={c.id} href={c.link_url} className={cls}>{Card}</a>
        ) : (
          <div key={c.id} className={cls}>{Card}</div>
        );
      })}
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
