import { createFileRoute, Link } from "@tanstack/react-router";
import { formatLKR, useCart } from "@/lib/cart";
import { Minus, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/cart")({ component: Cart });

function Cart() {
  const { items, setQty, remove, total } = useCart();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-display text-5xl mb-8">Your cart</h1>
      {items.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <p className="text-muted-foreground">Your cart is empty.</p>
          <Link to="/shop" className="inline-block mt-5 px-6 py-2 rounded-full btn-gold text-sm">Browse watches</Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_360px] gap-6">
          <div className="space-y-3">
            {items.map((i) => (
              <div key={i.id} className="glass rounded-2xl p-4 flex gap-4 items-center">
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0" style={{ background: "var(--gradient-bg)" }}>
                  {i.image_url && <img src={i.image_url} alt={i.name} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs uppercase tracking-wider text-[var(--color-gold-soft)]">{i.brand}</div>
                  <div className="font-display text-lg truncate">{i.name}</div>
                  <div className="text-sm text-gradient-gold">{formatLKR(i.price)}</div>
                </div>
                <div className="glass rounded-full flex items-center">
                  <button onClick={() => setQty(i.id, i.quantity - 1)} className="p-2"><Minus className="w-3 h-3" /></button>
                  <div className="w-8 text-center text-sm">{i.quantity}</div>
                  <button onClick={() => setQty(i.id, i.quantity + 1)} className="p-2"><Plus className="w-3 h-3" /></button>
                </div>
                <button onClick={() => remove(i.id)} className="p-2 text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="glass-strong rounded-2xl p-6 h-fit sticky top-24">
            <h3 className="font-display text-2xl mb-4">Summary</h3>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatLKR(total)}</span>
            </div>
            <div className="flex justify-between text-sm mb-4">
              <span className="text-muted-foreground">Shipping</span>
              <span>{total >= 50000 ? "Free" : "Calculated at checkout"}</span>
            </div>
            <div className="flex justify-between font-display text-xl border-t border-[var(--color-border)] pt-4">
              <span>Total</span>
              <span className="text-gradient-gold">{formatLKR(total)}</span>
            </div>
            <Link to="/checkout" className="block text-center mt-6 px-6 py-3 rounded-full btn-gold">
              Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
