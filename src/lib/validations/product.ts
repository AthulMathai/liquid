import { z } from "zod";

const productStatusValues = [
  "draft",
  "ready",
  "listed",
  "partial_sold",
  "sold_out",
  "hold",
  "removed",
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

function normalizeSkuInput(value: unknown) {
  if (typeof value !== "string") return value;
  const trimmed = value.trim().toUpperCase();
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

export const productStatusSchema = z.enum(productStatusValues);

const productSchemaFields = {
  sku: z.preprocess(
    normalizeSkuInput,
    z.string().trim().min(1, "sku is required.").max(120)
  ),
  barcode_value: z.preprocess(
    emptyStringToNull,
    z.string().trim().max(255).nullable().optional()
  ),
  item_number: z.preprocess(
    emptyStringToNull,
    z.string().trim().max(255).nullable().optional()
  ),
  title: z.preprocess(
    emptyStringToNull,
    z.string().trim().max(255).nullable().optional()
  ),
  description: z.preprocess(
    emptyStringToNull,
    z.string().trim().max(5000).nullable().optional()
  ),
  category: z.preprocess(
    emptyStringToNull,
    z.string().trim().max(255).nullable().optional()
  ),
  brand: z.preprocess(
    emptyStringToNull,
    z.string().trim().max(255).nullable().optional()
  ),
  model: z.preprocess(
    emptyStringToNull,
    z.string().trim().max(255).nullable().optional()
  ),
  condition: z.preprocess(
    emptyStringToNull,
    z.string().trim().max(100).nullable().optional()
  ),
  cost: z.preprocess(
    parseNullableMoney,
    z.number().min(0, "cost must be 0 or greater.").default(0)
  ),
  listed_price: z.preprocess(
    parseNullableMoney,
    z.number().min(0, "listed_price must be 0 or greater.").default(0)
  ),
  min_acceptable_price: z.preprocess(
    parseNullableMoney,
    z.number().min(0, "min_acceptable_price must be 0 or greater.").default(0)
  ),
  on_hand_qty: z.preprocess(
    parseNullableInteger,
    z.number().int().min(0, "on_hand_qty must be 0 or greater.").default(0)
  ),
  reserved_qty: z.preprocess(
    parseNullableInteger,
    z.number().int().min(0, "reserved_qty must be 0 or greater.").default(0)
  ),
  status: productStatusSchema.default("draft"),
  notes: z.preprocess(
    emptyStringToNull,
    z.string().trim().max(5000).nullable().optional()
  ),
} satisfies z.ZodRawShape;

const baseProductSchema = z.object(productSchemaFields);

export const createProductSchema = baseProductSchema
  .refine((value) => value.reserved_qty <= value.on_hand_qty, {
    message: "reserved_qty cannot be greater than on_hand_qty.",
    path: ["reserved_qty"],
  })
  .refine(
    (value) =>
      value.min_acceptable_price <= value.listed_price ||
      value.listed_price === 0,
    {
      message: "min_acceptable_price cannot be greater than listed_price.",
      path: ["min_acceptable_price"],
    }
  );

export const updateProductSchema = baseProductSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided for update.",
  })
  .refine(
    (value) =>
      value.on_hand_qty === undefined ||
      value.reserved_qty === undefined ||
      value.reserved_qty <= value.on_hand_qty,
    {
      message: "reserved_qty cannot be greater than on_hand_qty.",
      path: ["reserved_qty"],
    }
  )
  .refine(
    (value) =>
      value.listed_price === undefined ||
      value.min_acceptable_price === undefined ||
      value.listed_price === 0 ||
      value.min_acceptable_price <= value.listed_price,
    {
      message: "min_acceptable_price cannot be greater than listed_price.",
      path: ["min_acceptable_price"],
    }
  );

export const productFormSchema = z
  .object({
    sku: z.preprocess(
      normalizeSkuInput,
      z.string().trim().min(1, "SKU is required.")
    ),
    barcodeValue: z.preprocess(
      emptyStringToNull,
      z.string().trim().max(255).nullable().optional()
    ),
    itemNumber: z.preprocess(
      emptyStringToNull,
      z.string().trim().max(255).nullable().optional()
    ),
    title: z.preprocess(
      emptyStringToNull,
      z.string().trim().max(255).nullable().optional()
    ),
    description: z.preprocess(
      emptyStringToUndefined,
      z.string().trim().min(1, "Description is required.").max(5000)
    ),
    category: z.preprocess(
      emptyStringToNull,
      z.string().trim().max(255).nullable().optional()
    ),
    brand: z.preprocess(
      emptyStringToNull,
      z.string().trim().max(255).nullable().optional()
    ),
    model: z.preprocess(
      emptyStringToNull,
      z.string().trim().max(255).nullable().optional()
    ),
    condition: z.preprocess(
      emptyStringToUndefined,
      z.string().trim().min(1, "Condition is required.")
    ),
    cost: z.preprocess(
      parseNullableMoney,
      z.number().min(0, "Cost must be 0 or greater.")
    ),
    listedPrice: z.preprocess(
      parseNullableMoney,
      z.number().min(0, "Listed price must be 0 or greater.")
    ),
    minAcceptablePrice: z.preprocess(
      parseNullableMoney,
      z.number().min(0, "Minimum acceptable price must be 0 or greater.")
    ),
    onHandQty: z.preprocess(
      parseNullableInteger,
      z.number().int().min(0, "On hand quantity must be 0 or greater.")
    ),
    reservedQty: z.preprocess(
      parseNullableInteger,
      z.number().int().min(0, "Reserved quantity must be 0 or greater.")
    ),
    status: productStatusSchema,
    notes: z.preprocess(
      emptyStringToNull,
      z.string().trim().max(5000).nullable().optional()
    ),
  })
  .refine((value) => value.reservedQty <= value.onHandQty, {
    message: "Reserved quantity cannot be greater than on hand quantity.",
    path: ["reservedQty"],
  })
  .refine(
    (value) =>
      value.listedPrice === 0 || value.minAcceptablePrice <= value.listedPrice,
    {
      message: "Minimum acceptable price cannot be greater than listed price.",
      path: ["minAcceptablePrice"],
    }
  );

export const reserveInventorySchema = z.object({
  item_id: z.preprocess(
    emptyStringToUndefined,
    z.string().uuid("item_id must be a valid UUID.")
  ),
  qty: z.preprocess(
    parseNullableInteger,
    z.number().int().positive("qty must be greater than 0.")
  ),
});

export const releaseInventorySchema = z.object({
  item_id: z.preprocess(
    emptyStringToUndefined,
    z.string().uuid("item_id must be a valid UUID.")
  ),
  qty: z.preprocess(
    parseNullableInteger,
    z.number().int().positive("qty must be greater than 0.")
  ),
});

export const uploadImageMetaSchema = z.object({
  item_id: z.preprocess(
    emptyStringToUndefined,
    z.string().uuid("item_id must be a valid UUID.")
  ),
  storage_path: z.preprocess(
    emptyStringToUndefined,
    z.string().trim().min(1, "storage_path is required.")
  ),
  public_url: z.preprocess(
    emptyStringToNull,
    z.string().trim().url("public_url must be a valid URL.").nullable().optional()
  ),
  file_name: z.preprocess(
    emptyStringToNull,
    z.string().trim().max(255).nullable().optional()
  ),
  sort_order: z.preprocess(
    parseNullableInteger,
    z.number().int().min(0, "sort_order must be 0 or greater.").default(0)
  ),
  is_primary: z.boolean().default(false),
});

export type ProductStatus = z.infer<typeof productStatusSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductFormInput = z.infer<typeof productFormSchema>;
export type ReserveInventoryInput = z.infer<typeof reserveInventorySchema>;
export type ReleaseInventoryInput = z.infer<typeof releaseInventorySchema>;
export type UploadImageMetaInput = z.infer<typeof uploadImageMetaSchema>;

export function validateCreateProduct(input: unknown) {
  return createProductSchema.safeParse(input);
}

export function validateUpdateProduct(input: unknown) {
  return updateProductSchema.safeParse(input);
}

export function validateProductForm(input: unknown) {
  return productFormSchema.safeParse(input);
}

export function validateReserveInventory(input: unknown) {
  return reserveInventorySchema.safeParse(input);
}

export function validateReleaseInventory(input: unknown) {
  return releaseInventorySchema.safeParse(input);
}

export function validateUploadImageMeta(input: unknown) {
  return uploadImageMetaSchema.safeParse(input);
}