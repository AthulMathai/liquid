"use client";

import Link from "next/link";
import { ExternalLink, Package2, Search, ShoppingCart } from "lucide-react";

export type OrderItemsTableRow = {
  id: string;
  order_id?: string;
  item_id: string;
  sku?: string | null;
  title?: string | null;
  qty: number;
  shipped_qty: number;
  unit_price: number;
  line_total: number;
};

type OrderItemsTableProps = {
  items?: OrderItemsTableRow[];
  title?: string;
  subtitle?: string;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function getLineStatus(item: OrderItemsTableRow) {
  if (item.shipped_qty >= item.qty && item.qty > 0) {
    return {
      label: "Fulfilled",
      className: "badge badge-success",
    };
  }

  if (item.shipped_qty > 0 && item.shipped_qty < item.qty) {
    return {
      label: "Partial",
      className: "badge badge-warning",
    };
  }

  return {
    label: "Reserved",
    className: "badge badge-neutral",
  };
}

export default function OrderItemsTable({
  items = [],
  title = "Order Items",
  subtitle = "Review product lines, quantities, and fulfillment progress for this order.",
}: OrderItemsTableProps) {
  const hasRows = items.length > 0;

  const totals = items.reduce(
    (acc, item) => {
      acc.qty += item.qty;
      acc.shippedQty += item.shipped_qty;
      acc.value += item.line_total;
      return acc;
    },
    { qty: 0, shippedQty: 0, value: 0 }
  );

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
              {title}
            </h2>
            <p className="section-subtitle" style={{ margin: "6px 0 0" }}>
              {subtitle}
            </p>
          </div>

          <div className="toolbar">
            <div
              style={{
                position: "relative",
                minWidth: 260,
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
                placeholder="Search line items..."
                style={{ paddingLeft: 40 }}
              />
            </div>
          </div>
        </div>

        {!hasRows ? (
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
            <h3 className="empty-state-title">No order items yet</h3>
            <p className="empty-state-text">
              Once products are added to the order, their quantities, pricing,
              and fulfillment status will appear here.
            </p>
          </div>
        ) : (
          <>
            <div className="grid-cards-3" style={{ marginBottom: 18 }}>
              <div className="metric-card">
                <p className="metric-label">Total Qty</p>
                <h3 className="metric-value">{totals.qty}</h3>
                <p className="metric-helper">Combined quantity across all lines.</p>
              </div>

              <div className="metric-card">
                <p className="metric-label">Shipped Qty</p>
                <h3 className="metric-value">{totals.shippedQty}</h3>
                <p className="metric-helper">Units already fulfilled.</p>
              </div>

              <div className="metric-card">
                <p className="metric-label">Line Value</p>
                <h3 className="metric-value">{formatCurrency(totals.value)}</h3>
                <p className="metric-helper">Combined value of all order lines.</p>
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
                    <th>Open</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const status = getLineStatus(item);

                    return (
                      <tr key={item.id}>
                        <td
                          style={{
                            fontWeight: 800,
                            fontFamily: "var(--font-heading), sans-serif",
                          }}
                        >
                          {item.sku || "—"}
                        </td>
                        <td style={{ minWidth: 240 }}>
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
                              <Package2 size={16} />
                            </div>
                            <span style={{ fontWeight: 700 }}>
                              {item.title || "Untitled Product"}
                            </span>
                          </div>
                        </td>
                        <td>{item.qty}</td>
                        <td>{item.shipped_qty}</td>
                        <td>{formatCurrency(item.unit_price)}</td>
                        <td>{formatCurrency(item.line_total)}</td>
                        <td>
                          <span className={status.className}>{status.label}</span>
                        </td>
                        <td>
                          <Link
                            href={`/products/${item.sku ?? item.item_id}`}
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
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {hasRows ? (
          <div
            className="toolbar"
            style={{
              marginTop: 18,
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <div className="toolbar">
              <span className="badge badge-success">Line items loaded</span>
              <span className="badge badge-warning">Fulfillment visible</span>
              <span className="badge badge-neutral">Product links ready</span>
            </div>

            <div
              style={{
                color: "rgb(var(--muted))",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              {items.length} line{items.length === 1 ? "" : "s"}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}