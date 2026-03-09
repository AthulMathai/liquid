import { FileSpreadsheet, Sparkles, Upload, Wand2 } from "lucide-react";
import AppShell from "@/components/shared/AppShell";
import CsvUploader from "@/components/imports/CsvUploader";
import ImportPreview from "@/components/imports/ImportPreview";
import ColumnMapper from "@/components/imports/ColumnMapper";

const expectedColumns = [
  "sku",
  "item_number",
  "description",
  "on_hand_qty",
  "listed_price",
  "min_acceptable_price",
  "barcode_value",
];

export default function ImportsPage() {
  return (
    <AppShell
      title="Import Inventory"
      subtitle="Upload your product CSV, validate the structure, and prepare your catalog for scan, image capture, and order tracking."
      action={
        <button className="button button-primary" type="button">
          <Upload size={16} />
          Upload CSV
        </button>
      }
    >
      <section className="grid-cards-2">
        <div className="glass-panel">
          <div className="card-content">
            <div className="page-eyebrow" style={{ marginBottom: 14 }}>
              Intake workflow
            </div>

            <h2
              className="page-title"
              style={{
                fontSize: "clamp(1.35rem, 1.8vw, 2rem)",
                marginBottom: 10,
              }}
            >
              Turn a raw spreadsheet into a clean product catalog.
            </h2>

            <p className="page-subtitle" style={{ maxWidth: 640 }}>
              Start by uploading the inventory file. The system should validate
              your columns, normalize item data, and create searchable product
              records that are ready for scan-based image intake.
            </p>

            <div className="grid-cards-3" style={{ marginTop: 20 }}>
              <div className="card">
                <div className="card-content">
                  <p className="metric-label">Step 1</p>
                  <h3
                    style={{
                      margin: 0,
                      fontFamily: "var(--font-heading), sans-serif",
                      fontSize: 22,
                      fontWeight: 800,
                      letterSpacing: "-0.04em",
                    }}
                  >
                    Upload CSV
                  </h3>
                  <p className="metric-helper">
                    Drag and drop or browse your inventory file.
                  </p>
                </div>
              </div>

              <div className="card">
                <div className="card-content">
                  <p className="metric-label">Step 2</p>
                  <h3
                    style={{
                      margin: 0,
                      fontFamily: "var(--font-heading), sans-serif",
                      fontSize: 22,
                      fontWeight: 800,
                      letterSpacing: "-0.04em",
                    }}
                  >
                    Map Columns
                  </h3>
                  <p className="metric-helper">
                    Match incoming headers to the required product fields.
                  </p>
                </div>
              </div>

              <div className="card">
                <div className="card-content">
                  <p className="metric-label">Step 3</p>
                  <h3
                    style={{
                      margin: 0,
                      fontFamily: "var(--font-heading), sans-serif",
                      fontSize: 22,
                      fontWeight: 800,
                      letterSpacing: "-0.04em",
                    }}
                  >
                    Import Items
                  </h3>
                  <p className="metric-helper">
                    Create product records and push them into the dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel">
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
                <FileSpreadsheet size={22} />
              </div>

              <div>
                <h2 className="section-title" style={{ margin: 0 }}>
                  Recommended import format
                </h2>
                <p className="section-subtitle" style={{ margin: "4px 0 0" }}>
                  These fields give you the cleanest first import.
                </p>
              </div>
            </div>

            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Field</th>
                    <th>Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  {expectedColumns.map((column) => (
                    <tr key={column}>
                      <td
                        style={{
                          fontWeight: 700,
                          fontFamily: "var(--font-heading), sans-serif",
                        }}
                      >
                        {column}
                      </td>
                      <td style={{ color: "rgb(var(--muted))" }}>
                        {column === "sku" && "Primary product identifier."}
                        {column === "item_number" &&
                          "Optional legacy or vendor-facing item code."}
                        {column === "description" &&
                          "Base description for the product record."}
                        {column === "on_hand_qty" &&
                          "Starting stock count for the item."}
                        {column === "listed_price" &&
                          "Target selling price for the product."}
                        {column === "min_acceptable_price" &&
                          "Lowest acceptable sale threshold."}
                        {column === "barcode_value" &&
                          "Scannable value used to find the item instantly."}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="toolbar" style={{ marginTop: 18 }}>
              <span className="badge badge-success">SKU-driven intake</span>
              <span className="badge badge-neutral">Scan-ready catalog</span>
              <span className="badge badge-warning">Validate before import</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="grid-cards-2">
          <CsvUploader />
          <ColumnMapper />
        </div>
      </section>

      <section className="section">
        <ImportPreview />
      </section>

      <section className="section">
        <div className="grid-cards-3">
          <div className="card">
            <div className="card-content">
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(79,70,229,0.10)",
                  marginBottom: 14,
                }}
              >
                <Sparkles size={20} />
              </div>
              <h3 className="card-title">Best practice</h3>
              <p className="card-description">
                Keep the barcode value the same as the SKU for version 1. That
                makes scanning simple even when supplier labels are inconsistent.
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-content">
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(14,165,233,0.10)",
                  marginBottom: 14,
                }}
              >
                <Wand2 size={20} />
              </div>
              <h3 className="card-title">Data cleanup tip</h3>
              <p className="card-description">
                Standardize titles and descriptions during import so listings,
                scan results, and orders all reflect the same product language.
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-content">
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(16,185,129,0.10)",
                  marginBottom: 14,
                }}
              >
                <Upload size={20} />
              </div>
              <h3 className="card-title">First milestone</h3>
              <p className="card-description">
                A successful first version should import the CSV, create products,
                and immediately make every item searchable from the scan flow.
              </p>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}