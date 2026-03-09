"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  FileBarChart2,
  Info,
  Rows3,
} from "lucide-react";

const previewRows = [
  {
    sku: "SKU1001",
    itemNumber: "SKU1001",
    description: "Black toaster oven",
    qty: 4,
    listedPrice: "$49.99",
    minPrice: "$30.00",
    barcode: "SKU1001",
    status: "Ready",
    statusClass: "badge badge-success",
  },
  {
    sku: "SKU1002",
    itemNumber: "SKU1002",
    description: "Coffee maker stainless",
    qty: 2,
    listedPrice: "$39.99",
    minPrice: "$25.00",
    barcode: "SKU1002",
    status: "Ready",
    statusClass: "badge badge-success",
  },
  {
    sku: "SKU1003",
    itemNumber: "",
    description: "Portable heater white",
    qty: 1,
    listedPrice: "$29.99",
    minPrice: "$18.00",
    barcode: "",
    status: "Needs review",
    statusClass: "badge badge-warning",
  },
];

const checks = [
  {
    label: "Required fields present",
    value: "2 / 3 rows clean",
    icon: CheckCircle2,
    tone: "rgba(16,185,129,0.10)",
  },
  {
    label: "Rows needing review",
    value: "1 row flagged",
    icon: AlertTriangle,
    tone: "rgba(245,158,11,0.14)",
  },
  {
    label: "Rows previewed",
    value: "3 sample rows",
    icon: Rows3,
    tone: "rgba(79,70,229,0.10)",
  },
];

export default function ImportPreview() {
  return (
    <div className="card">
      <div className="card-content">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
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
              <Eye size={22} />
            </div>

            <div>
              <h2 className="section-title" style={{ margin: 0 }}>
                Import preview
              </h2>
              <p className="section-subtitle" style={{ margin: "4px 0 0" }}>
                Review a sample of normalized rows before committing the import.
              </p>
            </div>
          </div>

          <div className="toolbar">
            <span className="badge badge-success">Preview mode</span>
            <span className="badge badge-neutral">Validation first</span>
          </div>
        </div>

        <div className="grid-cards-3" style={{ marginBottom: 18 }}>
          {checks.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.label} className="card">
                <div className="card-content">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: 12,
                    }}
                  >
                    <div>
                      <p className="metric-label">{item.label}</p>
                      <h3
                        style={{
                          margin: 0,
                          fontFamily: "var(--font-heading), sans-serif",
                          fontSize: 24,
                          fontWeight: 800,
                          letterSpacing: "-0.04em",
                        }}
                      >
                        {item.value}
                      </h3>
                    </div>

                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 14,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: item.tone,
                        border: "1px solid rgba(226,232,240,0.86)",
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={20} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
            }}
          >
            <Info
              size={18}
              style={{
                color: "rgb(var(--secondary))",
                marginTop: 2,
                flexShrink: 0,
              }}
            />
            <p
              style={{
                margin: 0,
                color: "rgb(var(--muted))",
                fontSize: 14,
                lineHeight: 1.7,
              }}
            >
              This component should eventually show the real parsed CSV preview.
              For now, it demonstrates the final presentation layer: normalized
              rows, row health, and import-readiness before data is written to
              Supabase.
            </p>
          </div>
        </div>

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Item Number</th>
                <th>Description</th>
                <th>Qty</th>
                <th>Listed Price</th>
                <th>Min Price</th>
                <th>Barcode</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {previewRows.map((row) => (
                <tr key={row.sku}>
                  <td
                    style={{
                      fontWeight: 800,
                      fontFamily: "var(--font-heading), sans-serif",
                    }}
                  >
                    {row.sku}
                  </td>
                  <td>{row.itemNumber || "—"}</td>
                  <td style={{ minWidth: 220 }}>{row.description}</td>
                  <td>{row.qty}</td>
                  <td>{row.listedPrice}</td>
                  <td>{row.minPrice}</td>
                  <td>{row.barcode || "—"}</td>
                  <td>
                    <span className={row.statusClass}>{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
                What good rows should look like
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
              Every row should have a valid SKU and description. Pricing,
              quantity, and barcode fields can be improved later, but the SKU
              record must be clean from the start.
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 8,
              }}
            >
              <FileBarChart2
                size={18}
                style={{ color: "rgb(var(--warning))" }}
              />
              <h3
                style={{
                  margin: 0,
                  fontSize: 15,
                  fontWeight: 800,
                }}
              >
                What to flag before import
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
              Missing item numbers, blank barcode values, or inconsistent
              descriptions should be highlighted now so the scan and listing
              workflows stay reliable later.
            </p>
          </div>
        </div>

        <div
          className="toolbar"
          style={{
            marginTop: 20,
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <div className="toolbar">
            <span className="badge badge-success">Ready rows visible</span>
            <span className="badge badge-warning">Review rows highlighted</span>
          </div>

          <div className="toolbar">
            <button type="button" className="button button-secondary">
              Re-parse file
            </button>
            <button type="button" className="button button-primary">
              Import products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}