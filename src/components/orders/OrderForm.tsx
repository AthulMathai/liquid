"use client";

import { useMemo, useState } from "react";
import {
  CreditCard,
  MapPin,
  Package2,
  Save,
  ShoppingCart,
  Truck,
  UserRound,
} from "lucide-react";

type OrderFormValues = {
  orderNumber: string;
  platform: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  buyerAddress: string;
  paymentMethod: string;
  paymentReceived: boolean;
  fulfillmentType: string;
  shippingCost: string;
  orderStatus: string;
  orderDate: string;
  shipDate: string;
  notes: string;
  sku: string;
  itemId: string;
  qty: string;
  unitPrice: string;
};

const initialValues: OrderFormValues = {
  orderNumber: "",
  platform: "facebook",
  buyerName: "",
  buyerEmail: "",
  buyerPhone: "",
  buyerAddress: "",
  paymentMethod: "cash",
  paymentReceived: false,
  fulfillmentType: "pickup",
  shippingCost: "0",
  orderStatus: "awaiting_payment",
  orderDate: "",
  shipDate: "",
  notes: "",
  sku: "",
  itemId: "",
  qty: "1",
  unitPrice: "",
};

const platformOptions = [
  { value: "facebook", label: "Facebook Marketplace" },
  { value: "kijiji", label: "Kijiji" },
  { value: "karrot", label: "Karrot" },
  { value: "craigslist", label: "Craigslist" },
  { value: "shopify", label: "Shopify" },
  { value: "direct", label: "Direct Sale" },
];

const paymentMethodOptions = [
  { value: "cash", label: "Cash" },
  { value: "etransfer", label: "E-Transfer" },
  { value: "credit_card", label: "Credit Card" },
  { value: "paypal", label: "PayPal" },
  { value: "other", label: "Other" },
];

const fulfillmentOptions = [
  { value: "pickup", label: "Pickup" },
  { value: "shipping", label: "Shipping" },
  { value: "delivery", label: "Delivery" },
];

const statusOptions = [
  { value: "awaiting_payment", label: "Awaiting Payment" },
  { value: "paid", label: "Paid" },
  { value: "awaiting_pickup", label: "Awaiting Pickup" },
  { value: "picked_up", label: "Picked Up" },
  { value: "shipped", label: "Shipped" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "refunded", label: "Refunded" },
];

function parseMoney(value: string) {
  const parsed = Number(value.replace(/[$,]/g, "").trim() || 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseQty(value: string) {
  const parsed = Math.floor(Number(value || 0));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function OrderForm() {
  const [values, setValues] = useState<OrderFormValues>(initialValues);
  const [isSaving, setIsSaving] = useState(false);

  const selectedPlatformLabel = useMemo(() => {
    return (
      platformOptions.find((option) => option.value === values.platform)?.label ??
      "Unknown"
    );
  }, [values.platform]);

  const selectedStatusLabel = useMemo(() => {
    return (
      statusOptions.find((option) => option.value === values.orderStatus)?.label ??
      "Unknown"
    );
  }, [values.orderStatus]);

  const selectedFulfillmentLabel = useMemo(() => {
    return (
      fulfillmentOptions.find((option) => option.value === values.fulfillmentType)
        ?.label ?? "Unknown"
    );
  }, [values.fulfillmentType]);

  const lineTotal = useMemo(() => {
    return parseQty(values.qty) * parseMoney(values.unitPrice);
  }, [values.qty, values.unitPrice]);

  const grandTotal = useMemo(() => {
    return lineTotal + parseMoney(values.shippingCost);
  }, [lineTotal, values.shippingCost]);

  function updateField<K extends keyof OrderFormValues>(
    key: K,
    value: OrderFormValues[K]
  ) {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);

    await new Promise((resolve) => setTimeout(resolve, 900));

    setIsSaving(false);
    window.alert(
      "Order form looks good. Next step: connect this form to the create-order Netlify function."
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card">
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
              Order intake
            </div>
            <h2 className="section-title" style={{ margin: 0 }}>
              Create a new order
            </h2>
            <p className="section-subtitle" style={{ margin: "6px 0 0" }}>
              Capture the buyer, linked product, quantity, pricing, and
              fulfillment details so inventory can be reserved immediately.
            </p>
          </div>

          <div className="toolbar">
            <span className="badge badge-success">{selectedPlatformLabel}</span>
            <span className="badge badge-warning">{selectedStatusLabel}</span>
            <span className="badge badge-neutral">{selectedFulfillmentLabel}</span>
          </div>
        </div>

        <div className="grid-cards-2">
          <div className="card" style={{ background: "rgba(255,255,255,0.62)" }}>
            <div className="card-content">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 16,
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
                  <ShoppingCart size={18} />
                </div>
                <div>
                  <h3 className="card-title" style={{ margin: 0 }}>
                    Order header
                  </h3>
                  <p className="card-description" style={{ marginTop: 4 }}>
                    Basic order identity and sales channel information.
                  </p>
                </div>
              </div>

              <div className="grid-auto">
                <div className="grid-cards-2">
                  <div className="field-group">
                    <label className="label" htmlFor="orderNumber">
                      Order Number
                    </label>
                    <input
                      id="orderNumber"
                      className="input"
                      value={values.orderNumber}
                      onChange={(e) => updateField("orderNumber", e.target.value)}
                      placeholder="ORD-1004"
                    />
                  </div>

                  <div className="field-group">
                    <label className="label" htmlFor="platform">
                      Platform
                    </label>
                    <select
                      id="platform"
                      className="select"
                      value={values.platform}
                      onChange={(e) => updateField("platform", e.target.value)}
                    >
                      {platformOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid-cards-2">
                  <div className="field-group">
                    <label className="label" htmlFor="orderDate">
                      Order Date
                    </label>
                    <input
                      id="orderDate"
                      type="datetime-local"
                      className="input"
                      value={values.orderDate}
                      onChange={(e) => updateField("orderDate", e.target.value)}
                    />
                  </div>

                  <div className="field-group">
                    <label className="label" htmlFor="orderStatus">
                      Order Status
                    </label>
                    <select
                      id="orderStatus"
                      className="select"
                      value={values.orderStatus}
                      onChange={(e) => updateField("orderStatus", e.target.value)}
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="field-group">
                  <label className="label" htmlFor="notes">
                    Order Notes
                  </label>
                  <textarea
                    id="notes"
                    className="textarea"
                    value={values.notes}
                    onChange={(e) => updateField("notes", e.target.value)}
                    placeholder="Buyer confirmed they will pick up after work."
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ background: "rgba(255,255,255,0.62)" }}>
            <div className="card-content">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 16,
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
                    background: "rgba(14,165,233,0.10)",
                  }}
                >
                  <UserRound size={18} />
                </div>
                <div>
                  <h3 className="card-title" style={{ margin: 0 }}>
                    Buyer details
                  </h3>
                  <p className="card-description" style={{ marginTop: 4 }}>
                    Contact information and destination for the order.
                  </p>
                </div>
              </div>

              <div className="grid-auto">
                <div className="field-group">
                  <label className="label" htmlFor="buyerName">
                    Buyer Name
                  </label>
                  <input
                    id="buyerName"
                    className="input"
                    value={values.buyerName}
                    onChange={(e) => updateField("buyerName", e.target.value)}
                    placeholder="John Carter"
                  />
                </div>

                <div className="grid-cards-2">
                  <div className="field-group">
                    <label className="label" htmlFor="buyerEmail">
                      Buyer Email
                    </label>
                    <input
                      id="buyerEmail"
                      type="email"
                      className="input"
                      value={values.buyerEmail}
                      onChange={(e) => updateField("buyerEmail", e.target.value)}
                      placeholder="john@example.com"
                    />
                  </div>

                  <div className="field-group">
                    <label className="label" htmlFor="buyerPhone">
                      Buyer Phone
                    </label>
                    <input
                      id="buyerPhone"
                      className="input"
                      value={values.buyerPhone}
                      onChange={(e) => updateField("buyerPhone", e.target.value)}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div className="field-group">
                  <label className="label" htmlFor="buyerAddress">
                    Buyer Address / Pickup Notes
                  </label>
                  <textarea
                    id="buyerAddress"
                    className="textarea"
                    value={values.buyerAddress}
                    onChange={(e) => updateField("buyerAddress", e.target.value)}
                    placeholder="North York, Toronto, ON"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid-cards-2" style={{ marginTop: 18 }}>
          <div className="card" style={{ background: "rgba(255,255,255,0.62)" }}>
            <div className="card-content">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 16,
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
                    background: "rgba(245,158,11,0.12)",
                  }}
                >
                  <Package2 size={18} />
                </div>
                <div>
                  <h3 className="card-title" style={{ margin: 0 }}>
                    Order line
                  </h3>
                  <p className="card-description" style={{ marginTop: 4 }}>
                    Link the product and quantity that should be reserved.
                  </p>
                </div>
              </div>

              <div className="grid-auto">
                <div className="grid-cards-2">
                  <div className="field-group">
                    <label className="label" htmlFor="sku">
                      SKU
                    </label>
                    <input
                      id="sku"
                      className="input"
                      value={values.sku}
                      onChange={(e) => updateField("sku", e.target.value)}
                      placeholder="SKU1001"
                    />
                  </div>

                  <div className="field-group">
                    <label className="label" htmlFor="itemId">
                      Item ID
                    </label>
                    <input
                      id="itemId"
                      className="input"
                      value={values.itemId}
                      onChange={(e) => updateField("itemId", e.target.value)}
                      placeholder="UUID item reference"
                    />
                  </div>
                </div>

                <div className="grid-cards-2">
                  <div className="field-group">
                    <label className="label" htmlFor="qty">
                      Quantity
                    </label>
                    <input
                      id="qty"
                      className="input"
                      value={values.qty}
                      onChange={(e) => updateField("qty", e.target.value)}
                      placeholder="1"
                    />
                  </div>

                  <div className="field-group">
                    <label className="label" htmlFor="unitPrice">
                      Unit Price
                    </label>
                    <input
                      id="unitPrice"
                      className="input"
                      value={values.unitPrice}
                      onChange={(e) => updateField("unitPrice", e.target.value)}
                      placeholder="45.00"
                    />
                  </div>
                </div>

                <div
                  style={{
                    padding: 16,
                    borderRadius: 18,
                    background: "rgba(248,250,252,0.86)",
                    border: "1px solid rgba(226,232,240,0.85)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <p className="metric-label" style={{ marginBottom: 6 }}>
                        Line Total
                      </p>
                      <h3
                        style={{
                          margin: 0,
                          fontFamily: "var(--font-heading), sans-serif",
                          fontSize: 24,
                          fontWeight: 800,
                          letterSpacing: "-0.04em",
                        }}
                      >
                        {formatCurrency(lineTotal)}
                      </h3>
                    </div>

                    <span className="badge badge-warning">
                      Reserve on save
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ background: "rgba(255,255,255,0.62)" }}>
            <div className="card-content">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 16,
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
                    background: "rgba(16,185,129,0.10)",
                  }}
                >
                  <Truck size={18} />
                </div>
                <div>
                  <h3 className="card-title" style={{ margin: 0 }}>
                    Payment & fulfillment
                  </h3>
                  <p className="card-description" style={{ marginTop: 4 }}>
                    Control how the order will be completed and settled.
                  </p>
                </div>
              </div>

              <div className="grid-auto">
                <div className="grid-cards-2">
                  <div className="field-group">
                    <label className="label" htmlFor="paymentMethod">
                      Payment Method
                    </label>
                    <select
                      id="paymentMethod"
                      className="select"
                      value={values.paymentMethod}
                      onChange={(e) =>
                        updateField("paymentMethod", e.target.value)
                      }
                    >
                      {paymentMethodOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="field-group">
                    <label className="label" htmlFor="fulfillmentType">
                      Fulfillment Type
                    </label>
                    <select
                      id="fulfillmentType"
                      className="select"
                      value={values.fulfillmentType}
                      onChange={(e) =>
                        updateField("fulfillmentType", e.target.value)
                      }
                    >
                      {fulfillmentOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid-cards-2">
                  <div className="field-group">
                    <label className="label" htmlFor="shippingCost">
                      Shipping Cost
                    </label>
                    <input
                      id="shippingCost"
                      className="input"
                      value={values.shippingCost}
                      onChange={(e) =>
                        updateField("shippingCost", e.target.value)
                      }
                      placeholder="0.00"
                    />
                  </div>

                  <div className="field-group">
                    <label className="label" htmlFor="shipDate">
                      Ship / Pickup Date
                    </label>
                    <input
                      id="shipDate"
                      type="datetime-local"
                      className="input"
                      value={values.shipDate}
                      onChange={(e) => updateField("shipDate", e.target.value)}
                    />
                  </div>
                </div>

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "12px 14px",
                    borderRadius: 14,
                    border: "1px solid rgba(var(--border), 0.92)",
                    background: "rgba(255,255,255,0.96)",
                    boxShadow: "var(--shadow-xs)",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={values.paymentReceived}
                    onChange={(e) =>
                      updateField("paymentReceived", e.target.checked)
                    }
                  />
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  >
                    Payment already received
                  </span>
                </label>

                <div className="grid-cards-2">
                  <div
                    style={{
                      padding: 16,
                      borderRadius: 18,
                      background: "rgba(248,250,252,0.86)",
                      border: "1px solid rgba(226,232,240,0.85)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 8,
                      }}
                    >
                      <CreditCard size={16} />
                      <h4
                        style={{
                          margin: 0,
                          fontSize: 15,
                          fontWeight: 800,
                        }}
                      >
                        Payment state
                      </h4>
                    </div>
                    <p
                      style={{
                        margin: 0,
                        color: "rgb(var(--muted))",
                        fontSize: 14,
                        lineHeight: 1.65,
                      }}
                    >
                      {values.paymentReceived
                        ? "Payment is marked as received."
                        : "Payment is still pending."}
                    </p>
                  </div>

                  <div
                    style={{
                      padding: 16,
                      borderRadius: 18,
                      background: "rgba(248,250,252,0.86)",
                      border: "1px solid rgba(226,232,240,0.85)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 8,
                      }}
                    >
                      <MapPin size={16} />
                      <h4
                        style={{
                          margin: 0,
                          fontSize: 15,
                          fontWeight: 800,
                        }}
                      >
                        Grand total
                      </h4>
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontFamily: "var(--font-heading), sans-serif",
                        fontSize: 22,
                        fontWeight: 800,
                        letterSpacing: "-0.03em",
                      }}
                    >
                      {formatCurrency(grandTotal)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="toolbar"
          style={{
            marginTop: 22,
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              color: "rgb(var(--muted))",
              fontSize: 14,
              lineHeight: 1.6,
            }}
          >
            This starter form is ready for wiring to the{" "}
            <strong>create-order</strong> Netlify function and reservation logic.
          </div>

          <div className="toolbar">
            <button
              type="button"
              className="button button-secondary"
              onClick={() => setValues(initialValues)}
              disabled={isSaving}
            >
              Reset
            </button>

            <button type="submit" className="button button-primary" disabled={isSaving}>
              <Save size={16} />
              {isSaving ? "Saving..." : "Save Order"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}