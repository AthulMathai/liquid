import Link from "next/link";
import {
  ArrowLeft,
  Boxes,
  Camera,
  Pencil,
  ScanLine,
  ShoppingCart,
  Tag,
} from "lucide-react";

type ProductHeaderProps = {
  productId: string;
  sku: string;
  title: string;
  description?: string | null;
  status?: string;
  statusClassName?: string;
  onEdit?: () => void;
  backHref?: string;
};

export default function ProductHeader({
  productId,
  sku,
  title,
  description,
  status = "Draft",
  statusClassName = "badge badge-neutral",
  onEdit,
  backHref = "/products",
}: ProductHeaderProps) {
  return (
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
          <div style={{ minWidth: 0 }}>
            <div
              className="toolbar"
              style={{ marginBottom: 14, alignItems: "center" }}
            >
              <Link href={backHref} className="button button-ghost">
                <ArrowLeft size={16} />
                Back
              </Link>

              <span className="badge badge-neutral">Product ID: {productId}</span>
              <span className={statusClassName}>{status}</span>
            </div>

            <div className="page-eyebrow" style={{ marginBottom: 12 }}>
              Product overview
            </div>

            <h1
              className="page-title"
              style={{
                fontSize: "clamp(1.6rem, 2.1vw, 2.5rem)",
                marginBottom: 10,
                wordBreak: "break-word",
              }}
            >
              {title}
            </h1>

            <div
              className="toolbar"
              style={{
                marginBottom: 12,
                alignItems: "center",
                gap: 10,
              }}
            >
              <span className="badge badge-success">
                <Tag size={12} />
                SKU: {sku}
              </span>
              <span className="badge badge-neutral">
                <Boxes size={12} />
                SKU-driven record
              </span>
            </div>

            <p className="page-subtitle" style={{ maxWidth: 840, margin: 0 }}>
              {description ||
                "This product record is the central source for inventory, images, listings, inquiries, and orders."}
            </p>
          </div>

          <div className="toolbar">
            <Link href="/scan" className="button button-secondary">
              <ScanLine size={16} />
              Scan Item
            </Link>

            <Link href="/orders" className="button button-secondary">
              <ShoppingCart size={16} />
              View Orders
            </Link>

            <Link href={`/products/${encodeURIComponent(sku)}`} className="button button-secondary">
              <Camera size={16} />
              Open Detail
            </Link>

            <button
              type="button"
              className="button button-primary"
              onClick={onEdit}
            >
              <Pencil size={16} />
              Edit Product
            </button>
          </div>
        </div>

        <div className="grid-cards-3">
          <div className="card">
            <div className="card-content">
              <p className="metric-label">Identity</p>
              <h3
                style={{
                  margin: 0,
                  fontFamily: "var(--font-heading), sans-serif",
                  fontSize: 22,
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                }}
              >
                SKU-Centered
              </h3>
              <p className="metric-helper">
                Everything in the workflow should anchor back to this SKU.
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-content">
              <p className="metric-label">Best next step</p>
              <h3
                style={{
                  margin: 0,
                  fontFamily: "var(--font-heading), sans-serif",
                  fontSize: 22,
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                }}
              >
                Capture Images
              </h3>
              <p className="metric-helper">
                Strong image coverage makes the product listing-ready faster.
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-content">
              <p className="metric-label">Operational goal</p>
              <h3
                style={{
                  margin: 0,
                  fontFamily: "var(--font-heading), sans-serif",
                  fontSize: 22,
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                }}
              >
                Sell-Ready Record
              </h3>
              <p className="metric-helper">
                Clean identity, accurate stock, good photos, and listing visibility.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}