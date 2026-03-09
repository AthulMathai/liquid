import Link from "next/link";
import { ArrowRight, ShoppingCart, Truck } from "lucide-react";

type RecentOrder = {
  id: string;
  orderNumber: string;
  buyerName: string | null;
  platform: string | null;
  status: string;
  totalValue: number;
  orderDate?: string | null;
};

type RecentOrdersProps = {
  orders?: RecentOrder[];
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function RecentOrders({
  orders = [],
}: RecentOrdersProps) {
  const hasOrders = orders.length > 0;

  return (
    <div className="card">
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
            <h2 className="section-title" style={{ margin: 0 }}>
              Recent Orders
            </h2>
            <p className="section-subtitle" style={{ margin: "6px 0 0" }}>
              Latest order activity across your liquidation workflow.
            </p>
          </div>

          <Link href="/orders" className="button button-secondary">
            View All Orders
            <ArrowRight size={16} />
          </Link>
        </div>

        {!hasOrders ? (
          <div
            className="empty-state"
            style={{
              borderRadius: 20,
              border: "1px solid rgba(var(--border), 0.86)",
              background: "rgba(248,250,252,0.72)",
            }}
          >
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: 22,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(79,70,229,0.10)",
                border: "1px solid rgba(226,232,240,0.9)",
                marginBottom: 14,
              }}
            >
              <ShoppingCart size={30} />
            </div>
            <h3 className="empty-state-title">No recent orders yet</h3>
            <p className="empty-state-text">
              As soon as buyer commitments are converted into orders, they will
              appear here for quick review.
            </p>
          </div>
        ) : (
          <div className="grid-auto">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.orderNumber}`}
                className="card"
                style={{ background: "rgba(255,255,255,0.62)" }}
              >
                <div className="card-content">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: 14,
                      flexWrap: "wrap",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                        minWidth: 0,
                      }}
                    >
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 14,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "rgba(79,70,229,0.10)",
                          border: "1px solid rgba(226,232,240,0.9)",
                          flexShrink: 0,
                        }}
                      >
                        <Truck size={20} />
                      </div>

                      <div style={{ minWidth: 0 }}>
                        <h3 className="card-title" style={{ marginBottom: 6 }}>
                          {order.orderNumber}
                        </h3>
                        <p className="card-description">
                          {order.buyerName || "Unknown Buyer"} •{" "}
                          {order.platform || "Direct"}
                        </p>
                        <p
                          style={{
                            margin: "8px 0 0",
                            color: "rgb(var(--muted))",
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          {order.orderDate || "No date"}
                        </p>
                      </div>
                    </div>

                    <div
                      style={{
                        textAlign: "right",
                        minWidth: 120,
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "var(--font-heading), sans-serif",
                          fontSize: 20,
                          fontWeight: 800,
                          letterSpacing: "-0.03em",
                          color: "rgb(var(--foreground))",
                        }}
                      >
                        {formatCurrency(order.totalValue)}
                      </div>
                      <div
                        style={{
                          marginTop: 8,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          minHeight: 30,
                          padding: "0 12px",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 800,
                          background: "rgba(148,163,184,0.12)",
                          color: "rgb(71,85,105)",
                        }}
                      >
                        {order.status}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}