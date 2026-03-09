import {
  ExternalLink,
  Globe2,
  LayoutTemplate,
  Search,
  SlidersHorizontal,
  Tag,
  TrendingUp,
  UploadCloud,
} from "lucide-react";
import AppShell from "@/components/shared/AppShell";

const listingStats = [
  {
    label: "Active Listings",
    value: "0",
    helper: "Listings currently live across marketplaces.",
    tone: "rgba(16,185,129,0.10)",
    icon: Globe2,
  },
  {
    label: "Draft Listings",
    value: "0",
    helper: "Products prepared for posting but not live yet.",
    tone: "rgba(79,70,229,0.10)",
    icon: LayoutTemplate,
  },
  {
    label: "Pending Pickup",
    value: "0",
    helper: "Listings tied to buyers who are expected to collect items.",
    tone: "rgba(245,158,11,0.12)",
    icon: Tag,
  },
  {
    label: "Sold Listings",
    value: "0",
    helper: "Listings already converted into completed or pending orders.",
    tone: "rgba(14,165,233,0.10)",
    icon: TrendingUp,
  },
];

const listings = [
  {
    platform: "Facebook Marketplace",
    sku: "SKU1001",
    title: "Black toaster oven",
    price: "$49.99",
    qty: 1,
    url: "https://www.facebook.com/marketplace/",
    status: "Active",
    statusClass: "badge badge-success",
    listedAt: "Today",
  },
  {
    platform: "Kijiji",
    sku: "SKU1002",
    title: "Coffee maker stainless",
    price: "$39.99",
    qty: 1,
    url: "https://www.kijiji.ca/",
    status: "Draft",
    statusClass: "badge badge-warning",
    listedAt: "Today",
  },
  {
    platform: "Karrot",
    sku: "SKU1004",
    title: "Kitchen blender pro",
    price: "$59.99",
    qty: 1,
    url: "—",
    status: "Not Posted",
    statusClass: "badge badge-neutral",
    listedAt: "—",
  },
];

export default function ListingsPage() {
  return (
    <AppShell
      title="Listings"
      subtitle="Track where products are listed, what price is live, and which items still need to be posted across local marketplaces."
      action={
        <button type="button" className="button button-primary">
          <UploadCloud size={16} />
          Add Listing
        </button>
      }
    >
      <section className="grid-cards-4">
        {listingStats.map((card) => {
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
                  Marketplace control
                </div>
                <h2
                  className="page-title"
                  style={{
                    fontSize: "clamp(1.35rem, 1.8vw, 2rem)",
                    marginBottom: 10,
                  }}
                >
                  See exactly where each product is live and where it still needs
                  exposure.
                </h2>
                <p className="page-subtitle" style={{ maxWidth: 760 }}>
                  Listings should be easy to review from one screen. This page
                  shows what has already been posted, what is still in draft, and
                  which products are ready to be pushed to Facebook Marketplace,
                  Kijiji, Karrot, and other local channels.
                </p>
              </div>

              <div className="toolbar">
                <span className="badge badge-success">Cross-post aware</span>
                <span className="badge badge-neutral">Price visible</span>
                <span className="badge badge-warning">Manual posting supported</span>
              </div>
            </div>

            <div className="grid-cards-3">
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
                    Prepare the item
                  </h3>
                  <p className="metric-helper">
                    Make sure the product has inventory, price, and images first.
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
                    Post to marketplace
                  </h3>
                  <p className="metric-helper">
                    Copy the prepared title, description, and price into the live
                    platform.
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
                    Track status here
                  </h3>
                  <p className="metric-helper">
                    Save the platform, URL, price, and lifecycle state in one place.
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
                <h2 className="section-title">Listing tracker</h2>
                <p className="section-subtitle">
                  Review live posts, drafts, and products that still need
                  marketplace coverage.
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
                    placeholder="Search platform, SKU, title..."
                    style={{ paddingLeft: 40 }}
                  />
                </div>

                <button type="button" className="button button-secondary">
                  <SlidersHorizontal size={16} />
                  Filter
                </button>
              </div>
            </div>

            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Platform</th>
                    <th>SKU</th>
                    <th>Title</th>
                    <th>Price</th>
                    <th>Qty Listed</th>
                    <th>URL</th>
                    <th>Status</th>
                    <th>Listed At</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map((listing, index) => (
                    <tr key={`${listing.platform}-${listing.sku}-${index}`}>
                      <td>{listing.platform}</td>
                      <td
                        style={{
                          fontWeight: 800,
                          fontFamily: "var(--font-heading), sans-serif",
                        }}
                      >
                        {listing.sku}
                      </td>
                      <td style={{ minWidth: 240 }}>{listing.title}</td>
                      <td>{listing.price}</td>
                      <td>{listing.qty}</td>
                      <td>
                        {listing.url === "—" ? (
                          "—"
                        ) : (
                          <a
                            href={listing.url}
                            target="_blank"
                            rel="noreferrer"
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
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </td>
                      <td>
                        <span className={listing.statusClass}>{listing.status}</span>
                      </td>
                      <td>{listing.listedAt}</td>
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
                <span className="badge badge-success">Listing visibility ready</span>
                <span className="badge badge-neutral">URL tracking enabled</span>
                <span className="badge badge-warning">Manual sync for now</span>
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
                <LayoutTemplate size={20} />
              </div>
              <h3 className="card-title">Use one source listing</h3>
              <p className="card-description">
                Keep one clean product description and pricing source in the app,
                then copy it into each marketplace as needed.
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
                <Globe2 size={20} />
              </div>
              <h3 className="card-title">Cross-post intelligently</h3>
              <p className="card-description">
                Not every item needs every channel. Track where it performs best and
                focus effort on the strongest marketplace.
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
                <TrendingUp size={20} />
              </div>
              <h3 className="card-title">Keep status current</h3>
              <p className="card-description">
                As soon as an item is sold or pending pickup, update the listing
                state here so inventory and order decisions stay accurate.
              </p>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}