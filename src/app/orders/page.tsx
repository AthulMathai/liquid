import {
  Clock3,
  CreditCard,
  PackageCheck,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Truck,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import AppShell from "@/components/shared/AppShell";

const orderStats = [
  {
    label: "Open Orders",
    value: "0",
    helper: "Orders that still need pickup, shipping, or completion.",
    tone: "rgba(79,70,229,0.10)",
    icon: ShoppingCart,
  },
  {
    label: "Awaiting Pickup",
    value: "0",
    helper: "Buyer has committed and inventory is already reserved.",
    tone: "rgba(245,158,11,0.12)",
    icon: Clock3,
  },
  {
    label: "Shipped / Picked Up",
    value: "0",
    helper: "Orders already fulfilled but not fully closed out yet.",
    tone: "rgba(14,165,233,0.10)",
    icon: Truck,
  },
  {
    label: "Completed",
    value: "0",
    helper: "Orders fully closed and inventory already deducted.",
    tone: "rgba(16,185,129,0.10)",
    icon: PackageCheck,
  },
];

const orders = [
  {
    orderNumber: "ORD-1001",
    buyer: "John Carter",
    platform: "Facebook Marketplace",
    status: "Awaiting Pickup",
    statusClass: "badge badge-warning",
    fulfillment: "Pickup",
    payment: "Paid",
    paymentClass: "badge badge-success",
    total: "$45.00",
    lines: 1,
    orderDate: "Today",
  },
  {
    orderNumber: "ORD-1002",
    buyer: "Maria Lopez",
    platform: "Kijiji",
    status: "Shipped",
    statusClass: "badge badge-neutral",
    fulfillment: "Shipping",
    payment: "Paid",
    paymentClass: "badge badge-success",
    total: "$39.99",
    lines: 1,
    orderDate: "Today",
  },
  {
    orderNumber: "ORD-1003",
    buyer: "David Kim",
    platform: "Direct Sale",
    status: "Awaiting Payment",
    statusClass: "badge badge-danger",
    fulfillment: "Pickup",
    payment: "Pending",
    paymentClass: "badge badge-warning",
    total: "$59.99",
    lines: 1,
    orderDate: "Today",
  },
];

export default function OrdersPage() {
  return (
    <AppShell
      title="Orders"
      subtitle="Track buyer commitments, payment status, fulfillment progress, and inventory reservation from one central workflow."
      action={
        <button type="button" className="button button-primary">
          <ShoppingCart size={16} />
          New Order
        </button>
      }
    >
      <section className="grid-cards-4">
        {orderStats.map((card) => {
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
                  Order operations
                </div>
                <h2
                  className="page-title"
                  style={{
                    fontSize: "clamp(1.35rem, 1.8vw, 2rem)",
                    marginBottom: 10,
                  }}
                >
                  Convert buyer commitments into controlled, inventory-safe orders.
                </h2>
                <p className="page-subtitle" style={{ maxWidth: 760 }}>
                  This page is where inquiry turns into execution. As soon as a
                  buyer commits, create the order, reserve the quantity, and keep
                  payment and fulfillment status visible until the sale is fully
                  complete.
                </p>
              </div>

              <div className="toolbar">
                <span className="badge badge-success">Reservation aware</span>
                <span className="badge badge-neutral">Payment visible</span>
                <span className="badge badge-warning">Fulfillment tracked</span>
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
                    Create order
                  </h3>
                  <p className="metric-helper">
                    Attach the buyer, product, quantity, and agreed price.
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
                    Reserve stock
                  </h3>
                  <p className="metric-helper">
                    Reduce available inventory immediately to prevent overselling.
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
                    Complete fulfillment
                  </h3>
                  <p className="metric-helper">
                    Once picked up or shipped, deduct stock and close the order.
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
                <h2 className="section-title">Order tracker</h2>
                <p className="section-subtitle">
                  Monitor order status, payment, fulfillment type, and buyer from
                  one clean table.
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
                    placeholder="Search order, buyer, platform..."
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
                    <th>Order</th>
                    <th>Buyer</th>
                    <th>Platform</th>
                    <th>Status</th>
                    <th>Fulfillment</th>
                    <th>Payment</th>
                    <th>Total</th>
                    <th>Lines</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.orderNumber}>
                      <td
                        style={{
                          fontWeight: 800,
                          fontFamily: "var(--font-heading), sans-serif",
                        }}
                      >
                        <Link
                          href={`/orders/${order.orderNumber}`}
                          style={{
                            color: "rgb(var(--primary))",
                          }}
                        >
                          {order.orderNumber}
                        </Link>
                      </td>
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
                          <span style={{ fontWeight: 700 }}>{order.buyer}</span>
                        </div>
                      </td>
                      <td>{order.platform}</td>
                      <td>
                        <span className={order.statusClass}>{order.status}</span>
                      </td>
                      <td>{order.fulfillment}</td>
                      <td>
                        <span className={order.paymentClass}>{order.payment}</span>
                      </td>
                      <td>{order.total}</td>
                      <td>{order.lines}</td>
                      <td>{order.orderDate}</td>
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
                <span className="badge badge-success">Order view ready</span>
                <span className="badge badge-neutral">Payment state visible</span>
                <span className="badge badge-warning">Inventory linkage expected</span>
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
                <CreditCard size={20} />
              </div>
              <h3 className="card-title">Payment clarity</h3>
              <p className="card-description">
                Always track whether payment is pending or received before marking
                the order complete.
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
                <ShoppingCart size={20} />
              </div>
              <h3 className="card-title">Reserve first</h3>
              <p className="card-description">
                The moment a buyer commits, reserve the inventory so the same item
                does not get promised twice.
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
                <PackageCheck size={20} />
              </div>
              <h3 className="card-title">Complete cleanly</h3>
              <p className="card-description">
                When the item is picked up or shipped, deduct inventory and close
                the order so reporting stays accurate.
              </p>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}