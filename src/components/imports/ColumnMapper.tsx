"use client";

import { ArrowRightLeft, CheckCircle2, Link2, Sparkles } from "lucide-react";

const requiredFields = [
  {
    field: "sku",
    label: "SKU",
    required: true,
    mappedTo: "Item_number",
    helper: "Primary unique identifier for every product.",
  },
  {
    field: "description",
    label: "Description",
    required: true,
    mappedTo: "description",
    helper: "Base product description shown across the app.",
  },
  {
    field: "on_hand_qty",
    label: "On Hand Qty",
    required: false,
    mappedTo: "On_hand_qty",
    helper: "Starting available stock before reservations.",
  },
  {
    field: "listed_price",
    label: "Listed Price",
    required: false,
    mappedTo: "Listed_price",
    helper: "Primary asking price for the item.",
  },
  {
    field: "min_acceptable_price",
    label: "Min Acceptable Price",
    required: false,
    mappedTo: "Min_acceptable_Price",
    helper: "Lowest price threshold you are willing to accept.",
  },
  {
    field: "barcode_value",
    label: "Barcode Value",
    required: false,
    mappedTo: "Item_number",
    helper: "Scannable value used to open the product instantly.",
  },
];

export default function ColumnMapper() {
  return (
    <div className="card">
      <div className="card-content">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 14,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 16,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "linear-gradient(135deg, rgba(79,70,229,0.14), rgba(14,165,233,0.12))",
              border: "1px solid rgba(226,232,240,0.9)",
            }}
          >
            <ArrowRightLeft size={22} />
          </div>

          <div>
            <h2 className="section-title" style={{ margin: 0 }}>
              Column mapping
            </h2>
            <p className="section-subtitle" style={{ margin: "4px 0 0" }}>
              Match your incoming CSV headers to the system fields before import.
            </p>
          </div>
        </div>

        <div
          style={{
            padding: 14,
            borderRadius: 16,
            background: "rgba(248,250,252,0.86)",
            border: "1px solid rgba(226,232,240,0.85)",
            marginBottom: 18,
          }}
        >
          <p
            style={{
              margin: 0,
              color: "rgb(var(--muted))",
              fontSize: 14,
              lineHeight: 1.7,
            }}
          >
            For the first version, keep the mapping simple. Use your product ID
            or item number as the SKU and barcode value if needed. That makes the
            scan workflow much easier and more reliable.
          </p>
        </div>

        <div className="grid-auto">
          {requiredFields.map((item) => (
            <div
              key={item.field}
              className="card"
              style={{
                background: "rgba(255,255,255,0.68)",
              }}
            >
              <div className="card-content">
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(0, 1fr) auto minmax(0, 1fr)",
                    gap: 14,
                    alignItems: "center",
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <p className="metric-label" style={{ marginBottom: 6 }}>
                      System field
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        flexWrap: "wrap",
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          fontFamily: "var(--font-heading), sans-serif",
                          fontSize: 18,
                          fontWeight: 800,
                          letterSpacing: "-0.03em",
                          wordBreak: "break-word",
                        }}
                      >
                        {item.label}
                      </h3>

                      {item.required ? (
                        <span className="badge badge-danger">Required</span>
                      ) : (
                        <span className="badge badge-neutral">Optional</span>
                      )}
                    </div>

                    <p
                      style={{
                        margin: "8px 0 0",
                        color: "rgb(var(--muted))",
                        fontSize: 14,
                        lineHeight: 1.65,
                      }}
                    >
                      {item.helper}
                    </p>
                  </div>

                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(79,70,229,0.08)",
                      border: "1px solid rgba(226,232,240,0.86)",
                      justifySelf: "center",
                    }}
                  >
                    <Link2 size={18} />
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <p className="metric-label" style={{ marginBottom: 6 }}>
                      Incoming column
                    </p>

                    <div
                      style={{
                        minHeight: 48,
                        borderRadius: 14,
                        border: "1px solid rgba(var(--border), 0.92)",
                        background: "rgba(255,255,255,0.96)",
                        boxShadow: "var(--shadow-xs)",
                        padding: "0 14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 12,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: "rgb(var(--foreground))",
                          wordBreak: "break-word",
                        }}
                      >
                        {item.mappedTo}
                      </span>

                      <CheckCircle2
                        size={18}
                        style={{ color: "rgb(var(--success))", flexShrink: 0 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 8,
              }}
            >
              <CheckCircle2 size={18} style={{ color: "rgb(var(--success))" }} />
              <h3
                style={{
                  margin: 0,
                  fontSize: 15,
                  fontWeight: 800,
                }}
              >
                Best current match
              </h3>
            </div>

            <p
              style={{
                margin: 0,
                color: "rgb(var(--foreground))",
                fontSize: 14,
                lineHeight: 1.65,
              }}
            >
              Your existing inventory structure already maps well to the starter
              schema, so the first import path can be very clean.
            </p>
          </div>

          <div
            style={{
              padding: 16,
              borderRadius: 18,
              background: "rgba(79,70,229,0.08)",
              border: "1px solid rgba(79,70,229,0.16)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 8,
              }}
            >
              <Sparkles size={18} style={{ color: "rgb(var(--primary))" }} />
              <h3
                style={{
                  margin: 0,
                  fontSize: 15,
                  fontWeight: 800,
                }}
              >
                Recommended shortcut
              </h3>
            </div>

            <p
              style={{
                margin: 0,
                color: "rgb(var(--foreground))",
                fontSize: 14,
                lineHeight: 1.65,
              }}
            >
              Set <strong>barcode_value = SKU</strong> for version 1. That keeps
              scanning simple and avoids edge cases with mixed vendor barcodes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}