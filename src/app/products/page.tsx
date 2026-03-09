import Link from "next/link";
import {
  ArrowRight,
  Box,
  Camera,
  CircleDollarSign,
  ImageIcon,
  Plus,
  ScanLine,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import AppShell from "@/components/shared/AppShell";

const productStats = [
  {
    label: "Total Products",
    value: "0",
    helper: "All product records currently in the catalog.",
    tone: "rgba(79,70,229,0.10)",
    icon: Box,
  },
  {
    label: "Ready for Images",
    value: "0",
    helper: "Products that should move into photo intake next.",
    tone: "rgba(14,165,233,0.10)",
    icon: Camera,
  },
  {
    label: "Missing Images",
    value: "0",
    helper: "Products without a primary image yet.",
    tone: "rgba(245,158,11,0.12)",
    icon: ImageIcon,
  },
  {
    label: "Sell-Ready",
    value: "0",
    helper: "Products with inventory and image readiness.",
    tone: "rgba(16,185,129,0.10)",
    icon: CircleDollarSign,
  },
];

const sampleProducts = [
  {
    sku: "SKU1001",
    title: "Black toaster oven",
    qty: 4,
    price: "$49.99",
    minPrice: "$30.00",
    status: "Ready",
    statusClass: "badge badge-success",
    imageState: "2 images",
  },
  {
    sku: "SKU1002",
    title: "Coffee maker stainless",
    qty: 2,
    price: "$39.99",
    minPrice: "$25.00",
    status: "Needs photos",
    statusClass: "badge badge-warning",
    imageState: "0 images",
  },
  {
    sku: "SKU1003",
    title: "Portable heater white",
    qty: 1,
    price: "$29.99",
    minPrice: "$18.00",
    status: "Draft",
    statusClass: "badge badge-neutral",
    imageState: "1 image",
  },
];

export default function ProductsPage() {
  return (
    <AppShell
      title="Products"
      subtitle="Manage your product catalog, review image readiness, track inventory, and open individual items for scan-based intake and marketplace prep."
      action={
        <>
          <Link href="/scan" className="button button-secondary">
            <ScanLine size={16} />
            Scan Item
          </Link>
          <Link href="/products/new" className="button button-primary">
            <Plus size={16} />
            New Product
          </Link>
        </>
      }
    >
      <section className="grid-cards-4">
        {productStats.map((card) => {
          const Icon = card.icon;

          return (
            <div key={card.label} className="metric-card">
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <div>
                  <p className="metric-label">{card.label}</p>
                  <h2 className="metric-value">{card.value}</h2>
                </div>

                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 16,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: card.tone,
                    border: "1px solid rgba(226,232,240,0.9)",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={22} />
                </div>
              </div>

              <p className="metric-helper">{card.helper}</p>
            </div>
          );
        })}
      </section>

      <section className="section">
        <div className="glass-panel">
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
                <div className="page-eyebrow" style={{ marginBottom: 12 }}>
                  Catalog control
                </div>
                <h2
                  className="page-title"
                  style={{
                    fontSize: "clamp(1.35rem, 1.8vw, 2rem)",
                    marginBottom: 10,
                  }}
                >
                  One place to review every product before it gets listed.
                </h2>
                <p className="page-subtitle" style={{ maxWidth: 760 }}>
                  Products should move through a simple flow: imported, reviewed,
                  scanned, photographed, priced, and then listed. This screen is
                  where you keep that pipeline clean.
                </p>
              </div>

              <div className="toolbar">
                <button type="button" className="button button-secondary">
                  <SlidersHorizontal size={16} />
                  Filters
                </button>
              </div>
            </div>

            <div className="grid-cards-3">
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
                    Import
                  </h3>
                  <p className="metric-helper">
                    Create clean records from CSV and verify SKU structure.
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
                    Capture
                  </h3>
                  <p className="metric-helper">
                    Scan the item, open the product page, and save images.
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
                    Sell
                  </h3>
                  <p className="metric-helper">
                    Once ready, move the item into listings, inquiries, and orders.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="card">
          <div className="card-content">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                flexWrap: "wrap",
                marginBottom: 18,
              }}
            >
              <div>
                <h2 className="section-title">Product catalog</h2>
                <p className="section-subtitle">
                  Search products, review image status, and open a record for
                  detailed management.
                </p>
              </div>

              <div className="toolbar">
                <div
                  style={{
                    position: "relative",
                    minWidth: 280,
                  }}
                >
                  <Search
                    size={16}
                    style={{
                      position: "absolute",
                      left: 14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "rgb(var(--muted))",
                    }}
                  />
                  <input
                    className="input"
                    placeholder="Search by SKU, title, barcode..."
                    style={{ paddingLeft: 40 }}
                  />
                </div>

                <button type="button" className="button button-secondary">
                  <SlidersHorizontal size={16} />
                  Sort / Filter
                </button>
              </div>
            </div>

            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Title</th>
                    <th>Qty</th>
                    <th>Listed Price</th>
                    <th>Min Price</th>
                    <th>Images</th>
                    <th>Status</th>
                    <th>Open</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleProducts.map((product) => (
                    <tr key={product.sku}>
                      <td
                        style={{
                          fontWeight: 800,
                          fontFamily: "var(--font-heading), sans-serif",
                        }}
                      >
                        {product.sku}
                      </td>
                      <td style={{ minWidth: 240 }}>{product.title}</td>
                      <td>{product.qty}</td>
                      <td>{product.price}</td>
                      <td>{product.minPrice}</td>
                      <td>{product.imageState}</td>
                      <td>
                        <span className={product.statusClass}>{product.status}</span>
                      </td>
                      <td>
                        <Link
                          href={`/products/${product.sku}`}
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
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div
              className="toolbar"
              style={{
                marginTop: 18,
                justifyContent: "space-between",
                flexWrap: "wrap",
              }}
            >
              <div className="toolbar">
                <span className="badge badge-success">Catalog ready</span>
                <span className="badge badge-neutral">SKU-centric structure</span>
                <span className="badge badge-warning">Image tracking enabled</span>
              </div>

              <div
                style={{
                  color: "rgb(var(--muted))",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                Showing starter preview rows
              </div>
            </div>
          </div>
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
                <ScanLine size={20} />
              </div>
              <h3 className="card-title">Best workflow</h3>
              <p className="card-description">
                Don’t search manually when handling physical items. Use the scan
                screen so the item opens instantly and intake stays fast.
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
              <h3 className="card-title">Photo priority</h3>
              <p className="card-description">
                The fastest way to increase listing readiness is to focus first on
                products with clean inventory data but missing images.
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
                <CircleDollarSign size={20} />
              </div>
              <h3 className="card-title">Sell-through focus</h3>
              <p className="card-description">
                Once a product has pricing, inventory, and images, it should move
                quickly into the listing pipeline instead of sitting in draft.
              </p>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}