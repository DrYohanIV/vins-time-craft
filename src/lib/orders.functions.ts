import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import {
  getAppUrl,
  sendOrderAdminEmail,
  sendOrderCustomerEmail,
  shortOrderId,
  type OrderEmailData,
} from "@/lib/email.server";
import { sendWhatsAppMessage } from "@/lib/whatsapp.server";
import { deliveryFeeFor, deliveryLabel } from "@/lib/store-config";

const PlaceOrderSchema = z.object({
  customer_name: z.string().trim().min(1).max(200),
  customer_phone: z.string().trim().min(3).max(50),
  customer_address: z.string().trim().max(2000).optional().default(""),
  notes: z.string().max(2000).optional().nullable(),
  delivery_method: z.enum(["store_pickup", "islandwide_delivery"]),
  items: z
    .array(
      z.object({
        watch_id: z.string().uuid(),
        quantity: z.number().int().min(1).max(100),
      }),
    )
    .min(1)
    .max(50),
});

type Settings = {
  notification_email: string | null;
  whatsapp_number: string | null;
  callmebot_api_key: string | null;
};

async function loadSettings(): Promise<Settings | null> {
  const { data } = await supabaseAdmin
    .from("store_settings")
    .select("notification_email, whatsapp_number, callmebot_api_key")
    .eq("id", 1)
    .maybeSingle();
  return data ?? null;
}

async function notify(order: OrderEmailData, customerEmail: string | null) {
  const appUrl = getAppUrl();

  let settings: Settings | null = null;
  try {
    settings = await loadSettings();
  } catch (err) {
    console.error("[order] failed to load store settings", err);
  }

  if (settings?.notification_email) {
    try {
      await sendOrderAdminEmail(settings.notification_email, order);
    } catch (err) {
      console.error("[order] admin email failed", err);
    }
  }

  if (customerEmail) {
    try {
      await sendOrderCustomerEmail(customerEmail, order);
    } catch (err) {
      console.error("[order] customer email failed", err);
    }
  }

  if (settings?.whatsapp_number && settings?.callmebot_api_key) {
    const text =
      `New order #${shortOrderId(order.orderId)}\n` +
      `Customer: ${order.customerName} (${order.customerPhone})\n` +
      `Delivery: ${deliveryLabel(order.deliveryMethod)}\n` +
      `Total: LKR ${order.total.toLocaleString("en-LK")}\n` +
      `View: ${appUrl}/admin/orders`;
    try {
      await sendWhatsAppMessage({
        phone: settings.whatsapp_number,
        text,
        apiKey: settings.callmebot_api_key,
      });
    } catch (err) {
      console.error("[order] whatsapp failed", err);
    }
  }
}

export const placeOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => PlaceOrderSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    if (data.delivery_method === "islandwide_delivery" && !data.customer_address) {
      throw new Error("A delivery address is required for islandwide delivery");
    }

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
    let subtotal = 0;
    const orderItems = data.items.map((i) => {
      const w = watchMap.get(i.watch_id)!;
      if (w.stock < i.quantity) {
        throw new Error(`Insufficient stock for ${w.name}`);
      }
      const unit_price = Number(w.price);
      subtotal += unit_price * i.quantity;
      return {
        watch_id: w.id,
        watch_name: w.name,
        unit_price,
        quantity: i.quantity,
      };
    });

    const shippingFee = deliveryFeeFor(data.delivery_method);
    const total = subtotal + shippingFee;

    // Insert order with server-computed totals; payment is always prepaid bank transfer.
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        customer_name: data.customer_name,
        customer_phone: data.customer_phone,
        customer_address: data.customer_address || "",
        notes: data.notes || null,
        subtotal,
        shipping_fee: shippingFee,
        total,
        delivery_method: data.delivery_method,
        payment_method: "bank_transfer",
        status: "pending",
      })
      .select()
      .single();
    if (orderErr) throw new Error(orderErr.message);

    const { error: itemsErr } = await supabase
      .from("order_items")
      .insert(orderItems.map((it) => ({ ...it, order_id: order.id })));
    if (itemsErr) throw new Error(itemsErr.message);

    const customerEmail = (context.claims as { email?: string } | undefined)?.email ?? null;

    await notify(
      {
        orderId: order.id,
        customerName: data.customer_name,
        customerPhone: data.customer_phone,
        customerEmail,
        customerAddress: data.customer_address || "",
        deliveryMethod: data.delivery_method,
        paymentMethod: "bank_transfer",
        items: orderItems.map((it) => ({
          name: it.watch_name,
          quantity: it.quantity,
          unitPrice: it.unit_price,
        })),
        subtotal,
        shippingFee,
        total,
        notes: data.notes || null,
      },
      customerEmail,
    );

    return { orderId: order.id as string, total };
  });
