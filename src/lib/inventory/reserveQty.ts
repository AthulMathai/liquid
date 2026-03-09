import { getItemById, updateItem, type ItemRow } from "@/lib/db/items";
import calculateAvailableQty from "./calculateAvailableQty";

export type ReserveQtyInput = {
  itemId: string;
  qty: number;
};

export type ReserveQtySuccess = {
  item: ItemRow;
  previousReservedQty: number;
  newReservedQty: number;
  availableQtyAfterReserve: number;
};

export type ReserveQtyResult =
  | { data: ReserveQtySuccess; error: null }
  | { data: null; error: Error };

function toSafePositiveInteger(value: number) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return 0;
  return Math.floor(parsed);
}

export async function reserveQty({
  itemId,
  qty,
}: ReserveQtyInput): Promise<ReserveQtyResult> {
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
        error: new Error("Reservation quantity must be greater than 0."),
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
    const currentAvailableQty = calculateAvailableQty({
      onHandQty: item.on_hand_qty,
      reservedQty: item.reserved_qty,
    });

    if (safeQty > currentAvailableQty) {
      return {
        data: null,
        error: new Error(
          `Cannot reserve ${safeQty} unit(s). Only ${currentAvailableQty} available.`
        ),
      };
    }

    const newReservedQty = item.reserved_qty + safeQty;

    const updateResult = await updateItem(safeItemId, {
      reserved_qty: newReservedQty,
    });

    if (updateResult.error || !updateResult.data) {
      return {
        data: null,
        error:
          updateResult.error instanceof Error
            ? updateResult.error
            : new Error("Failed to reserve inventory."),
      };
    }

    return {
      data: {
        item: updateResult.data,
        previousReservedQty: item.reserved_qty,
        newReservedQty,
        availableQtyAfterReserve: calculateAvailableQty({
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
          : new Error("Failed to reserve quantity."),
    };
  }
}

export default reserveQty;