type ProductInventoryCardProps = {
  onHandQty?: number;
  reservedQty?: number;
  availableQty?: number;
  status?: string;
  statusClassName?: string;
};

function safeNumber(value: number | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export default function ProductInventoryCard({
  onHandQty = 0,
  reservedQty = 0,
  availableQty,
  status = "draft",
  statusClassName = "badge badge-neutral",
}: ProductInventoryCardProps) {
  const safeOnHandQty = safeNumber(onHandQty);
  const safeReservedQty = safeNumber(reservedQty);
  const computedAvailableQty = Math.max(safeOnHandQty - safeReservedQty, 0);
  const finalAvailableQty =
    typeof availableQty === "number" && Number.isFinite(availableQty)
      ? availableQty
      : computedAvailableQty;

  const fillRate =
    safeOnHandQty > 0
      ? Math.min((finalAvailableQty / safeOnHandQty) * 100, 100)
      : 0;

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
            <h2 className="section-title" style={{ margin: 0 }}>
              Inventory Status
            </h2>
            <p className="section-subtitle" style={{ margin: "6px 0 0" }}>
              Current stock position for this product, including reserved and
              available quantity.
            </p>
          </div>

          <div className="toolbar">
            <span className={statusClassName}>
              {status
                .split("_")
                .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
                .join(" ")}
            </span>
          </div>
        </div>

        <div className="grid-cards-3">
          <div className="metric-card">
            <p className="metric-label">On Hand Qty</p>
            <h3 className="metric-value">{safeOnHandQty}</h3>
            <p className="metric-helper">Physical units currently in stock.</p>
          </div>

          <div className="metric-card">
            <p className="metric-label">Reserved Qty</p>
            <h3 className="metric-value">{safeReservedQty}</h3>
            <p className="metric-helper">
              Units committed to orders or pending pickup.
            </p>
          </div>

          <div className="metric-card">
            <p className="metric-label">Available Qty</p>
            <h3 className="metric-value">{finalAvailableQty}</h3>
            <p className="metric-helper">
              Units still available to sell right now.
            </p>
          </div>
        </div>

        <div
          style={{
            marginTop: 18,
            padding: 16,
            borderRadius: 18,
            background: "rgba(248,250,252,0.86)",
            border: "1px solid rgba(226,232,240,0.85)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 10,
              flexWrap: "wrap",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 14,
                fontWeight: 700,
                color: "rgb(var(--foreground))",
              }}
            >
              Available stock ratio
            </p>

            <span
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: "rgb(var(--muted))",
              }}
            >
              {Math.round(fillRate)}%
            </span>
          </div>

          <div
            style={{
              width: "100%",
              height: 10,
              borderRadius: 999,
              background: "rgba(226,232,240,0.95)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${fillRate}%`,
                height: "100%",
                borderRadius: 999,
                background:
                  "linear-gradient(90deg, rgba(79,70,229,0.85), rgba(14,165,233,0.85))",
              }}
            />
          </div>

          <p
            style={{
              margin: "12px 0 0",
              color: "rgb(var(--muted))",
              fontSize: 14,
              lineHeight: 1.7,
            }}
          >
            Available quantity is calculated as{" "}
            <strong>on hand minus reserved</strong>. This number is what should
            drive new listings and new order commitments.
          </p>
        </div>

        <div className="grid-cards-2" style={{ marginTop: 18 }}>
          <div
            style={{
              padding: 16,
              borderRadius: 18,
              background: "rgba(16,185,129,0.08)",
              border: "1px solid rgba(16,185,129,0.18)",
            }}
          >
            <h4
              style={{
                margin: "0 0 8px",
                fontSize: 15,
                fontWeight: 800,
              }}
            >
              Best practice
            </h4>
            <p
              style={{
                margin: 0,
                color: "rgb(var(--foreground))",
                fontSize: 14,
                lineHeight: 1.65,
              }}
            >
              Reserve inventory as soon as a buyer commits. That prevents
              double-selling and keeps your available quantity trustworthy.
            </p>
          </div>

          <div
            style={{
              padding: 16,
              borderRadius: 18,
              background: "rgba(245,158,11,0.10)",
              border: "1px solid rgba(245,158,11,0.18)",
            }}
          >
            <h4
              style={{
                margin: "0 0 8px",
                fontSize: 15,
                fontWeight: 800,
              }}
            >
              Operational reminder
            </h4>
            <p
              style={{
                margin: 0,
                color: "rgb(var(--foreground))",
                fontSize: 14,
                lineHeight: 1.65,
              }}
            >
              When an order is completed, reduce on-hand quantity and release
              the reservation so stock stays accurate across listings and orders.
            </p>
          </div>
        </div>

        <div className="toolbar" style={{ marginTop: 18 }}>
          <span className="badge badge-success">Stock visible</span>
          <span className="badge badge-warning">Reserved tracked</span>
          <span className="badge badge-neutral">Available calculated</span>
        </div>
      </div>
    </div>
  );
}