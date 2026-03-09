import { Camera, QrCode, ScanLine, SearchCheck, Zap } from "lucide-react";
import AppShell from "@/components/shared/AppShell";
import BarcodeScanner from "@/components/scan/BarcodeScanner";

const scanTips = [
  {
    title: "Use SKU as barcode first",
    text: "For version 1, using the SKU itself as the scannable barcode value keeps lookup simple and reliable.",
    icon: QrCode,
    tone: "rgba(79,70,229,0.10)",
  },
  {
    title: "Open product instantly",
    text: "The goal of this screen is speed: scan, match the product, and jump directly into image capture or item review.",
    icon: SearchCheck,
    tone: "rgba(14,165,233,0.10)",
  },
  {
    title: "Capture right after scan",
    text: "Once the correct item opens, take photos immediately so every image is saved under the right product ID.",
    icon: Camera,
    tone: "rgba(16,185,129,0.10)",
  },
];

export default function ScanPage() {
  return (
    <AppShell
      title="Scan Products"
      subtitle="Use the camera to scan a SKU or barcode and jump directly to the matching product page for image capture and item management."
      action={
        <button type="button" className="button button-primary">
          <ScanLine size={16} />
          Start Scan
        </button>
      }
    >
      <section className="grid-cards-2">
        <div className="glass-panel">
          <div className="card-content">
            <div className="page-eyebrow" style={{ marginBottom: 14 }}>
              Scan-to-product workflow
            </div>

            <h2
              className="page-title"
              style={{
                fontSize: "clamp(1.35rem, 1.8vw, 2rem)",
                marginBottom: 10,
              }}
            >
              This should be the fastest screen in the whole system.
            </h2>

            <p className="page-subtitle" style={{ maxWidth: 700 }}>
              In real usage, you scan an item, the app finds the matching
              product by barcode or SKU, and then routes you straight to that
              item page. From there, you can capture images, review stock, or
              create an order.
            </p>

            <div className="grid-cards-3" style={{ marginTop: 20 }}>
              {scanTips.map((tip) => {
                const Icon = tip.icon;

                return (
                  <div key={tip.title} className="card">
                    <div className="card-content">
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 14,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: tip.tone,
                          marginBottom: 14,
                        }}
                      >
                        <Icon size={20} />
                      </div>

                      <h3 className="card-title">{tip.title}</h3>
                      <p className="card-description">{tip.text}</p>
                    </div>
                  </div>
                );
              })}
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
                <Zap size={22} />
              </div>

              <div>
                <h2 className="section-title" style={{ margin: 0 }}>
                  Why this matters
                </h2>
                <p className="section-subtitle" style={{ margin: "4px 0 0" }}>
                  Scanning eliminates the slowest part of intake: searching.
                </p>
              </div>
            </div>

            <div className="grid-auto">
              <div
                style={{
                  padding: 16,
                  borderRadius: 18,
                  background: "rgba(248,250,252,0.86)",
                  border: "1px solid rgba(226,232,240,0.85)",
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
                  If every product is searchable by barcode value and the barcode
                  value matches the SKU, intake becomes much easier. Scan the
                  item, open the product, take photos, move to the next item.
                </p>
              </div>

              <div className="grid-cards-2">
                <div className="metric-card">
                  <p className="metric-label">Target interaction</p>
                  <h3 className="metric-value">Scan → Open</h3>
                  <p className="metric-helper">
                    Product page opens right after a successful match.
                  </p>
                </div>

                <div className="metric-card">
                  <p className="metric-label">Best first rule</p>
                  <h3 className="metric-value">Barcode = SKU</h3>
                  <p className="metric-helper">
                    Simple and highly reliable for version 1.
                  </p>
                </div>
              </div>

              <div className="toolbar">
                <span className="badge badge-success">Camera-first intake</span>
                <span className="badge badge-neutral">Fast product lookup</span>
                <span className="badge badge-warning">Ideal for bulk photo work</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <BarcodeScanner />
      </section>
    </AppShell>
  );
}