export type CalculateAvailableQtyInput = {
  onHandQty: number;
  reservedQty?: number;
};

function toSafeNumber(value: unknown, fallback = 0) {
  const parsed =
    typeof value === "number" ? value : Number(value ?? fallback);

  return Number.isFinite(parsed) ? parsed : fallback;
}

export function calculateAvailableQty({
  onHandQty,
  reservedQty = 0,
}: CalculateAvailableQtyInput): number {
  const safeOnHandQty = Math.max(0, toSafeNumber(onHandQty));
  const safeReservedQty = Math.max(0, toSafeNumber(reservedQty));

  return Math.max(safeOnHandQty - safeReservedQty, 0);
}

export default calculateAvailableQty;