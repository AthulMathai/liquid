import { getItemById, updateItem, type ItemRow } from "@/lib/db/items";
import calculateAvailableQty from "./calculateAvailableQty";

export type ReleaseQtyInput = {
  itemId: string;
  qty: number;
};

export type ReleaseQtySuccess = {
  item: ItemRow;
  previousReservedQty: number;
  newReservedQty: number;
  availableQtyAfterRelease: number;
};

export type ReleaseQtyResult =
  | { data: ReleaseQtySuccess; error: null }
  | { data: null; error: Error };

function toSafePositiveInteger(value: number) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return 0;
  return Math.floor(parsed);
}

export async function releaseQty({
  itemId,
  qty,
}: ReleaseQtyInput): Promise<ReleaseQtyResult> {
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
        error: new Error("Release quantity must be greater than 0."),
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

    if (safeQty > item.reserved_qty) {
      return {
        data: null,
        error: new Error(
          `Cannot release ${safeQty} unit(s). Only ${item.reserved_qty} currently reserved.`
        ),
      };
    }

    const newReservedQty = Math.max(item.reserved_qty - safeQty, 0);

    const updateResult = await updateItem(safeItemId, {
      reserved_qty: newReservedQty,
    });

    if (updateResult.error || !updateResult.data) {
      return {
        data: null,
        error:
          updateResult.error instanceof Error
            ? updateResult.error
            : new Error("Failed to release reserved inventory."),
      };
    }

    return {
      data: {
        item: updateResult.data,
        previousReservedQty: item.reserved_qty,
        newReservedQty,
        availableQtyAfterRelease: calculateAvailableQty({
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
          : new Error("Failed to release quantity."),
    };
  }
}

export default releaseQty;