type SafeNumberOptions = {
  fallback?: number;
  min?: number;
  max?: number;
  integer?: boolean;
};

export function safeNumber(
  value: unknown,
  options: SafeNumberOptions = {}
): number {
  const { fallback = 0, min, max, integer = false } = options;

  let parsed =
    typeof value === "number"
      ? value
      : typeof value === "string"
      ? Number(value.replace(/[$,]/g, ""))
      : Number(value);

  if (!Number.isFinite(parsed)) {
    parsed = fallback;
  }

  if (integer) {
    parsed = Math.floor(parsed);
  }

  if (typeof min === "number") {
    parsed = Math.max(parsed, min);
  }

  if (typeof max === "number") {
    parsed = Math.min(parsed, max);
  }

  return parsed;
}

export default safeNumber;