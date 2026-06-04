import { T as TSS_SERVER_FUNCTION, a as createServerFn } from "./server-BCWnWFFF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CUV44O59.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, a as arrayType, n as numberType, s as stringType, e as enumType } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
var createServerRpc = (serverFnMeta, splitImportFn) => {
  const url = "/_serverFn/" + serverFnMeta.id;
  return Object.assign(splitImportFn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const PlaceOrderSchema = objectType({
  customer_name: stringType().trim().min(1).max(200),
  customer_phone: stringType().trim().min(3).max(50),
  customer_address: stringType().trim().min(3).max(2e3),
  notes: stringType().max(2e3).optional().nullable(),
  payment_method: enumType(["cod", "online"]),
  items: arrayType(objectType({
    watch_id: stringType().uuid(),
    quantity: numberType().int().min(1).max(100)
  })).min(1).max(50)
});
const placeOrder_createServerFn_handler = createServerRpc({
  id: "a6485a0caa6c7276b8f38fd2e39c7cd965ae3addca5ff318987f97661206380a",
  name: "placeOrder",
  filename: "src/lib/orders.functions.ts"
}, (opts) => placeOrder.__executeServer(opts));
const placeOrder = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => PlaceOrderSchema.parse(data)).handler(placeOrder_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const ids = data.items.map((i) => i.watch_id);
  const {
    data: watches,
    error: watchErr
  } = await supabase.from("watches").select("id, name, price, stock").in("id", ids);
  if (watchErr) throw new Error(watchErr.message);
  if (!watches || watches.length !== ids.length) {
    throw new Error("One or more items are no longer available");
  }
  const watchMap = new Map(watches.map((w) => [w.id, w]));
  let total = 0;
  const orderItems = data.items.map((i) => {
    const w = watchMap.get(i.watch_id);
    if (w.stock < i.quantity) {
      throw new Error(`Insufficient stock for ${w.name}`);
    }
    const unit_price = Number(w.price);
    total += unit_price * i.quantity;
    return {
      watch_id: w.id,
      watch_name: w.name,
      unit_price,
      quantity: i.quantity
    };
  });
  const {
    data: order,
    error: orderErr
  } = await supabase.from("orders").insert({
    user_id: userId,
    customer_name: data.customer_name,
    customer_phone: data.customer_phone,
    customer_address: data.customer_address,
    notes: data.notes || null,
    total,
    subtotal: total,
    payment_method: data.payment_method,
    status: "pending"
  }).select().single();
  if (orderErr) throw new Error(orderErr.message);
  const {
    error: itemsErr
  } = await supabase.from("order_items").insert(orderItems.map((it) => ({
    ...it,
    order_id: order.id
  })));
  if (itemsErr) throw new Error(itemsErr.message);
  return {
    orderId: order.id,
    total
  };
});
export {
  placeOrder_createServerFn_handler
};
