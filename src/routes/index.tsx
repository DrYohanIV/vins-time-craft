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
    queryFn: async () => {
      const { data } = await supabase
        .from("watches")
        .select("*")
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(6);
      return data ?? [];
    },
  });

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full text-xs text-[var(--color-gold-soft)] mb-6">
              <Sparkles className="w-3 h-3" /> Est. Negombo · Luxury Timepieces
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-[1.05]">
              Time, <span className="text-gradient-gold italic">refined</span>
              <br />in matte gold.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-md">
              A curated collection of precision timepieces. Hand-picked by Vins Watch — Negombo's
              destination for fine horology.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop" className="px-7 py-3 rounded-full btn-gold inline-flex items-center gap-2">
                Shop collection <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/contact" className="px-7 py-3 rounded-full btn-glass">
                Visit our store
              </Link>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="absolute inset-0 -z-10 blur-3xl opacity-40" style={{ background: "var(--gradient-gold)" }} />
            <div className="glass-strong rounded-3xl p-8 flex flex-col items-center gap-6">
              <WatchFace size={280} />
              <div className="text-center">
                <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Live time · Negombo</div>
                <LiveDate />
              </div>
            </div>
          </div>
        </div>

        {/* Hero image strip */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="glass rounded-3xl overflow-hidden">
            <img
              src={heroImg}
              alt="Luxury gold wristwatch"
              width={1920}
              height={1080}
              className="w-full h-[300px] sm:h-[420px] object-cover"
            />
          </div>
        </div>
      </section>

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

function LiveDate() {
  return (
    <div className="font-display text-lg text-[var(--color-gold-soft)] mt-1">
      {new Date().toLocaleDateString("en-LK", { weekday: "long", day: "numeric", month: "long" })}
    </div>
  );
}
