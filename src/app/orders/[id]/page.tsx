import Link from "next/link";
import {
  ArrowLeft,
  BadgeDollarSign,
  Clock3,
  CreditCard,
  MapPin,
  Package2,
  Pencil,
  ShieldCheck,
  ShoppingCart,
  Truck,
  UserRound,
} from "lucide-react";
import AppShell from "@/components/shared/AppShell";

type OrderDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const order = {
  id: "ORD-1001",
  orderNumber: "ORD-1001",
  buyerName: "John Carter",
  buyerEmail: "john.carter@example.com",
  buyerPhone: "(555) 210-4432",
  buyerAddress: "North York, Toronto, ON",
  platform: "Facebook Marketplace",
  paymentMethod: "Cash",
  paymentReceived: true,
  fulfillmentType: "Pickup",
  orderStatus: "Awaiting Pickup",
  statusClass: "badge badge-warning",
  orderDate: "Mar 8, 2026",
  shipDate: "—",
  totalValue: "$45.00",
  shippedValue: "$0.00",
  notes:
    "Buyer confirmed pickup for this evening. One unit already reserved in inventory.",
};

const orderItems = [
  {
    sku: "SKU1001",
    title: "Black toaster oven",
    qty: 1,
    shippedQty: 0,
    unitPrice: "$45.00",
    lineTotal: "$45.00",
    itemStatus: "Reserved",
    itemStatusClass: "badge badge-warning",
  },
];

const timeline = [
  {
    title: "Order created",
    description: "Order record was created and linked to the product.",
    time: "Today, 10:14 AM",
    tone: "rgba(79,70,229,0.10)",
  },
  {
    title: "Inventory reserved",
    description: "1 unit was reserved to prevent overselling.",
    time: "Today, 10:15 AM",
    tone: "rgba(245,158,11,0.12)",
  },
  {
    title: "Awaiting pickup",
    description: "Buyer confirmed intent to collect the product.",
    time: "Today, 10:25 AM",
    tone: "rgba(16,185,129,0.10)",
  },
];

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { id } = await params;
  const orderId = decodeURIComponent(id);

  return (
    <AppShell
      title={`Order • ${orderId}`}
      subtitle="Review order details, item lines, payment state, and fulfillment progress from one clean control page."
      action={
        <>
          <button type="button" className="button button-secondary">
            <ShoppingCart size={16} />
            Update Status
          </button>
          <button type="button" className="button button-primary">
            <Pencil size={16} />
            Edit Order
          </button>
        </>
      }
    >
      <section className="toolbar" style={{ marginBottom: 18 }}>
        <Link href="/orders" className="button button-ghost">
          <ArrowLeft size={16} />
          Back to Orders
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
                  Order summary
                </div>
                <h1
                  className="page-title"
                  style={{
                    fontSize: "clamp(1.5rem, 2vw, 2.3rem)",
                    marginBottom: 10,
                  }}
                >
                  {order.orderNumber}
                </h1>
                <p className="page-subtitle" style={{ maxWidth: 720 }}>
                  This page keeps the buyer details, order value, item lines, and
                  fulfillment state together so you can complete the order without
                  losing track of inventory.
                </p>
              </div>

              <span className={order.statusClass}>{order.orderStatus}</span>
            </div>

            <div className="grid-cards-3">
              <div className="card">
                <div className="card-content">
                  <p className="metric-label">Platform</p>
                  <h3
                    style={{
                      margin: 0,
                      fontFamily: "var(--font-heading), sans-serif",
                      fontSize: 22,
                      fontWeight: 800,
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {order.platform}
                  </h3>
                  <p className="metric-helper">Source of the sale.</p>
                </div>
              </div>

              <div className="card">
                <div className="card-content">
                  <p className="metric-label">Order Date</p>
                  <h3
                    style={{
                      margin: 0,
                      fontFamily: "var(--font-heading), sans-serif",
                      fontSize: 22,
                      fontWeight: 800,
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {order.orderDate}
                  </h3>
                  <p className="metric-helper">When the order was entered.</p>
                </div>
              </div>

              <div className="card">
                <div className="card-content">
                  <p className="metric-label">Fulfillment</p>
                  <h3
                    style={{
                      margin: 0,
                      fontFamily: "var(--font-heading), sans-serif",
                      fontSize: 22,
                      fontWeight: 800,
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {order.fulfillmentType}
                  </h3>
                  <p className="metric-helper">Current handoff method.</p>
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: 18,
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
                <strong>Notes:</strong> {order.notes}
              </p>
            </div>
          </div>
        </div>

        <div className="grid-auto">
          <div className="grid-cards-2">
            <div className="metric-card">
              <p className="metric-label">Total Value</p>
              <h2 className="metric-value">{order.totalValue}</h2>
              <p className="metric-helper">Current total for this order.</p>
            </div>

            <div className="metric-card">
              <p className="metric-label">Shipped Value</p>
              <h2 className="metric-value">{order.shippedValue}</h2>
              <p className="metric-helper">Value already fulfilled.</p>
            </div>
          </div>

          <div className="grid-cards-2">
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
                  <p className="metric-label">Payment</p>
                  <h2
                    style={{
                      margin: 0,
                      fontFamily: "var(--font-heading), sans-serif",
                      fontSize: 22,
                      fontWeight: 800,
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {order.paymentReceived ? "Received" : "Pending"}
                  </h2>
                </div>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(16,185,129,0.10)",
                    border: "1px solid rgba(226,232,240,0.9)",
                  }}
                >
                  <CreditCard size={20} />
                </div>
              </div>
              <p className="metric-helper">{order.paymentMethod}</p>
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
                  <p className="metric-label">Ship / Pickup Date</p>
                  <h2
                    style={{
                      margin: 0,
                      fontFamily: "var(--font-heading), sans-serif",
                      fontSize: 22,
                      fontWeight: 800,
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {order.shipDate}
                  </h2>
                </div>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(14,165,233,0.10)",
                    border: "1px solid rgba(226,232,240,0.9)",
                  }}
                >
                  <Truck size={20} />
                </div>
              </div>
              <p className="metric-helper">Fulfillment target.</p>
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
                  Order health
                </h2>
              </div>
              <p className="card-description">
                Inventory is already reserved for this order, which helps prevent
                overselling while you wait for pickup or shipment.
              </p>

              <div className="toolbar" style={{ marginTop: 16 }}>
                <span className="badge badge-success">Buyer logged</span>
                <span className="badge badge-warning">Inventory reserved</span>
                <span className="badge badge-neutral">Awaiting fulfillment</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="grid-cards-2">
          <div className="card">
            <div className="card-content">
              <h2 className="section-title">Buyer details</h2>
              <p className="section-subtitle">
                Contact and location details linked to this order.
              </p>

              <div className="grid-auto">
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    padding: "14px 0",
                    borderBottom: "1px solid rgba(var(--border), 0.72)",
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 14,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(79,70,229,0.10)",
                      flexShrink: 0,
                    }}
                  >
                    <UserRound size={18} />
                  </div>
                  <div>
                    <h3 className="card-title" style={{ marginBottom: 6 }}>
                      {order.buyerName}
                    </h3>
                    <p className="card-description">{order.buyerEmail}</p>
                    <p className="card-description">{order.buyerPhone}</p>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    padding: "14px 0",
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 14,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(14,165,233,0.10)",
                      flexShrink: 0,
                    }}
                  >
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h3 className="card-title" style={{ marginBottom: 6 }}>
                      Pickup / Address
                    </h3>
                    <p className="card-description">{order.buyerAddress}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-content">
              <h2 className="section-title">Order timeline</h2>
              <p className="section-subtitle">
                Key events associated with this order.
              </p>

              <div className="grid-auto">
                {timeline.map((entry) => (
                  <div
                    key={entry.title}
                    className="card"
                    style={{ background: "rgba(255,255,255,0.62)" }}
                  >
                    <div className="card-content">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 12,
                        }}
                      >
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 14,
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: entry.tone,
                            flexShrink: 0,
                          }}
                        >
                          <Clock3 size={18} />
                        </div>
                        <div>
                          <h3 className="card-title">{entry.title}</h3>
                          <p className="card-description">{entry.description}</p>
                          <p
                            style={{
                              margin: "8px 0 0",
                              color: "rgb(var(--muted))",
                              fontSize: 12,
                              fontWeight: 600,
                            }}
                          >
                            {entry.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
                <h2 className="section-title">Order items</h2>
                <p className="section-subtitle">
                  Products attached to this order and their fulfillment state.
                </p>
              </div>

              <div className="toolbar">
                <span className="badge badge-success">Order lines visible</span>
                <span className="badge badge-warning">Reservation tracked</span>
              </div>
            </div>

            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Shipped Qty</th>
                    <th>Unit Price</th>
                    <th>Line Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item) => (
                    <tr key={item.sku}>
                      <td
                        style={{
                          fontWeight: 800,
                          fontFamily: "var(--font-heading), sans-serif",
                        }}
                      >
                        {item.sku}
                      </td>
                      <td style={{ minWidth: 260 }}>{item.title}</td>
                      <td>{item.qty}</td>
                      <td>{item.shippedQty}</td>
                      <td>{item.unitPrice}</td>
                      <td>{item.lineTotal}</td>
                      <td>
                        <span className={item.itemStatusClass}>
                          {item.itemStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="toolbar" style={{ marginTop: 18 }}>
              <button type="button" className="button button-secondary">
                <Package2 size={16} />
                Mark Picked Up
              </button>
              <button type="button" className="button button-primary">
                <BadgeDollarSign size={16} />
                Mark Completed
              </button>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}