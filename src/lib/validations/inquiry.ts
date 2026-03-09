import { z } from "zod";

const inquiryStatusValues = [
  "new",
  "replied",
  "negotiating",
  "scheduled_pickup",
  "ghosted",
  "converted",
  "closed_lost",
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
  if (value === null || value === undefined) return null;

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;

    const parsed = Number(trimmed.replace(/[$,]/g, ""));
    return Number.isFinite(parsed) ? parsed : value;
  }

  return value;
}

export const inquiryStatusSchema = z.enum(inquiryStatusValues);

export const inquiryPlatformSchema = z
  .union([z.enum(platformValues), z.string().trim().min(1)])
  .nullable()
  .optional();

export const createInquirySchema = z.object({
  item_id: z.preprocess(
    emptyStringToNull,
    z.string().uuid("item_id must be a valid UUID.").nullable().optional()
  ),
  platform: z.preprocess(
    emptyStringToNull,
    inquiryPlatformSchema
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
    z.string().trim().min(3).max(50).nullable().optional()
  ),
  message_summary: z.preprocess(
    emptyStringToNull,
    z.string().trim().min(1).max(2000).nullable().optional()
  ),
  offered_price: z.preprocess(
    parseNullableMoney,
    z.number().min(0, "offered_price must be 0 or greater.").nullable().optional()
  ),
  inquiry_status: inquiryStatusSchema.default("new"),
  follow_up_date: z.preprocess(
    emptyStringToNull,
    z
      .string()
      .datetime({ offset: true, message: "follow_up_date must be a valid ISO datetime." })
      .or(z.string().datetime({ local: true, message: "follow_up_date must be a valid datetime." }))
      .nullable()
      .optional()
  ),
  notes: z.preprocess(
    emptyStringToNull,
    z.string().trim().max(5000).nullable().optional()
  ),
});

export const updateInquirySchema = createInquirySchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided for update.",
  });

export const inquiryFormSchema = z.object({
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
  platform: z.union([z.enum(platformValues), z.string().trim().min(1)]),
  sku: z.preprocess(
    emptyStringToUndefined,
    z.string().trim().min(1, "SKU is required.")
  ),
  messageSummary: z.preprocess(
    emptyStringToUndefined,
    z.string().trim().min(1, "Message summary is required.").max(2000)
  ),
  offeredPrice: z.preprocess(
    parseNullableMoney,
    z.number().min(0, "Offer must be 0 or greater.").nullable().optional()
  ),
  inquiryStatus: inquiryStatusSchema,
  followUpDate: z.preprocess(
    emptyStringToNull,
    z.string().trim().nullable().optional()
  ),
  notes: z.preprocess(
    emptyStringToNull,
    z.string().trim().max(5000).nullable().optional()
  ),
});

export type CreateInquiryInput = z.infer<typeof createInquirySchema>;
export type UpdateInquiryInput = z.infer<typeof updateInquirySchema>;
export type InquiryFormInput = z.infer<typeof inquiryFormSchema>;
export type InquiryStatus = z.infer<typeof inquiryStatusSchema>;

export function validateCreateInquiry(input: unknown) {
  return createInquirySchema.safeParse(input);
}

export function validateUpdateInquiry(input: unknown) {
  return updateInquirySchema.safeParse(input);
}

export function validateInquiryForm(input: unknown) {
  return inquiryFormSchema.safeParse(input);
}