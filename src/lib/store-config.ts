export type DeliveryMethod = "store_pickup" | "islandwide_delivery";

export const STORE_ADDRESS = "43, Greens Road, Negombo";
export const STORE_SHOWROOM = "Colombo 05 Showroom";

export const BANK_DETAILS = {
  accountName: "VINS WATCH",
  accountNumber: "1000364659",
  bank: "COMMERCIAL BANK OF CEYLON PLC",
  branch: "Negombo Branch",
} as const;

export const BANK_WHATSAPP = "+94 771412652";

export const ISLANDWIDE_DELIVERY_FEE = 790;

export const DELIVERY_OPTIONS: {
  value: DeliveryMethod;
  title: string;
  description: string;
  note: string;
  fee: number;
}[] = [
  {
    value: "store_pickup",
    title: "Collect from Store",
    description: "After 3 days. Prepayments only.",
    note: "43, Greens Road, Negombo — FREE",
    fee: 0,
  },
  {
    value: "islandwide_delivery",
    title: "Islandwide Delivery",
    description: "Prepayment required. Delivered within 3–5 days.",
    note: "Rs 790.00",
    fee: ISLANDWIDE_DELIVERY_FEE,
  },
];

export function deliveryFeeFor(method: DeliveryMethod): number {
  return method === "islandwide_delivery" ? ISLANDWIDE_DELIVERY_FEE : 0;
}

export function deliveryLabel(method: DeliveryMethod): string {
  return method === "islandwide_delivery" ? "Islandwide Delivery" : "Collect from Store";
}

export const BANK_TRANSFER_NOTE =
  "All orders are delivered within 2–5 days after the bank transfer/deposit is completed. Items for in-store collection can be collected from our Colombo 05 Showroom. Kindly submit your bank transfer details on WhatsApp or by email.";
