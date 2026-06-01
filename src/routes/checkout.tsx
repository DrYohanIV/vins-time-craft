import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useCart, formatLKR } from "@/lib/cart";
import { useAuth } from "@/lib/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { placeOrder as placeOrderFn } from "@/lib/orders.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({ component: Checkout });

function Checkout() {
  const { items, total, clear } = useCart();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", address: "", notes: "" });
  const [payment, setPayment] = useState<"cod" | "online">("cod");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle().then(({ data }) => {
      if (data) setForm((f) => ({ ...f, name: data.full_name ?? f.name, phone: data.phone ?? f.phone, address: data.address ?? f.address }));
    });
  }, [user]);

  if (loading) return <div className="text-center py-20 text-muted-foreground">Loading…</div>;
  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 px-6 text-center">
        <h1 className="font-display text-3xl mb-3">Sign in to continue</h1>
        <p className="text-muted-foreground mb-6">Please sign in to place an order.</p>
        <Link to="/auth" search={{ redirect: "/checkout" }} className="px-6 py-3 rounded-full btn-gold">Sign in</Link>
      </div>
    );
  }
  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 px-6 text-center">
        <h1 className="font-display text-3xl mb-3">Your cart is empty</h1>
        <Link to="/shop" className="px-6 py-3 rounded-full btn-gold">Browse watches</Link>
      </div>
    );
  }

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) {
      toast.error("Please fill all required fields");
      return;
    }
    setSubmitting(true);
    try {
      await placeOrderFn({
        data: {
          customer_name: form.name,
          customer_phone: form.phone,
          customer_address: form.address,
          notes: form.notes || null,
          payment_method: payment,
          items: items.map((i) => ({ watch_id: i.id, quantity: i.quantity })),
        },
      });

      // Save profile details for next time
      await supabase
        .from("profiles")
        .update({ full_name: form.name, phone: form.phone, address: form.address })
        .eq("id", user.id);

      clear();
      toast.success("Order placed! We'll be in touch.");
      navigate({ to: "/account" });
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Couldn't place order. Try again.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 grid lg:grid-cols-[1fr_360px] gap-6">
      <form onSubmit={placeOrder} className="glass-strong rounded-2xl p-6 space-y-4">
        <h1 className="font-display text-3xl mb-2">Checkout</h1>
        <Field label="Full name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
        <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
        <Field label="Delivery address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} multiline />
        <Field label="Order notes (optional)" value={form.notes} onChange={(v) => setForm({ ...form, notes: v })} required={false} multiline />

        <div>
          <div className="text-sm mb-2 text-muted-foreground">Payment method</div>
          <div className="grid grid-cols-2 gap-3">
            {(["cod", "online"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPayment(p)}
                className={`p-4 rounded-xl text-sm text-left transition-all ${
                  payment === p ? "btn-gold" : "btn-glass"
                }`}
              >
                <div className="font-semibold">{p === "cod" ? "Cash on Delivery" : "Online Payment"}</div>
                <div className="text-xs opacity-80 mt-0.5">
                  {p === "cod" ? "Pay when your watch arrives" : "Bank transfer — we'll send details"}
                </div>
              </button>
            ))}
          </div>
        </div>

        <button disabled={submitting} className="w-full mt-4 py-3 rounded-full btn-gold disabled:opacity-50">
          {submitting ? "Placing order…" : `Place order · ${formatLKR(total)}`}
        </button>
      </form>

      <div className="glass rounded-2xl p-6 h-fit">
        <h3 className="font-display text-xl mb-4">Order summary</h3>
        <div className="space-y-3">
          {items.map((i) => (
            <div key={i.id} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{i.name} × {i.quantity}</span>
              <span>{formatLKR(i.price * i.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-[var(--color-border)] mt-4 pt-4 flex justify-between font-display text-lg">
          <span>Total</span>
          <span className="text-gradient-gold">{formatLKR(total)}</span>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, multiline, required = true }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}{required && " *"}</span>
      {multiline ? (
        <textarea required={required} value={value} onChange={(e) => onChange(e.target.value)} rows={3} className="mt-1 w-full glass rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--color-gold)]" />
      ) : (
        <input required={required} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full glass rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--color-gold)]" />
      )}
    </label>
  );
}
