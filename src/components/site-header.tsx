import { Link } from "@tanstack/react-router";
import { ShoppingBag, User as UserIcon, LogOut, Shield } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/use-auth";
import { VinsLogo } from "@/components/vins-logo";

export function SiteHeader() {
  const { count } = useCart();
  const { user, isAdmin, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 glass border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5">
          <VinsLogo size={34} />
          <div className="leading-tight">
            <div className="font-display text-xl text-gradient-gold font-semibold tracking-wide">
              <span className="italic">V</span>ins Watch
            </div>
            <div className="text-[10px] tracking-[0.3em] text-[var(--color-stone)] -mt-1">EST. 1980 · NEGOMBO</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm">
          <Link to="/" className="hover:text-[var(--color-gold-soft)] transition-colors" activeProps={{ className: "text-[var(--color-gold-soft)]" }}>Home</Link>
          <Link to="/shop" className="hover:text-[var(--color-gold-soft)] transition-colors" activeProps={{ className: "text-[var(--color-gold-soft)]" }}>Shop</Link>
          <Link to="/contact" className="hover:text-[var(--color-gold-soft)] transition-colors" activeProps={{ className: "text-[var(--color-gold-soft)]" }}>Contact</Link>
          {isAdmin && (
            <Link to="/admin" className="flex items-center gap-1 text-[var(--color-gold-soft)]">
              <Shield className="w-4 h-4" /> Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/cart" className="relative p-2 rounded-full btn-glass">
            <ShoppingBag className="w-4 h-4" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 text-[10px] rounded-full w-5 h-5 flex items-center justify-center btn-gold">
                {count}
              </span>
            )}
          </Link>
          {user ? (
            <>
              <Link to="/account" className="p-2 rounded-full btn-glass">
                <UserIcon className="w-4 h-4" />
              </Link>
              <button onClick={() => signOut()} className="p-2 rounded-full btn-glass" aria-label="Sign out">
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <Link to="/auth" className="px-4 py-2 rounded-full btn-gold text-sm">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
