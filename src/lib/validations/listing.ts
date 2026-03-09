import { z } from "zod";

const listingStatusValues = [
  "draft",
  "active",
  "pending_pickup",
  "sold",
  "expired",
  "deleted",
] as const;

const platformValues = [
  "facebook",
  "kijiji",
  "karrot",
  "craigslist",
  "shopify",
  "direct",
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

  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.floor(value);
  }

  return value;
}

export const listingStatusSchema = z.enum(listingStatusValues);

export const listingPlatformSchema = z.union([
  z.enum(platformValues),
  z.string().trim().min(1),
]);

export const createListingSchema = z.object({
  item_id: z.preprocess(
    emptyStringToUndefined,
    z.string().uuid("item_id must be a valid UUID.")
  ),
  platform: listingPlatformSchema,
  external_listing_id: z.preprocess(
    emptyStringToNull,
    z.string().trim().max(255).nullable().optional()
  ),
  listing_title: z.preprocess(
    emptyStringToNull,
    z.string().trim().max(255).nullable().optional()
  ),
  listing_price: z.preprocess(
    parseNullableMoney,
    z.number().min(0, "listing_price must be 0 or greater.").default(0)
  ),
  listing_url: z.preprocess(
    emptyStringToNull,
    z.string().trim().url("listing_url must be a valid URL.").nullable().optional()
  ),
  qty_listed: z.preprocess(
    parseNullableInteger,
    z.number().int().positive("qty_listed must be greater than 0.").default(1)
  ),
  listing_status: listingStatusSchema.default("draft"),
  listed_at: z.preprocess(
    emptyStringToNull,
    z
      .string()
      .datetime({
        offset: true,
        message: "listed_at must be a valid ISO datetime.",
      })
      .or(
        z.string().datetime({
          local: true,
          message: "listed_at must be a valid datetime.",
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

export const updateListingSchema = createListingSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided for update.",
  });

export const listingFormSchema = z.object({
  itemId: z.preprocess(
    emptyStringToUndefined,
    z.string().trim().min(1, "Item ID is required.")
  ),
  sku: z.preprocess(
    emptyStringToNull,
    z.string().trim().nullable().optional()
  ),
  platform: listingPlatformSchema,
  listingTitle: z.preprocess(
    emptyStringToUndefined,
    z.string().trim().min(1, "Listing title is required.").max(255)
  ),
  listingPrice: z.preprocess(
    parseNullableMoney,
    z.number().min(0, "Listing price must be 0 or greater.")
  ),
  qtyListed: z.preprocess(
    parseNullableInteger,
    z.number().int().positive("Quantity listed must be greater than 0.")
  ),
  listingUrl: z.preprocess(
    emptyStringToNull,
    z.string().trim().url("Enter a valid listing URL.").nullable().optional()
  ),
  externalListingId: z.preprocess(
    emptyStringToNull,
    z.string().trim().max(255).nullable().optional()
  ),
  listingStatus: listingStatusSchema,
  listedAt: z.preprocess(
    emptyStringToNull,
    z.string().trim().nullable().optional()
  ),
  notes: z.preprocess(
    emptyStringToNull,
    z.string().trim().max(5000).nullable().optional()
  ),
});

export type CreateListingInput = z.infer<typeof createListingSchema>;
export type UpdateListingInput = z.infer<typeof updateListingSchema>;
export type ListingFormInput = z.infer<typeof listingFormSchema>;
export type ListingStatus = z.infer<typeof listingStatusSchema>;
export type ListingPlatform = z.infer<typeof listingPlatformSchema>;

export function validateCreateListing(input: unknown) {
  return createListingSchema.safeParse(input);
}

export function validateUpdateListing(input: unknown) {
  return updateListingSchema.safeParse(input);
}

export function validateListingForm(input: unknown) {
  return listingFormSchema.safeParse(input);
}