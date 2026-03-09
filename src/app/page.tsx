import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  Camera,
  ScanLine,
  ShoppingCart,
  Upload,
} from "lucide-react";

const quickLinks = [
  {
    title: "Import Inventory",
    description: "Upload your CSV and populate the product catalog instantly.",
    href: "/imports",
    icon: Upload,
  },
  {
    title: "Scan Products",
    description: "Use the camera to scan SKU or barcode and jump to the item page.",
    href: "/scan",
    icon: ScanLine,
  },
  {
    title: "Manage Products",
    description: "Review inventory, pricing, images, and product status in one place.",
    href: "/products",
    icon: Boxes,
  },
  {
    title: "Track Orders",
    description: "Create orders, reserve inventory, and complete fulfillment cleanly.",
    href: "/orders",
    icon: ShoppingCart,
  },
];

const highlights = [
  "CSV-based product intake",
  "Fast scan-to-product workflow",
  "Camera upload by SKU",
  "Inventory and order control",
];

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="page-header">
        <div className="page-title-wrap">
          <div className="page-eyebrow">Liquidation Control Center</div>
          <h1 className="page-title">
            Turn raw inventory into a clean, fast-selling marketplace operation.
          </h1>
          <p className="page-subtitle">
            Built for short-cycle liquidation. Import products, scan items,
            capture images, manage orders, and keep inventory accurate from one
            central hub.
          </p>
        </div>

        <div className="toolbar">
          <Link href="/imports" className="button button-primary">
            Start Import
            <ArrowRight size={16} />
          </Link>
          <Link href="/scan" className="button button-secondary">
            Open Scanner
          </Link>
        </div>
      </section>

      <section className="glass-panel">
        <div className="card-content">
          <div className="grid-cards-2">
            <div>
              <h2
                className="page-title"
                style={{
                  fontSize: "clamp(1.6rem, 2vw, 2.4rem)",
                  marginBottom: 12,
                }}
              >
                A sharper workflow for 100–200 products.
              </h2>
              <p className="page-subtitle" style={{ maxWidth: 620 }}>
                Instead of juggling spreadsheets, photos, and marketplace posts
                separately, this hub keeps the item record, image set, and sales
                status tied to the same SKU from day one.
              </p>

              <div
                className="toolbar"
                style={{ marginTop: 20, alignItems: "stretch" }}
              >
                {highlights.map((item) => (
                  <span key={item} className="badge badge-neutral">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid-cards-2">
              <div className="metric-card">
                <p className="metric-label">Primary Intake Flow</p>
                <h3 className="metric-value">Import → Scan → Shoot</h3>
                <p className="metric-helper">
                  Load products from CSV, scan by SKU, and save photos directly
                  under the matching item.
                </p>
              </div>

              <div className="metric-card">
                <p className="metric-label">Core Outcome</p>
                <h3 className="metric-value">One Source of Truth</h3>
                <p className="metric-helper">
                  Product data, images, orders, and listing status remain tied to
                  the same record.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Quick actions</h2>
        <p className="section-subtitle">
          Jump into the parts of the system you will use every day.
        </p>

        <div className="grid-cards-4">
          {quickLinks.map((link) => {
            const Icon = link.icon;

            return (
              <Link key={link.href} href={link.href} className="card">
                <div className="card-content">
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 16,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        "linear-gradient(135deg, rgba(79,70,229,0.14), rgba(14,165,233,0.12))",
                      border: "1px solid rgba(226,232,240,0.9)",
                      marginBottom: 16,
                    }}
                  >
                    <Icon size={24} />
                  </div>

                  <h3 className="card-title">{link.title}</h3>
                  <p className="card-description">{link.description}</p>

                  <div style={{ marginTop: 18 }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 14,
                        fontWeight: 700,
                        color: "rgb(var(--primary))",
                      }}
                    >
                      Open
                      <ArrowRight size={15} />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
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
                <Upload size={20} />
              </div>
              <h3 className="card-title">1. Import product data</h3>
              <p className="card-description">
                Start from your inventory CSV so every item record is created
                consistently and shows up in the dashboard immediately.
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
                <Camera size={20} />
              </div>
              <h3 className="card-title">2. Capture product images</h3>
              <p className="card-description">
                Open an item by scan, take photos from the browser, and keep the
                image set locked to the correct SKU automatically.
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
                <ShoppingCart size={20} />
              </div>
              <h3 className="card-title">3. Convert to orders</h3>
              <p className="card-description">
                As products start moving, turn buyer commitments into tracked
                orders and keep inventory aligned without guesswork.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}