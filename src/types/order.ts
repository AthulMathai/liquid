export type OrderStatus =
  | "awaiting_payment"
  | "paid"
  | "awaiting_pickup"
  | "picked_up"
  | "shipped"
  | "completed"
  | "cancelled"
  | "refunded";

export type FulfillmentType = "pickup" | "shipping" | "delivery";

export type Order = {
  id: string;
  order_number: string;
  platform: string | null;
  buyer_name: string | null;
  buyer_email: string | null;
  buyer_phone: string | null;
  buyer_address: string | null;
  payment_method: string | null;
  payment_received: boolean;
  fulfillment_type: FulfillmentType | string | null;
  shipping_cost: number;
  total_value: number;
  shipped_value: number;
  order_status: OrderStatus | string;
  order_date: string | null;
  ship_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  item_id: string;
  qty: number;
  shipped_qty: number;
  unit_price: number;
  line_total: number;
  created_at: string;
};

export type OrderSummary = {
  id: string;
  order_number: string;
  platform: string | null;
  buyer_name: string | null;
  payment_received: boolean;
  fulfillment_type: FulfillmentType | string | null;
  order_status: OrderStatus | string;
  order_date: string | null;
  ship_date: string | null;
  total_value: number;
  shipped_value: number;
  total_order_qty: number;
  total_shipped_qty: number;
  line_count: number;
};

export type CreateOrderInput = {
  order_number: string;
  platform?: string | null;
  buyer_name?: string | null;
  buyer_email?: string | null;
  buyer_phone?: string | null;
  buyer_address?: string | null;
  payment_method?: string | null;
  payment_received?: boolean;
  fulfillment_type?: FulfillmentType | string | null;
  shipping_cost?: number;
  total_value?: number;
  shipped_value?: number;
  order_status?: OrderStatus | string;
  order_date?: string | null;
  ship_date?: string | null;
  notes?: string | null;
};

export type UpdateOrderInput = Partial<CreateOrderInput>;

export type CreateOrderItemInput = {
  order_id: string;
  item_id: string;
  qty: number;
  shipped_qty?: number;
  unit_price: number;
};

export type UpdateOrderItemInput = Partial<{
  qty: number;
  shipped_qty: number;
  unit_price: number;
}>;

export type OrderListFilters = {
  query?: string;
  platform?: string | "all";
  status?: OrderStatus | "all";
  fulfillment_type?: FulfillmentType | "all";
  payment_received?: boolean | null;
};

export type OrderMetric = {
  label: string;
  value: string | number;
  helper?: string;
};