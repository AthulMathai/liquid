import { getItemById, updateItem, type ItemRow } from "@/lib/db/items";
import calculateAvailableQty from "./calculateAvailableQty";

export type DeductQtyOnCompleteInput = {
  itemId: string;
  qty: number;
  releaseReservedFirst?: boolean;
};

export type DeductQtyOnCompleteSuccess = {
  item: ItemRow;
  previousOnHandQty: number;
  previousReservedQty: number;
  newOnHandQty: number;
  newReservedQty: number;
  availableQtyAfterDeduction: number;
};

export type DeductQtyOnCompleteResult =
  | { data: DeductQtyOnCompleteSuccess; error: null }
  | { data: null; error: Error };

function toSafePositiveInteger(value: number) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return 0;
  return Math.floor(parsed);
}

export async function deductQtyOnComplete({
  itemId,
  qty,
  releaseReservedFirst = true,
}: DeductQtyOnCompleteInput): Promise<DeductQtyOnCompleteResult> {
  try {
    const safeItemId = itemId.trim();
    const safeQty = toSafePositiveInteger(qty);

    if (!safeItemId) {
      return {
        data: null,
        error: new Error("itemId is required."),
      };
    }

    if (safeQty <= 0) {
      return {
        data: null,
        error: new Error("Deduction quantity must be greater than 0."),
      };
    }

    const itemResult = await getItemById(safeItemId);

    if (itemResult.error || !itemResult.data) {
      return {
        data: null,
        error:
          itemResult.error instanceof Error
            ? itemResult.error
            : new Error("Failed to load item."),
      };
    }

    const item = itemResult.data;

    if (safeQty > item.on_hand_qty) {
      return {
        data: null,
        error: new Error(
          `Cannot deduct ${safeQty} unit(s). Only ${item.on_hand_qty} on hand.`
        ),
      };
    }

    const previousOnHandQty = item.on_hand_qty;
    const previousReservedQty = item.reserved_qty;

    const newOnHandQty = Math.max(item.on_hand_qty - safeQty, 0);
    const newReservedQty = releaseReservedFirst
      ? Math.max(item.reserved_qty - safeQty, 0)
      : item.reserved_qty;

    if (newReservedQty > newOnHandQty) {
      return {
        data: null,
        error: new Error(
          "Deduction would leave reserved quantity higher than on-hand quantity."
        ),
      };
    }

    const updateResult = await updateItem(safeItemId, {
      on_hand_qty: newOnHandQty,
      reserved_qty: newReservedQty,
      status: newOnHandQty === 0 ? "sold_out" : undefined,
    });

    if (updateResult.error || !updateResult.data) {
      return {
        data: null,
        error:
          updateResult.error instanceof Error
            ? updateResult.error
            : new Error("Failed to deduct inventory on completion."),
      };
    }

    return {
      data: {
        item: updateResult.data,
        previousOnHandQty,
        previousReservedQty,
        newOnHandQty,
        newReservedQty,
        availableQtyAfterDeduction: calculateAvailableQty({
          onHandQty: updateResult.data.on_hand_qty,
          reservedQty: updateResult.data.reserved_qty,
        }),
      },
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error
          ? error
          : new Error("Failed to deduct quantity on completion."),
    };
  }
}

export default deductQtyOnComplete;