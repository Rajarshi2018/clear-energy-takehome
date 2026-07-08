// Mirrors components.schemas.Order in openapi.yaml
export type OrderStatus =
  | 'placed'
  | 'assigned'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export interface OrderSku {
  code: string;
  name: string;
  qty?: number;
}

export interface Order {
  id: string;
  customerName: string;
  address: string;
  /** Integer paise, e.g. 118000 => ₹1,180 */
  amountPaise: number;
  sku: OrderSku;
  status: OrderStatus;
  /** ISO 8601 UTC */
  placedAt: string;
  /** ISO 8601 UTC, nullable */
  eta: string | null;
}
