import Link from "next/link";
import {
  ArrowLeft,
  Camera,
  ExternalLink,
  ImageIcon,
  Package2,
  Pencil,
  ScanLine,
  ShieldCheck,
  ShoppingCart,
  Tag,
} from "lucide-react";
import AppShell from "@/components/shared/AppShell";
import ImageCaptureUpload from "@/components/products/ImageCaptureUpload";

type ProductDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const product = {
  id: "SKU1001",
  sku: "SKU1001",
  title: "Black toaster oven",
  description:
    "Compact black toaster oven with multi-function heating controls. Good candidate for fast local marketplace sell-through.",
  barcodeValue: "SKU1001",
  itemNumber: "SKU1001",
  onHandQty: 4,
  reservedQty: 1,
  availableQty: 3,
  listedPrice: "$49.99",
  minAcceptablePrice: "$30.00",
  status: "Ready",
  statusClass: "badge badge-success",
  primaryImage:
    "https://images.unsplash.com/photo-1586208958839-06c17cacdf08?auto=format&fit=crop&w=1200&q=80",
};

const imageGallery = [
  {
    id: "img-1",
    url: "https://images.unsplash.com/photo-1586208958839-06c17cacdf08?auto=format&fit=crop&w=1200&q=80",
    label: "Primary Image",
  },
  {
    id: "img-2",
    url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=80",
    label: "Angle View",
  },
  {
    id: "img-3",
    url: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
    label: "Detail Shot",
  },
];

const listingSummary = [
  {
    platform: "Facebook Marketplace",
    status: "Not listed",
    statusClass: "badge badge-neutral",
    price: "—",
  },
  {
    platform: "Kijiji",
    status: "Draft",
    statusClass: "badge badge-warning",
    price: "$49.99",
  },
  {
    platform: "Karrot",
    status: "Not listed",
    statusClass: "badge badge-neutral",
    price: "—",
  },
];

const recentOrderActivity = [
  {
    id: "ORD-1001",
    label: "Reserved for local buyer",
    meta: "1 unit reserved • Awaiting pickup",
    status: "Open",
    statusClass: "badge badge-warning",
  },
  {
    id: "ORD-0992",
    label: "No completed sales yet",
    meta: "Order history will appear here as sales happen",
    status: "Info",
    statusClass: "badge badge-neutral",
  },
];

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;
  const productId = decodeURIComponent(id);

  return (
    <AppShell
      title={`Product • ${productId}`}
      subtitle="Review inventory, image readiness, listing status, and scan-linked intake for this item."
      action={
        <>
          <Link href="/scan" className="button button-secondary">
            <ScanLine size={16} />
            Scan Another
          </Link>
          <button type="button" className="button button-primary">
            <Pencil size={16} />
            Edit Product
          </button>
        </>
      }
    >
      <section className="toolbar" style={{ marginBottom: 18 }}>
        <Link href="/products" className="button button-ghost">
          <ArrowLeft size={16} />
          Back to Products
        </Link>
      </section>

      <section className="grid-cards-2">
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
                  Product record
                </div>
                <h1
                  className="page-title"
                  style={{
                    fontSize: "clamp(1.5rem, 2vw, 2.3rem)",
                    marginBottom: 10,
                  }}
                >
                  {product.title}
                </h1>
                <p className="page-subtitle" style={{ maxWidth: 720 }}>
                  {product.description}
                </p>
              </div>

              <span className={product.statusClass}>{product.status}</span>
            </div>

            <div
              style={{
                borderRadius: 24,
                overflow: "hidden",
                border: "1px solid rgba(var(--border), 0.88)",
                boxShadow: "var(--shadow-sm)",
                background: "rgba(255,255,255,0.72)",
              }}
            >
              <img
                src={product.primaryImage}
                alt={product.title}
                style={{
                  width: "100%",
                  height: 380,
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>

            <div className="grid-cards-3" style={{ marginTop: 18 }}>
              <div className="card">
                <div className="card-content">
                  <p className="metric-label">SKU</p>
                  <h3
                    style={{
                      margin: 0,
                      fontFamily: "var(--font-heading), sans-serif",
                      fontSize: 22,
                      fontWeight: 800,
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {product.sku}
                  </h3>
                  <p className="metric-helper">Primary product identifier</p>
                </div>
              </div>

              <div className="card">
                <div className="card-content">
                  <p className="metric-label">Item Number</p>
                  <h3
                    style={{
                      margin: 0,
                      fontFamily: "var(--font-heading), sans-serif",
                      fontSize: 22,
                      fontWeight: 800,
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {product.itemNumber}
                  </h3>
                  <p className="metric-helper">Imported source reference</p>
                </div>
              </div>

              <div className="card">
                <div className="card-content">
                  <p className="metric-label">Barcode Value</p>
                  <h3
                    style={{
                      margin: 0,
                      fontFamily: "var(--font-heading), sans-serif",
                      fontSize: 22,
                      fontWeight: 800,
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {product.barcodeValue}
                  </h3>
                  <p className="metric-helper">Used for scan-to-product flow</p>
                </div>
              </div>
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
                <p className="metric-label">On Hand Qty</p>
                <h2 className="metric-value">{product.onHandQty}</h2>
              </div>
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 16,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(79,70,229,0.10)",
                  border: "1px solid rgba(226,232,240,0.9)",
                }}
              >
                <Package2 size={20} />
              </div>
            </div>
            <p className="metric-helper">Physical units currently in stock.</p>
          </div>

          <div className="grid-cards-2">
            <div className="metric-card">
              <p className="metric-label">Reserved Qty</p>
              <h2 className="metric-value">{product.reservedQty}</h2>
              <p className="metric-helper">
                Units committed to open orders or pickups.
              </p>
            </div>

            <div className="metric-card">
              <p className="metric-label">Available Qty</p>
              <h2 className="metric-value">{product.availableQty}</h2>
              <p className="metric-helper">
                Calculated as on hand minus reserved.
              </p>
            </div>
          </div>

          <div className="grid-cards-2">
            <div className="metric-card">
              <p className="metric-label">Listed Price</p>
              <h2 className="metric-value">{product.listedPrice}</h2>
              <p className="metric-helper">Primary asking price.</p>
            </div>

            <div className="metric-card">
              <p className="metric-label">Minimum Price</p>
              <h2 className="metric-value">{product.minAcceptablePrice}</h2>
              <p className="metric-helper">Floor price for negotiation.</p>
            </div>
          </div>

          <div className="card">
            <div className="card-content">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                <ShieldCheck size={18} />
                <h2 className="section-title" style={{ margin: 0 }}>
                  Product readiness
                </h2>
              </div>
              <p className="card-description">
                This product has a clean SKU, image coverage, and pricing data.
                It is well-positioned for listing and fast marketplace intake.
              </p>

              <div className="toolbar" style={{ marginTop: 16 }}>
                <span className="badge badge-success">Catalog ready</span>
                <span className="badge badge-success">Image ready</span>
                <span className="badge badge-warning">1 unit reserved</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="grid-cards-2">
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
                <div>
                  <h2 className="section-title">Image gallery</h2>
                  <p className="section-subtitle">
                    Photos saved under this SKU should appear here immediately.
                  </p>
                </div>

                <span className="badge badge-neutral">
                  {imageGallery.length} images
                </span>
              </div>

              <div className="grid-cards-3">
                {imageGallery.map((image) => (
                  <div key={image.id} className="card">
                    <div
                      style={{
                        borderRadius: 18,
                        overflow: "hidden",
                        border: "1px solid rgba(var(--border), 0.84)",
                        background: "rgba(255,255,255,0.8)",
                      }}
                    >
                      <img
                        src={image.url}
                        alt={image.label}
                        style={{
                          width: "100%",
                          height: 180,
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    </div>

                    <div className="card-content" style={{ paddingTop: 14 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 8,
                        }}
                      >
                        <ImageIcon size={16} />
                        <h3 className="card-title" style={{ margin: 0 }}>
                          {image.label}
                        </h3>
                      </div>
                      <p className="card-description">
                        Stored under the product image folder for this SKU.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <ImageCaptureUpload sku={product.sku} />
        </div>
      </section>

      <section className="section">
        <div className="grid-cards-2">
          <div className="card">
            <div className="card-content">
              <h2 className="section-title">Marketplace listing readiness</h2>
              <p className="section-subtitle">
                Track which local platforms this product is already on.
              </p>

              <div className="grid-auto">
                {listingSummary.map((item) => (
                  <div
                    key={item.platform}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 14,
                      padding: "14px 0",
                      borderBottom: "1px solid rgba(var(--border), 0.72)",
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <h3
                        style={{
                          margin: 0,
                          fontSize: 15,
                          fontWeight: 700,
                        }}
                      >
                        {item.platform}
                      </h3>
                      <p
                        style={{
                          margin: "6px 0 0",
                          color: "rgb(var(--muted))",
                          fontSize: 14,
                        }}
                      >
                        Current price: {item.price}
                      </p>
                    </div>

                    <span className={item.statusClass}>{item.status}</span>
                  </div>
                ))}
              </div>

              <div className="toolbar" style={{ marginTop: 16 }}>
                <button type="button" className="button button-secondary">
                  <Tag size={16} />
                  Add Listing
                </button>
                <button type="button" className="button button-ghost">
                  <ExternalLink size={16} />
                  View Listing History
                </button>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-content">
              <h2 className="section-title">Order activity</h2>
              <p className="section-subtitle">
                Buyer commitments and order events tied to this item.
              </p>

              <div className="grid-auto">
                {recentOrderActivity.map((item) => (
                  <div
                    key={item.id}
                    className="card"
                    style={{ background: "rgba(255,255,255,0.62)" }}
                  >
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
                          <h3 className="card-title">{item.label}</h3>
                          <p className="card-description">{item.meta}</p>
                        </div>
                        <span className={item.statusClass}>{item.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="toolbar" style={{ marginTop: 16 }}>
                <button type="button" className="button button-primary">
                  <ShoppingCart size={16} />
                  Create Order
                </button>
                <button type="button" className="button button-secondary">
                  Reserve Inventory
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}