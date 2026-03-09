type StatusBadgeTone =
  | "neutral"
  | "success"
  | "warning"
  | "danger";

type StatusBadgeProps = {
  status: string;
  tone?: StatusBadgeTone;
};

function formatStatusLabel(status: string) {
  return status
    .trim()
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function inferTone(status: string): StatusBadgeTone {
  const normalized = status.trim().toLowerCase();

  if (
    [
      "ready",
      "active",
      "completed",
      "converted",
      "sell_ready",
      "sold",
      "picked_up",
      "shipped",
      "paid",
      "scheduled_pickup",
      "success",
    ].includes(normalized)
  ) {
    return "success";
  }

  if (
    [
      "warning",
      "draft",
      "negotiating",
      "awaiting_payment",
      "awaiting_pickup",
      "pending_pickup",
      "partial",
      "partial_sold",
      "hold",
      "replied",
    ].includes(normalized)
  ) {
    return "warning";
  }

  if (
    [
      "danger",
      "cancelled",
      "refunded",
      "ghosted",
      "closed_lost",
      "expired",
      "deleted",
      "removed",
      "sold_out",
      "no_available_qty",
      "missing_sku",
      "missing_description",
      "needs_price",
      "needs_images",
      "error",
    ].includes(normalized)
  ) {
    return "danger";
  }

  return "neutral";
}

function getBadgeClassName(tone: StatusBadgeTone) {
  switch (tone) {
    case "success":
      return "badge badge-success";
    case "warning":
      return "badge badge-warning";
    case "danger":
      return "badge badge-danger";
    case "neutral":
    default:
      return "badge badge-neutral";
  }
}

export default function StatusBadge({
  status,
  tone,
}: StatusBadgeProps) {
  const finalTone = tone ?? inferTone(status);

  return (
    <span className={getBadgeClassName(finalTone)}>
      {formatStatusLabel(status)}
    </span>
  );
}