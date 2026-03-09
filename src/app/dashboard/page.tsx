import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  Camera,
  CircleDollarSign,
  Clock3,
  MessageSquareMore,
  ScanLine,
  ShoppingCart,
  Sparkles,
  Upload,
} from "lucide-react";
import AppShell from "@/components/shared/AppShell";

const statCards = [
  {
    title: "Total Products",
    value: "0",
    helper: "Products imported and ready for intake.",
    icon: Boxes,
    tone: "rgba(79,70,229,0.10)",
  },
  {
    title: "Available Units",
    value: "0",
    helper: "Calculated from on-hand minus reserved.",
    icon: Sparkles,
    tone: "rgba(16,185,129,0.10)",
  },
  {
    title: "Open Orders",
    value: "0",
    helper: "Orders still awaiting completion.",
    icon: ShoppingCart,
    tone: "rgba(245,158,11,0.12)",
  },
  {
    title: "Open Inquiries",
    value: "0",
    helper: "Buyer conversations that still need follow-up.",
    icon: MessageSquareMore,
    tone: "rgba(14,165,233,0.10)",
  },
];

const quickActions = [
  {
    title: "Import inventory",
    description: "Upload your CSV and create product records in one pass.",
    href: "/imports",
    icon: Upload,
  },
  {
    title: "Open scanner",
    description: "Scan SKU or barcode and jump straight to the product page.",
    href: "/scan",
    icon: ScanLine,
  },
  {
    title: "Browse products",
    description: "Review pricing, stock, images, and product readiness.",
    href: "/products",
    icon: Boxes,
  },
  {
    title: "Create an order",
    description: "Reserve stock and move committed sales into tracked orders.",
    href: "/orders",
    icon: ShoppingCart,
  },
];

const workflowSteps = [
  {
    step: "01",
    title: "Import product records",
    text: "Start from your CSV so every item gets a clean SKU-driven record before you begin photography or listing.",
    icon: Upload,
  },
  {
    step: "02",
    title: "Scan and capture photos",
    text: "Use the camera to scan the item, open the product page, and save images under the correct product automatically.",
    icon: Camera,
  },
  {
    step: "03",
    title: "List and convert to orders",
    text: "Once products are ready, track listings, inquiries, and buyer commitments without losing inventory accuracy.",
    icon: CircleDollarSign,
  },
];

const recentActivity = [
  {
    title: "No imports yet",
    description: "Upload your first CSV to populate the dashboard.",
    meta: "Waiting for first intake",
    badge: "Idle",
    badgeClass: "badge badge-neutral",
  },
  {
    title: "No photos captured",
    description: "Scanned products and image uploads will show here once you start intake.",
    meta: "Image workflow not started",
    badge: "Pending",
    badgeClass: "badge badge-warning",
  },
  {
    title: "No active orders",
    description: "Orders created from sales or commitments will appear here.",
    meta: "Sales flow not started",
    badge: "Clear",
    badgeClass: "badge badge-success",
  },
];

export default function DashboardPage() {
  return (
    <AppShell
      title="Dashboard"
      subtitle="Your operational control center for liquidation inventory, product intake, image capture, and order tracking."
      action={
        <>
          <Link href="/imports" className="button button-primary">
            Import CSV
            <ArrowRight size={16} />
          </Link>
          <Link href="/scan" className="button button-secondary">
            Open Scanner
          </Link>
        </>
      }
    >
      <section className="grid-cards-4">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div key={card.title} className="metric-card">
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <div>
                  <p className="metric-label">{card.title}</p>
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
        <div className="grid-cards-2">
          <div className="glass-panel">
            <div className="card-content">
              <div className="page-eyebrow" style={{ marginBottom: 14 }}>
                Performance overview
              </div>

              <h2
                className="page-title"
                style={{
                  fontSize: "clamp(1.4rem, 1.9vw, 2rem)",
                  marginBottom: 10,
                }}
              >
                Built for speed, control, and clean sell-through.
              </h2>

              <p className="page-subtitle" style={{ maxWidth: 620 }}>
                This dashboard is designed to keep intake simple: import your
                inventory, scan each item, capture photos, and move products into
                the sales pipeline without losing control of stock.
              </p>

              <div className="grid-cards-3" style={{ marginTop: 20 }}>
                <div className="card">
                  <div className="card-content">
                    <p className="metric-label">Intake mode</p>
                    <h3
                      style={{
                        margin: 0,
                        fontFamily: "var(--font-heading), sans-serif",
                        fontSize: 22,
                        fontWeight: 800,
                        letterSpacing: "-0.04em",
                      }}
                    >
                      SKU-first
                    </h3>
                    <p className="metric-helper">
                      Every workflow starts from the product record.
                    </p>
                  </div>
                </div>

                <div className="card">
                  <div className="card-content">
                    <p className="metric-label">Photo workflow</p>
                    <h3
                      style={{
                        margin: 0,
                        fontFamily: "var(--font-heading), sans-serif",
                        fontSize: 22,
                        fontWeight: 800,
                        letterSpacing: "-0.04em",
                      }}
                    >
                      Scan-to-save
                    </h3>
                    <p className="metric-helper">
                      Capture images directly under the matched item.
                    </p>
                  </div>
                </div>

                <div className="card">
                  <div className="card-content">
                    <p className="metric-label">Inventory logic</p>
                    <h3
                      style={{
                        margin: 0,
                        fontFamily: "var(--font-heading), sans-serif",
                        fontSize: 22,
                        fontWeight: 800,
                        letterSpacing: "-0.04em",
                      }}
                    >
                      Reserved-aware
                    </h3>
                    <p className="metric-helper">
                      Available stock stays aligned as orders are created.
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
                  gap: 10,
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 14,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(79,70,229,0.10)",
                  }}
                >
                  <Clock3 size={20} />
                </div>
                <div>
                  <h2 className="section-title" style={{ margin: 0 }}>
                    Recommended daily flow
                  </h2>
                  <p className="section-subtitle" style={{ margin: "4px 0 0" }}>
                    A clean routine for intake and sell-through.
                  </p>
                </div>
              </div>

              <div className="grid-auto">
                {workflowSteps.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.step}
                      className="card"
                      style={{ background: "rgba(255,255,255,0.62)" }}
                    >
                      <div className="card-content">
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 14,
                          }}
                        >
                          <div
                            style={{
                              minWidth: 54,
                              height: 54,
                              borderRadius: 18,
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background:
                                "linear-gradient(135deg, rgba(79,70,229,0.14), rgba(14,165,233,0.10))",
                              border: "1px solid rgba(226,232,240,0.86)",
                            }}
                          >
                            <Icon size={22} />
                          </div>

                          <div style={{ minWidth: 0 }}>
                            <div
                              className="page-eyebrow"
                              style={{
                                marginBottom: 10,
                                padding: "6px 10px",
                                fontSize: 11,
                              }}
                            >
                              Step {item.step}
                            </div>
                            <h3 className="card-title">{item.title}</h3>
                            <p className="card-description">{item.text}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Quick actions</h2>
        <p className="section-subtitle">
          Start with the workflows that matter most in version 1.
        </p>

        <div className="grid-cards-4">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link key={action.href} href={action.href} className="card">
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

                  <h3 className="card-title">{action.title}</h3>
                  <p className="card-description">{action.description}</p>

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
        <div className="grid-cards-2">
          <div className="card">
            <div className="card-content">
              <h2 className="section-title">Recent activity</h2>
              <p className="section-subtitle">
                Once you begin imports, image capture, and orders, the latest
                activity will surface here.
              </p>

              <div className="grid-auto">
                {recentActivity.map((item) => (
                  <div
                    key={item.title}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
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
                          color: "rgb(var(--foreground))",
                        }}
                      >
                        {item.title}
                      </h3>
                      <p
                        style={{
                          margin: "6px 0 0",
                          color: "rgb(var(--muted))",
                          fontSize: 14,
                          lineHeight: 1.65,
                        }}
                      >
                        {item.description}
                      </p>
                      <p
                        style={{
                          margin: "8px 0 0",
                          color: "rgb(var(--muted))",
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {item.meta}
                      </p>
                    </div>

                    <span className={item.badgeClass}>{item.badge}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-content">
              <h2 className="section-title">What to build next</h2>
              <p className="section-subtitle">
                This is the order that gets you to a working system fastest.
              </p>

              <div className="grid-auto">
                {[
                  {
                    label: "1. CSV import and product list",
                    text: "Bring inventory into the system and make every SKU searchable.",
                  },
                  {
                    label: "2. Scan-to-product page",
                    text: "Use the camera to identify items and open the exact product page instantly.",
                  },
                  {
                    label: "3. Camera image upload",
                    text: "Capture and save photos under the matching product in storage.",
                  },
                  {
                    label: "4. Orders with reservation logic",
                    text: "Reserve stock as soon as a buyer commits so inventory stays accurate.",
                  },
                ].map((step) => (
                  <div
                    key={step.label}
                    className="card"
                    style={{ background: "rgba(255,255,255,0.62)" }}
                  >
                    <div className="card-content">
                      <h3 className="card-title">{step.label}</h3>
                      <p className="card-description">{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}