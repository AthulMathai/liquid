import {
  Clock3,
  MessageSquareMore,
  PhoneCall,
  Search,
  SlidersHorizontal,
  Tag,
  TrendingUp,
  UserRound,
} from "lucide-react";
import AppShell from "@/components/shared/AppShell";

const inquiryStats = [
  {
    label: "Open Inquiries",
    value: "0",
    helper: "Buyer conversations still active or awaiting follow-up.",
    tone: "rgba(79,70,229,0.10)",
    icon: MessageSquareMore,
  },
  {
    label: "Negotiating",
    value: "0",
    helper: "Inquiries where price or terms are still being discussed.",
    tone: "rgba(245,158,11,0.12)",
    icon: TrendingUp,
  },
  {
    label: "Scheduled Pickups",
    value: "0",
    helper: "Buyers who have committed and are expected to collect items.",
    tone: "rgba(16,185,129,0.10)",
    icon: Clock3,
  },
  {
    label: "Converted",
    value: "0",
    helper: "Inquiries that have already turned into orders.",
    tone: "rgba(14,165,233,0.10)",
    icon: Tag,
  },
];

const inquiries = [
  {
    buyer: "Sarah Lee",
    platform: "Facebook Marketplace",
    sku: "SKU1001",
    item: "Black toaster oven",
    summary: "Is this still available? Can you do $40?",
    offer: "$40.00",
    status: "Negotiating",
    statusClass: "badge badge-warning",
    followUp: "Today",
  },
  {
    buyer: "David Kim",
    platform: "Kijiji",
    sku: "SKU1002",
    item: "Coffee maker stainless",
    summary: "Can you ship this item?",
    offer: "—",
    status: "Replied",
    statusClass: "badge badge-neutral",
    followUp: "Tomorrow",
  },
  {
    buyer: "Maya Patel",
    platform: "Karrot",
    sku: "SKU1004",
    item: "Kitchen blender pro",
    summary: "I can pick it up this evening.",
    offer: "$55.00",
    status: "Scheduled Pickup",
    statusClass: "badge badge-success",
    followUp: "6:00 PM",
  },
];

export default function InquiriesPage() {
  return (
    <AppShell
      title="Inquiries"
      subtitle="Track buyer conversations, offers, follow-ups, and conversion into orders without losing context across marketplaces."
      action={
        <button type="button" className="button button-primary">
          <MessageSquareMore size={16} />
          New Inquiry
        </button>
      }
    >
      <section className="grid-cards-4">
        {inquiryStats.map((card) => {
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
                  Buyer communication
                </div>
                <h2
                  className="page-title"
                  style={{
                    fontSize: "clamp(1.35rem, 1.8vw, 2rem)",
                    marginBottom: 10,
                  }}
                >
                  Keep every buyer interaction tied to the product record.
                </h2>
                <p className="page-subtitle" style={{ maxWidth: 760 }}>
                  Inquiries should not live only inside marketplace chats. Log
                  the buyer, the product, the offer, and the next action here so
                  you can follow up properly and convert promising leads into
                  real orders.
                </p>
              </div>

              <div className="toolbar">
                <span className="badge badge-success">Offer tracking</span>
                <span className="badge badge-neutral">Follow-up ready</span>
                <span className="badge badge-warning">Conversion focused</span>
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
                    Log the buyer
                  </h3>
                  <p className="metric-helper">
                    Record the contact, platform, product, and message summary.
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
                    Track the offer
                  </h3>
                  <p className="metric-helper">
                    Capture proposed price, objections, and next response.
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
                    Convert to order
                  </h3>
                  <p className="metric-helper">
                    Once committed, reserve the stock and create the order.
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
                <h2 className="section-title">Inquiry tracker</h2>
                <p className="section-subtitle">
                  Review all leads, status, and follow-up timing from one place.
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
                    placeholder="Search buyer, SKU, platform..."
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
                    <th>Buyer</th>
                    <th>Platform</th>
                    <th>SKU</th>
                    <th>Item</th>
                    <th>Message Summary</th>
                    <th>Offer</th>
                    <th>Status</th>
                    <th>Follow-Up</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map((inquiry, index) => (
                    <tr key={`${inquiry.buyer}-${index}`}>
                      <td style={{ minWidth: 180 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 12,
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: "rgba(79,70,229,0.10)",
                              border: "1px solid rgba(226,232,240,0.9)",
                              flexShrink: 0,
                            }}
                          >
                            <UserRound size={16} />
                          </div>
                          <span style={{ fontWeight: 700 }}>{inquiry.buyer}</span>
                        </div>
                      </td>
                      <td>{inquiry.platform}</td>
                      <td
                        style={{
                          fontWeight: 800,
                          fontFamily: "var(--font-heading), sans-serif",
                        }}
                      >
                        {inquiry.sku}
                      </td>
                      <td>{inquiry.item}</td>
                      <td style={{ minWidth: 260 }}>{inquiry.summary}</td>
                      <td>{inquiry.offer}</td>
                      <td>
                        <span className={inquiry.statusClass}>{inquiry.status}</span>
                      </td>
                      <td>{inquiry.followUp}</td>
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
                <span className="badge badge-success">Inquiry logging ready</span>
                <span className="badge badge-neutral">Offer status visible</span>
                <span className="badge badge-warning">Manual follow-up for now</span>
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
                <PhoneCall size={20} />
              </div>
              <h3 className="card-title">Follow-up discipline</h3>
              <p className="card-description">
                The value of this page comes from logging the next action and
                actually following up on time.
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
                <TrendingUp size={20} />
              </div>
              <h3 className="card-title">Price intelligence</h3>
              <p className="card-description">
                Buyer offers quickly show which items are hot, overpriced, or
                better suited for bundling.
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
                <Tag size={20} />
              </div>
              <h3 className="card-title">Conversion path</h3>
              <p className="card-description">
                As soon as the buyer commits, move the inquiry into an order and
                reserve the inventory immediately.
              </p>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}