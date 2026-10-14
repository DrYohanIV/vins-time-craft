import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useCart, formatLKR } from "@/lib/cart";
import { useAuth } from "@/lib/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { placeOrder as placeOrderFn } from "@/lib/orders.functions";
import {
  BANK_DETAILS,
  BANK_TRANSFER_NOTE,
  BANK_WHATSAPP,
  DELIVERY_OPTIONS,
  deliveryFeeFor,
  type DeliveryMethod,
} from "@/lib/store-config";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({ component: Checkout });

function Checkout() {
  const { items, total, clear } = useCart();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", address: "", notes: "" });
  const [delivery, setDelivery] = useState<DeliveryMethod>("store_pickup");
  const [submitting, setSubmitting] = useState(false);

  const shippingFee = deliveryFeeFor(delivery);
  const grandTotal = total + shippingFee;
  const needsAddress = delivery === "islandwide_delivery";

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data)
          setForm((f) => ({
            ...f,
            name: data.full_name ?? f.name,
            phone: data.phone ?? f.phone,
            address: data.address ?? f.address,
          }));
      });
  }, [user]);

  if (loading) return <div className="text-center py-20 text-muted-foreground">Loading…</div>;
  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 px-6 text-center">
        <h1 className="font-display text-3xl mb-3">Sign in to continue</h1>
        <p className="text-muted-foreground mb-6">Please sign in to place an order.</p>
        <Link
          to="/auth"
          search={{ redirect: "/checkout" }}
          className="px-6 py-3 rounded-full btn-gold"
        >
          Sign in
        </Link>
      </div>
    );
  }
  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 px-6 text-center">
        <h1 className="font-display text-3xl mb-3">Your cart is empty</h1>
        <Link to="/shop" className="px-6 py-3 rounded-full btn-gold">
          Browse watches
        </Link>
      </div>
    );
  }

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      toast.error("Please fill all required fields");
      return;
    }
    if (needsAddress && !form.address) {
      toast.error("Please enter a delivery address");
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
          delivery_method: delivery,
          items: items.map((i) => ({ watch_id: i.id, quantity: i.quantity })),
        },
      });

      await supabase
        .from("profiles")
        .update({ full_name: form.name, phone: form.phone, address: form.address })
        .eq("id", user.id);

      clear();
      toast.success("Order placed! Check your email — we'll be in touch.");
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
        <Field
          label="Full name"
          value={form.name}
          onChange={(v) => setForm({ ...form, name: v })}
        />
        <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />

        <div>
          <div className="text-sm mb-2 text-muted-foreground">Delivery method</div>
          <div className="grid sm:grid-cols-2 gap-3">
            {DELIVERY_OPTIONS.map((opt) => {
              const active = delivery === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setDelivery(opt.value)}
                  className={`p-4 rounded-xl text-sm text-left transition-all ${active ? "btn-gold" : "btn-glass"}`}
                >
                  <div className="font-semibold flex items-center justify-between gap-2">
                    <span>{opt.title}</span>
                    <span>{opt.fee > 0 ? formatLKR(opt.fee) : "FREE"}</span>
                  </div>
                  <div className="text-xs opacity-80 mt-0.5">{opt.description}</div>
                  <div className="text-xs opacity-70 mt-1">{opt.note}</div>
                </button>
              );
            })}
          </div>
        </div>

        <Field
          label={needsAddress ? "Delivery address" : "Address (not needed for store pickup)"}
          value={form.address}
          onChange={(v) => setForm({ ...form, address: v })}
          multiline
          required={needsAddress}
        />
        <Field
          label="Order notes (optional)"
          value={form.notes}
          onChange={(v) => setForm({ ...form, notes: v })}
          required={false}
          multiline
        />

        <div className="rounded-xl border border-[var(--color-border)] p-4 text-sm space-y-1">
          <div className="font-semibold text-[var(--color-gold-soft)]">
            Bank transfer / deposit (prepayment only)
          </div>
          <div className="text-muted-foreground">Account name: {BANK_DETAILS.accountName}</div>
          <div className="text-muted-foreground">Account number: {BANK_DETAILS.accountNumber}</div>
          <div className="text-muted-foreground">Bank: {BANK_DETAILS.bank}</div>
          <div className="text-muted-foreground">Branch: {BANK_DETAILS.branch}</div>
          <p className="text-xs text-muted-foreground pt-2">{BANK_TRANSFER_NOTE}</p>
          <p className="text-xs text-muted-foreground">
            Send your transfer/deposit details to {BANK_WHATSAPP} on WhatsApp.
          </p>
        </div>

        <button
          disabled={submitting}
          className="w-full mt-4 py-3 rounded-full btn-gold disabled:opacity-50"
        >
          {submitting ? "Placing order…" : `Place order · ${formatLKR(grandTotal)}`}
        </button>
      </form>

      <div className="glass rounded-2xl p-6 h-fit">
        <h3 className="font-display text-xl mb-4">Order summary</h3>
        <div className="space-y-3">
          {items.map((i) => (
            <div key={i.id} className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {i.name} × {i.quantity}
              </span>
              <span>{formatLKR(i.price * i.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-[var(--color-border)] mt-4 pt-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatLKR(total)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              {delivery === "islandwide_delivery" ? "Islandwide delivery" : "Store pickup"}
            </span>
            <span>{shippingFee > 0 ? formatLKR(shippingFee) : "FREE"}</span>
          </div>
        </div>
        <div className="border-t border-[var(--color-border)] mt-4 pt-4 flex justify-between font-display text-lg">
          <span>Total</span>
          <span className="text-gradient-gold">{formatLKR(grandTotal)}</span>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  multiline,
  required = true,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
        {required && " *"}
      </span>
      {multiline ? (
        <textarea
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="mt-1 w-full glass rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--color-gold)]"
        />
      ) : (
        <input
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full glass rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--color-gold)]"
        />
      )}
    </label>
  );
}
