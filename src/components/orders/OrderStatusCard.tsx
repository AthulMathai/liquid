type OrderStatusCardProps = {
  orderNumber?: string;
  status?: string;
  paymentReceived?: boolean;
  fulfillmentType?: string | null;
  totalValue?: number;
  shippedValue?: number;
  orderDate?: string | null;
  shipDate?: string | null;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(value: string | null | undefined) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-CA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatStatusLabel(status: string) {
  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getStatusClass(status: string) {
  switch (status) {
    case "completed":
    case "picked_up":
    case "shipped":
      return "badge badge-success";
    case "awaiting_pickup":
    case "paid":
      return "badge badge-warning";
    case "cancelled":
    case "refunded":
      return "badge badge-danger";
    case "awaiting_payment":
    default:
      return "badge badge-neutral";
  }
}

export default function OrderStatusCard({
  orderNumber = "ORD-0000",
  status = "awaiting_payment",
  paymentReceived = false,
  fulfillmentType = "pickup",
  totalValue = 0,
  shippedValue = 0,
  orderDate = null,
  shipDate = null,
}: OrderStatusCardProps) {
  const statusLabel = formatStatusLabel(status);
  const statusClass = getStatusClass(status);
  const fulfillmentLabel = fulfillmentType
    ? formatStatusLabel(fulfillmentType)
    : "—";

  return (
    <div className="card">
      <div className="card-content">
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 18,
          }}
        >
          <div>
            <p className="metric-label" style={{ marginBottom: 8 }}>
              Order Status
            </p>
            <h2
              style={{
                margin: 0,
                fontFamily: "var(--font-heading), sans-serif",
                fontSize: 26,
                fontWeight: 800,
                letterSpacing: "-0.04em",
              }}
            >
              {orderNumber}
            </h2>
            <p
              style={{
                margin: "8px 0 0",
                color: "rgb(var(--muted))",
                fontSize: 14,
                lineHeight: 1.65,
              }}
            >
              Current operational view of payment, fulfillment, and value.
            </p>
          </div>

          <div className="toolbar">
            <span className={statusClass}>{statusLabel}</span>
            <span className={paymentReceived ? "badge badge-success" : "badge badge-warning"}>
              {paymentReceived ? "Payment Received" : "Payment Pending"}
            </span>
          </div>
        </div>

        <div className="grid-cards-2">
          <div className="metric-card">
            <p className="metric-label">Fulfillment Type</p>
            <h3
              style={{
                margin: 0,
                fontFamily: "var(--font-heading), sans-serif",
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: "-0.04em",
              }}
            >
              {fulfillmentLabel}
            </h3>
            <p className="metric-helper">How this order will be completed.</p>
          </div>

          <div className="metric-card">
            <p className="metric-label">Total Value</p>
            <h3 className="metric-value">{formatCurrency(totalValue)}</h3>
            <p className="metric-helper">Full order value including all lines.</p>
          </div>

          <div className="metric-card">
            <p className="metric-label">Shipped / Fulfilled Value</p>
            <h3 className="metric-value">{formatCurrency(shippedValue)}</h3>
            <p className="metric-helper">
              Value already handed off to the buyer.
            </p>
          </div>

          <div className="metric-card">
            <p className="metric-label">Completion Progress</p>
            <h3 className="metric-value">
              {totalValue > 0
                ? `${Math.round((shippedValue / totalValue) * 100)}%`
                : "0%"}
            </h3>
            <p className="metric-helper">
              Based on shipped value compared with total value.
            </p>
          </div>
        </div>

        <div className="grid-cards-2" style={{ marginTop: 18 }}>
          <div
            style={{
              padding: 16,
              borderRadius: 18,
              background: "rgba(248,250,252,0.86)",
              border: "1px solid rgba(226,232,240,0.85)",
            }}
          >
            <p className="metric-label" style={{ marginBottom: 8 }}>
              Order Date
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 15,
                fontWeight: 700,
                color: "rgb(var(--foreground))",
              }}
            >
              {formatDate(orderDate)}
            </p>
          </div>

          <div
            style={{
              padding: 16,
              borderRadius: 18,
              background: "rgba(248,250,252,0.86)",
              border: "1px solid rgba(226,232,240,0.85)",
            }}
          >
            <p className="metric-label" style={{ marginBottom: 8 }}>
              Ship / Pickup Date
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 15,
                fontWeight: 700,
                color: "rgb(var(--foreground))",
              }}
            >
              {formatDate(shipDate)}
            </p>
          </div>
        </div>

        <div className="toolbar" style={{ marginTop: 18 }}>
          <span className={statusClass}>{statusLabel}</span>
          <span className="badge badge-neutral">{fulfillmentLabel}</span>
          <span className={paymentReceived ? "badge badge-success" : "badge badge-warning"}>
            {paymentReceived ? "Cleared" : "Awaiting Payment"}
          </span>
        </div>
      </div>
    </div>
  );
}