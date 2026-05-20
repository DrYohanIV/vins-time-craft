import { Link } from "@tanstack/react-router";
import { MapPin, Phone } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10">
        <div>
          <div className="font-display text-2xl text-gradient-gold mb-2">Vins Watch</div>
          <p className="text-sm text-muted-foreground">
            Crafted timepieces for those who measure life in moments, not minutes.
          </p>
        </div>
        <div className="text-sm space-y-2">
          <h4 className="font-display text-lg mb-3 text-[var(--color-gold-soft)]">Visit Us</h4>
          <p className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 text-[var(--color-gold)]" /> 43 Greens Rd, Negombo</p>
          <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-[var(--color-gold)]" /> 0312 230 598</p>
        </div>
        <div className="text-sm space-y-2">
          <h4 className="font-display text-lg mb-3 text-[var(--color-gold-soft)]">Explore</h4>
          <Link to="/shop" className="block hover:text-[var(--color-gold-soft)]">Shop watches</Link>
          <Link to="/contact" className="block hover:text-[var(--color-gold-soft)]">Contact</Link>
          <Link to="/account" className="block hover:text-[var(--color-gold-soft)]">My account</Link>
        </div>
      </div>
      <div className="border-t border-[var(--color-border)] py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Vins Watch. All rights reserved.
      </div>
    </footer>
  );
}
