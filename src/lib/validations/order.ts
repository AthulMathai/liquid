import { z } from "zod";

const orderStatusValues = [
  "awaiting_payment",
  "paid",
  "awaiting_pickup",
  "picked_up",
  "shipped",
  "completed",
  "cancelled",
  "refunded",
] as const;

const fulfillmentTypeValues = [
  "pickup",
  "shipping",
  "delivery",
] as const;

const platformValues = [
  "facebook",
  "kijiji",
  "karrot",
  "craigslist",
  "shopify",
  "direct",
] as const;

const paymentMethodValues = [
  "cash",
  "etransfer",
  "credit_card",
  "paypal",
  "other",
] as const;

function emptyStringToNull(value: unknown) {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function emptyStringToUndefined(value: unknown) {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

function parseNullableMoney(value: unknown) {
  if (value === null || value === undefined) return value;

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return undefined;

    const parsed = Number(trimmed.replace(/[$,]/g, ""));
    return Number.isFinite(parsed) ? parsed : value;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : value;
  }

  return value;
}

function parseNullableInteger(value: unknown) {
  if (value === null || value === undefined) return value;

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return undefined;

    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? Math.floor(parsed) : value;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? Math.floor(value) : value;
  }

  return value;
}

export const orderStatusSchema = z.enum(orderStatusValues);

export const fulfillmentTypeSchema = z.union([
  z.enum(fulfillmentTypeValues),
  z.string().trim().min(1),
]);

export const orderPlatformSchema = z.union([
  z.enum(platformValues),
  z.string().trim().min(1),
]);

export const paymentMethodSchema = z.union([
  z.enum(paymentMethodValues),
  z.string().trim().min(1),
]);

export const createOrderItemSchema = z.object({
  order_id: z.preprocess(
    emptyStringToUndefined,
    z.string().uuid("order_id must be a valid UUID.")
  ),
  item_id: z.preprocess(
    emptyStringToUndefined,
    z.string().uuid("item_id must be a valid UUID.")
  ),
  qty: z.preprocess(
    parseNullableInteger,
    z.number().int().positive("qty must be greater than 0.")
  ),
  shipped_qty: z.preprocess(
    parseNullableInteger,
    z.number().int().min(0, "shipped_qty must be 0 or greater.").default(0)
  ),
  unit_price: z.preprocess(
    parseNullableMoney,
    z.number().min(0, "unit_price must be 0 or greater.")
  ),
}).refine((value) => value.shipped_qty <= value.qty, {
  message: "shipped_qty cannot be greater than qty.",
  path: ["shipped_qty"],
});

export const updateOrderItemSchema = z
  .object({
    qty: z.preprocess(
      parseNullableInteger,
      z.number().int().positive("qty must be greater than 0.").optional()
    ),
    shipped_qty: z.preprocess(
      parseNullableInteger,
      z.number().int().min(0, "shipped_qty must be 0 or greater.").optional()
    ),
    unit_price: z.preprocess(
      parseNullableMoney,
      z.number().min(0, "unit_price must be 0 or greater.").optional()
    ),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided for update.",
  })
  .refine(
    (value) =>
      value.qty === undefined ||
      value.shipped_qty === undefined ||
      value.shipped_qty <= value.qty,
    {
      message: "shipped_qty cannot be greater than qty.",
      path: ["shipped_qty"],
    }
  );

export const createOrderSchema = z.object({
  order_number: z.preprocess(
    emptyStringToUndefined,
    z.string().trim().min(1, "order_number is required.").max(100)
  ),
  platform: z.preprocess(
    emptyStringToNull,
    orderPlatformSchema.nullable().optional()
  ),
  buyer_name: z.preprocess(
    emptyStringToNull,
    z.string().trim().min(1).max(150).nullable().optional()
  ),
  buyer_email: z.preprocess(
    emptyStringToNull,
    z.string().trim().email("buyer_email must be a valid email address.").nullable().optional()
  ),
  buyer_phone: z.preprocess(
    emptyStringToNull,
    z.string().trim().max(50).nullable().optional()
  ),
  buyer_address: z.preprocess(
    emptyStringToNull,
    z.string().trim().max(1000).nullable().optional()
  ),
  payment_method: z.preprocess(
    emptyStringToNull,
    paymentMethodSchema.nullable().optional()
  ),
  payment_received: z.boolean().default(false),
  fulfillment_type: z.preprocess(
    emptyStringToNull,
    fulfillmentTypeSchema.nullable().optional()
  ),
  shipping_cost: z.preprocess(
    parseNullableMoney,
    z.number().min(0, "shipping_cost must be 0 or greater.").default(0)
  ),
  total_value: z.preprocess(
    parseNullableMoney,
    z.number().min(0, "total_value must be 0 or greater.").default(0)
  ),
  shipped_value: z.preprocess(
    parseNullableMoney,
    z.number().min(0, "shipped_value must be 0 or greater.").default(0)
  ),
  order_status: orderStatusSchema.default("awaiting_payment"),
  order_date: z.preprocess(
    emptyStringToNull,
    z
      .string()
      .datetime({
        offset: true,
        message: "order_date must be a valid ISO datetime.",
      })
      .or(
        z.string().datetime({
          local: true,
          message: "order_date must be a valid datetime.",
        })
      )
      .nullable()
      .optional()
  ),
  ship_date: z.preprocess(
    emptyStringToNull,
    z
      .string()
      .datetime({
        offset: true,
        message: "ship_date must be a valid ISO datetime.",
      })
      .or(
        z.string().datetime({
          local: true,
          message: "ship_date must be a valid datetime.",
        })
      )
      .nullable()
      .optional()
  ),
  notes: z.preprocess(
    emptyStringToNull,
    z.string().trim().max(5000).nullable().optional()
  ),
});

export const updateOrderSchema = createOrderSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided for update.",
  });

export const createOrderWithItemsSchema = z.object({
  order_number: z.preprocess(
    emptyStringToUndefined,
    z.string().trim().min(1, "order_number is required.").max(100)
  ),
  platform: z.preprocess(
    emptyStringToNull,
    orderPlatformSchema.nullable().optional()
  ),
  buyer_name: z.preprocess(
    emptyStringToNull,
    z.string().trim().min(1).max(150).nullable().optional()
  ),
  buyer_email: z.preprocess(
    emptyStringToNull,
    z.string().trim().email("buyer_email must be a valid email address.").nullable().optional()
  ),
  buyer_phone: z.preprocess(
    emptyStringToNull,
    z.string().trim().max(50).nullable().optional()
  ),
  buyer_address: z.preprocess(
    emptyStringToNull,
    z.string().trim().max(1000).nullable().optional()
  ),
  payment_method: z.preprocess(
    emptyStringToNull,
    paymentMethodSchema.nullable().optional()
  ),
  payment_received: z.boolean().default(false),
  fulfillment_type: z.preprocess(
    emptyStringToNull,
    fulfillmentTypeSchema.nullable().optional()
  ),
  shipping_cost: z.preprocess(
    parseNullableMoney,
    z.number().min(0, "shipping_cost must be 0 or greater.").default(0)
  ),
  order_status: orderStatusSchema.default("awaiting_payment"),
  order_date: z.preprocess(
    emptyStringToNull,
    z.string().trim().nullable().optional()
  ),
  ship_date: z.preprocess(
    emptyStringToNull,
    z.string().trim().nullable().optional()
  ),
  notes: z.preprocess(
    emptyStringToNull,
    z.string().trim().max(5000).nullable().optional()
  ),
  reserve_inventory: z.boolean().default(true),
  items: z
    .array(
      z.object({
        item_id: z.preprocess(
          emptyStringToUndefined,
          z.string().uuid("item_id must be a valid UUID.")
        ),
        qty: z.preprocess(
          parseNullableInteger,
          z.number().int().positive("qty must be greater than 0.")
        ),
        shipped_qty: z.preprocess(
          parseNullableInteger,
          z.number().int().min(0, "shipped_qty must be 0 or greater.").default(0)
        ),
        unit_price: z.preprocess(
          parseNullableMoney,
          z.number().min(0, "unit_price must be 0 or greater.")
        ),
      })
    )
    .min(1, "At least one order item is required."),
}).refine(
  (value) => value.items.every((item) => item.shipped_qty <= item.qty),
  {
    message: "One or more items have shipped_qty greater than qty.",
    path: ["items"],
  }
);

export const orderFormSchema = z.object({
  orderNumber: z.preprocess(
    emptyStringToUndefined,
    z.string().trim().min(1, "Order number is required.")
  ),
  platform: orderPlatformSchema,
  buyerName: z.preprocess(
    emptyStringToUndefined,
    z.string().trim().min(1, "Buyer name is required.")
  ),
  buyerEmail: z.preprocess(
    emptyStringToNull,
    z.string().trim().email("Enter a valid email address.").nullable().optional()
  ),
  buyerPhone: z.preprocess(
    emptyStringToNull,
    z.string().trim().max(50).nullable().optional()
  ),
  buyerAddress: z.preprocess(
    emptyStringToNull,
    z.string().trim().max(1000).nullable().optional()
  ),
  paymentMethod: paymentMethodSchema,
  paymentReceived: z.boolean().default(false),
  fulfillmentType: fulfillmentTypeSchema,
  shippingCost: z.preprocess(
    parseNullableMoney,
    z.number().min(0, "Shipping cost must be 0 or greater.")
  ),
  orderStatus: orderStatusSchema,
  orderDate: z.preprocess(
    emptyStringToNull,
    z.string().trim().nullable().optional()
  ),
  shipDate: z.preprocess(
    emptyStringToNull,
    z.string().trim().nullable().optional()
  ),
  notes: z.preprocess(
    emptyStringToNull,
    z.string().trim().max(5000).nullable().optional()
  ),
  sku: z.preprocess(
    emptyStringToUndefined,
    z.string().trim().min(1, "SKU is required.")
  ),
  itemId: z.preprocess(
    emptyStringToUndefined,
    z.string().trim().min(1, "Item ID is required.")
  ),
  qty: z.preprocess(
    parseNullableInteger,
    z.number().int().positive("Quantity must be greater than 0.")
  ),
  unitPrice: z.preprocess(
    parseNullableMoney,
    z.number().min(0, "Unit price must be 0 or greater.")
  ),
});

export const updateOrderStatusSchema = z.object({
  order_id: z.preprocess(
    emptyStringToNull,
    z.string().uuid("order_id must be a valid UUID.").nullable().optional()
  ),
  order_number: z.preprocess(
    emptyStringToNull,
    z.string().trim().min(1).max(100).nullable().optional()
  ),
  order_status: orderStatusSchema,
  payment_received: z.boolean().optional(),
  ship_date: z.preprocess(
    emptyStringToNull,
    z.string().trim().nullable().optional()
  ),
  notes: z.preprocess(
    emptyStringToNull,
    z.string().trim().max(5000).nullable().optional()
  ),
  complete_inventory: z.boolean().optional(),
}).refine((value) => Boolean(value.order_id || value.order_number), {
  message: "Provide either order_id or order_number.",
  path: ["order_id"],
});

export type OrderStatus = z.infer<typeof orderStatusSchema>;
export type FulfillmentType = z.infer<typeof fulfillmentTypeSchema>;
export type OrderPlatform = z.infer<typeof orderPlatformSchema>;
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;

export type CreateOrderItemInput = z.infer<typeof createOrderItemSchema>;
export type UpdateOrderItemInput = z.infer<typeof updateOrderItemSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
export type CreateOrderWithItemsInput = z.infer<typeof createOrderWithItemsSchema>;
export type OrderFormInput = z.infer<typeof orderFormSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;

export function validateCreateOrderItem(input: unknown) {
  return createOrderItemSchema.safeParse(input);
}

export function validateUpdateOrderItem(input: unknown) {
  return updateOrderItemSchema.safeParse(input);
}

export function validateCreateOrder(input: unknown) {
  return createOrderSchema.safeParse(input);
}

export function validateUpdateOrder(input: unknown) {
  return updateOrderSchema.safeParse(input);
}

export function validateCreateOrderWithItems(input: unknown) {
  return createOrderWithItemsSchema.safeParse(input);
}

export function validateOrderForm(input: unknown) {
  return orderFormSchema.safeParse(input);
}

export function validateUpdateOrderStatus(input: unknown) {
  return updateOrderStatusSchema.safeParse(input);
}