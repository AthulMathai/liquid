type InventorySummaryProps = {
  totalProducts?: number;
  totalUnits?: number;
  totalAvailableUnits?: number;
  missingImages?: number;
  readyProducts?: number;
};

const summaryItems = [
  {
    key: "totalProducts",
    label: "Total Products",
    helper: "All product records currently in the catalog.",
  },
  {
    key: "totalUnits",
    label: "Total Units",
    helper: "Combined on-hand quantity across all products.",
  },
  {
    key: "totalAvailableUnits",
    label: "Available Units",
    helper: "Units still available after reservations.",
  },
  {
    key: "missingImages",
    label: "Missing Images",
    helper: "Products that still need at least one photo.",
  },
  {
    key: "readyProducts",
    label: "Ready Products",
    helper: "Products that are close to sell-ready state.",
  },
] as const;

export default function InventorySummary({
  totalProducts = 0,
  totalUnits = 0,
  totalAvailableUnits = 0,
  missingImages = 0,
  readyProducts = 0,
}: InventorySummaryProps) {
  const values = {
    totalProducts,
    totalUnits,
    totalAvailableUnits,
    missingImages,
    readyProducts,
  };

  return (
    <div className="card">
      <div className="card-content">
        <div style={{ marginBottom: 18 }}>
          <h2 className="section-title" style={{ margin: 0 }}>
            Inventory Summary
          </h2>
          <p className="section-subtitle" style={{ margin: "6px 0 0" }}>
            Quick view of stock health, readiness, and image coverage.
          </p>
        </div>

        <div className="grid-cards-3">
          {summaryItems.map((item) => (
            <div
              key={item.key}
              className="card"
              style={{ background: "rgba(255,255,255,0.62)" }}
            >
              <div className="card-content">
                <p className="metric-label">{item.label}</p>
                <h3 className="metric-value">
                  {values[item.key].toLocaleString()}
                </h3>
                <p className="metric-helper">{item.helper}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}