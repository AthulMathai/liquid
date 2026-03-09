type ProductPricingCardProps = {
  cost?: number;
  listedPrice?: number;
  minAcceptablePrice?: number;
  currency?: string;
  locale?: string;
};

function safeNumber(value: number | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function formatCurrency(
  value: number,
  currency = "CAD",
  locale = "en-CA"
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function ProductPricingCard({
  cost = 0,
  listedPrice = 0,
  minAcceptablePrice = 0,
  currency = "CAD",
  locale = "en-CA",
}: ProductPricingCardProps) {
  const safeCost = safeNumber(cost);
  const safeListedPrice = safeNumber(listedPrice);
  const safeMinAcceptablePrice = safeNumber(minAcceptablePrice);

  const grossMargin = safeListedPrice - safeCost;
  const minimumMargin = safeMinAcceptablePrice - safeCost;

  const listedMarginPct =
    safeListedPrice > 0 ? (grossMargin / safeListedPrice) * 100 : 0;

  const minMarginPct =
    safeMinAcceptablePrice > 0
      ? (minimumMargin / safeMinAcceptablePrice) * 100
      : 0;

  const pricingHealth =
    safeListedPrice <= 0
      ? "Needs Price"
      : safeMinAcceptablePrice > safeListedPrice
      ? "Review Pricing"
      : "Pricing Ready";

  const pricingHealthClass =
    safeListedPrice <= 0
      ? "badge badge-danger"
      : safeMinAcceptablePrice > safeListedPrice
      ? "badge badge-warning"
      : "badge badge-success";

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
              Pricing Overview
            </h2>
            <p className="section-subtitle" style={{ margin: "6px 0 0" }}>
              Review acquisition cost, target listing price, minimum acceptable
              price, and margin position.
            </p>
          </div>

          <div className="toolbar">
            <span className={pricingHealthClass}>{pricingHealth}</span>
          </div>
        </div>

        <div className="grid-cards-3">
          <div className="metric-card">
            <p className="metric-label">Cost</p>
            <h3 className="metric-value">
              {formatCurrency(safeCost, currency, locale)}
            </h3>
            <p className="metric-helper">
              Approximate acquisition or landed cost for the product.
            </p>
          </div>

          <div className="metric-card">
            <p className="metric-label">Listed Price</p>
            <h3 className="metric-value">
              {formatCurrency(safeListedPrice, currency, locale)}
            </h3>
            <p className="metric-helper">
              Main asking price used for listings and product display.
            </p>
          </div>

          <div className="metric-card">
            <p className="metric-label">Min Acceptable Price</p>
            <h3 className="metric-value">
              {formatCurrency(safeMinAcceptablePrice, currency, locale)}
            </h3>
            <p className="metric-helper">
              Lowest price you are comfortable accepting in negotiation.
            </p>
          </div>
        </div>

        <div className="grid-cards-2" style={{ marginTop: 18 }}>
          <div className="card" style={{ background: "rgba(255,255,255,0.62)" }}>
            <div className="card-content">
              <p className="metric-label">Gross Margin at Listed Price</p>
              <h3
                style={{
                  margin: 0,
                  fontFamily: "var(--font-heading), sans-serif",
                  fontSize: 26,
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                }}
              >
                {formatCurrency(grossMargin, currency, locale)}
              </h3>
              <p className="metric-helper">
                Margin based on listed price minus cost.
              </p>

              <div
                style={{
                  marginTop: 14,
                  padding: 14,
                  borderRadius: 16,
                  background: "rgba(248,250,252,0.88)",
                  border: "1px solid rgba(226,232,240,0.85)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "rgb(var(--foreground))",
                    }}
                  >
                    Margin %
                  </span>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 800,
                      color: "rgb(var(--foreground))",
                    }}
                  >
                    {Math.round(listedMarginPct)}%
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
                      width: `${Math.max(0, Math.min(Math.abs(listedMarginPct), 100))}%`,
                      height: "100%",
                      borderRadius: 999,
                      background:
                        grossMargin >= 0
                          ? "linear-gradient(90deg, rgba(16,185,129,0.85), rgba(14,165,233,0.85))"
                          : "linear-gradient(90deg, rgba(239,68,68,0.85), rgba(245,158,11,0.85))",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ background: "rgba(255,255,255,0.62)" }}>
            <div className="card-content">
              <p className="metric-label">Margin at Minimum Price</p>
              <h3
                style={{
                  margin: 0,
                  fontFamily: "var(--font-heading), sans-serif",
                  fontSize: 26,
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                }}
              >
                {formatCurrency(minimumMargin, currency, locale)}
              </h3>
              <p className="metric-helper">
                Margin preserved even after negotiation.
              </p>

              <div
                style={{
                  marginTop: 14,
                  padding: 14,
                  borderRadius: 16,
                  background: "rgba(248,250,252,0.88)",
                  border: "1px solid rgba(226,232,240,0.85)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "rgb(var(--foreground))",
                    }}
                  >
                    Min Price Margin %
                  </span>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 800,
                      color: "rgb(var(--foreground))",
                    }}
                  >
                    {Math.round(minMarginPct)}%
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
                      width: `${Math.max(0, Math.min(Math.abs(minMarginPct), 100))}%`,
                      height: "100%",
                      borderRadius: 999,
                      background:
                        minimumMargin >= 0
                          ? "linear-gradient(90deg, rgba(79,70,229,0.85), rgba(14,165,233,0.85))"
                          : "linear-gradient(90deg, rgba(239,68,68,0.85), rgba(245,158,11,0.85))",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
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
              Set a listed price high enough to allow negotiation, but keep the
              minimum acceptable price realistic so you can move inventory fast.
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
              Review reminder
            </h4>
            <p
              style={{
                margin: 0,
                color: "rgb(var(--foreground))",
                fontSize: 14,
                lineHeight: 1.65,
              }}
            >
              If the minimum acceptable price is above the listed price, the
              pricing needs attention before the product goes live.
            </p>
          </div>
        </div>

        <div className="toolbar" style={{ marginTop: 18 }}>
          <span className="badge badge-success">Pricing visible</span>
          <span className="badge badge-warning">Negotiation floor tracked</span>
          <span className="badge badge-neutral">Margin awareness built in</span>
        </div>
      </div>
    </div>
  );
}