import {
  ArrowLeft,
  Boxes,
  Camera,
  PackagePlus,
  ScanLine,
  Sparkles,
  Tag,
} from "lucide-react";
import Link from "next/link";
import AppShell from "@/components/shared/AppShell";
import ProductForm from "@/components/products/ProductForm";

const starterTips = [
  {
    title: "Use a unique SKU",
    text: "Every product should have one clean SKU. In version 1, using the same value for barcode and SKU keeps scanning much simpler.",
    icon: Tag,
    tone: "rgba(79,70,229,0.10)",
  },
  {
    title: "Add images right after creation",
    text: "Once the item record exists, the fastest workflow is to scan it and capture 3–5 photos immediately.",
    icon: Camera,
    tone: "rgba(14,165,233,0.10)",
  },
  {
    title: "Think in sell-ready records",
    text: "A strong product record has title, description, price, quantity, and image coverage before it moves into listings.",
    icon: Sparkles,
    tone: "rgba(16,185,129,0.10)",
  },
];

export default function NewProductPage() {
  return (
    <AppShell
      title="New Product"
      subtitle="Create a clean SKU-based product record that can support scanning, image capture, inventory control, and marketplace listing."
      action={
        <>
          <Link href="/scan" className="button button-secondary">
            <ScanLine size={16} />
            Scan Instead
          </Link>
          <Link href="/products" className="button button-ghost">
            <ArrowLeft size={16} />
            Back to Products
          </Link>
        </>
      }
    >
      <section className="grid-cards-2">
        <div className="glass-panel">
          <div className="card-content">
            <div className="page-eyebrow" style={{ marginBottom: 14 }}>
              Product setup
            </div>

            <h2
              className="page-title"
              style={{
                fontSize: "clamp(1.35rem, 1.8vw, 2rem)",
                marginBottom: 10,
              }}
            >
              Start with a product record that is scan-ready and listing-ready.
            </h2>

            <p className="page-subtitle" style={{ maxWidth: 720 }}>
              This page is where a physical product becomes a structured record in
              the system. Once saved, it can be scanned by SKU, photographed,
              priced, listed, and converted into orders without breaking the
              workflow.
            </p>

            <div className="grid-cards-3" style={{ marginTop: 20 }}>
              <div className="card">
                <div className="card-content">
                  <p className="metric-label">Stage 1</p>
                  <h3
                    style={{
                      margin: 0,
                      fontFamily: "var(--font-heading), sans-serif",
                      fontSize: 22,
                      fontWeight: 800,
                      letterSpacing: "-0.04em",
                    }}
                  >
                    Identify
                  </h3>
                  <p className="metric-helper">
                    Create the SKU, barcode value, and base item identity.
                  </p>
                </div>
              </div>

              <div className="card">
                <div className="card-content">
                  <p className="metric-label">Stage 2</p>
                  <h3
                    style={{
                      margin: 0,
                      fontFamily: "var(--font-heading), sans-serif",
                      fontSize: 22,
                      fontWeight: 800,
                      letterSpacing: "-0.04em",
                    }}
                  >
                    Price
                  </h3>
                  <p className="metric-helper">
                    Set listed and minimum acceptable price clearly.
                  </p>
                </div>
              </div>

              <div className="card">
                <div className="card-content">
                  <p className="metric-label">Stage 3</p>
                  <h3
                    style={{
                      margin: 0,
                      fontFamily: "var(--font-heading), sans-serif",
                      fontSize: 22,
                      fontWeight: 800,
                      letterSpacing: "-0.04em",
                    }}
                  >
                    Capture
                  </h3>
                  <p className="metric-helper">
                    Save the record, then move directly into image intake.
                  </p>
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: 20,
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
                Best version-1 shortcut: set <strong>barcode value = SKU</strong>.
                That makes scan-to-product lookup far more reliable during intake.
              </p>
            </div>
          </div>
        </div>

        <div className="grid-auto">
          <div className="metric-card">
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div>
                <p className="metric-label">Recommended outcome</p>
                <h2 className="metric-value">Sell-Ready SKU</h2>
              </div>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 16,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(79,70,229,0.10)",
                  border: "1px solid rgba(226,232,240,0.9)",
                }}
              >
                <PackagePlus size={22} />
              </div>
            </div>

            <p className="metric-helper">
              A clean product record saves time later in scanning, photo capture,
              listing, and order creation.
            </p>
          </div>

          <div className="metric-card">
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div>
                <p className="metric-label">Primary rule</p>
                <h2 className="metric-value">One SKU, One Record</h2>
              </div>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 16,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(14,165,233,0.10)",
                  border: "1px solid rgba(226,232,240,0.9)",
                }}
              >
                <Boxes size={22} />
              </div>
            </div>

            <p className="metric-helper">
              Keep every image, order, inquiry, and listing tied back to the same
              product identity.
            </p>
          </div>

          <div className="grid-auto">
            {starterTips.map((tip) => {
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
      </section>

      <section className="section">
        <ProductForm />
      </section>
    </AppShell>
  );
}