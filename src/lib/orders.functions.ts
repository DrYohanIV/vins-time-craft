import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const PlaceOrderSchema = z.object({
  customer_name: z.string().trim().min(1).max(200),
  customer_phone: z.string().trim().min(3).max(50),
  customer_address: z.string().trim().min(3).max(2000),
  notes: z.string().max(2000).optional().nullable(),
  payment_method: z.enum(["cod", "online"]),
  items: z
    .array(
      z.object({
        watch_id: z.string().uuid(),
        quantity: z.number().int().min(1).max(100),
      })
    )
    .min(1)
    .max(50),
});

export const placeOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => PlaceOrderSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // Re-fetch authoritative prices from DB
    const ids = data.items.map((i) => i.watch_id);
    const { data: watches, error: watchErr } = await supabase
      .from("watches")
      .select("id, name, price, stock")
      .in("id", ids);
    if (watchErr) throw new Error(watchErr.message);
    if (!watches || watches.length !== ids.length) {
      throw new Error("One or more items are no longer available");
    }

    const watchMap = new Map(watches.map((w) => [w.id, w]));
    let total = 0;
    const orderItems = data.items.map((i) => {
      const w = watchMap.get(i.watch_id)!;
      if (w.stock < i.quantity) {
        throw new Error(`Insufficient stock for ${w.name}`);
      }
      const unit_price = Number(w.price);
      total += unit_price * i.quantity;
      return {
        watch_id: w.id,
        watch_name: w.name,
        unit_price,
        quantity: i.quantity,
      };
    });

    // Insert order with server-computed total and forced status='pending'
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        customer_name: data.customer_name,
        customer_phone: data.customer_phone,
        customer_address: data.customer_address,
        notes: data.notes || null,
        total,
        subtotal: total,
        payment_method: data.payment_method,
        status: "pending",
      })
      .select()
      .single();
    if (orderErr) throw new Error(orderErr.message);

    const { error: itemsErr } = await supabase
      .from("order_items")
      .insert(orderItems.map((it) => ({ ...it, order_id: order.id })));
    if (itemsErr) throw new Error(itemsErr.message);

    return { orderId: order.id as string, total };
  });
