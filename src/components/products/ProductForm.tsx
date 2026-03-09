"use client";

import { useMemo, useState } from "react";
import {
  Boxes,
  DollarSign,
  Package2,
  Save,
  ScanLine,
  Sparkles,
  Tag,
  TextCursorInput,
} from "lucide-react";

type ProductFormValues = {
  sku: string;
  barcodeValue: string;
  itemNumber: string;
  title: string;
  description: string;
  category: string;
  brand: string;
  model: string;
  condition: string;
  cost: string;
  listedPrice: string;
  minAcceptablePrice: string;
  onHandQty: string;
  reservedQty: string;
  status: string;
  notes: string;
};

const initialValues: ProductFormValues = {
  sku: "",
  barcodeValue: "",
  itemNumber: "",
  title: "",
  description: "",
  category: "",
  brand: "",
  model: "",
  condition: "good",
  cost: "0",
  listedPrice: "",
  minAcceptablePrice: "",
  onHandQty: "1",
  reservedQty: "0",
  status: "draft",
  notes: "",
};

const conditionOptions = [
  { value: "new", label: "New" },
  { value: "like_new", label: "Like New" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "used", label: "Used" },
  { value: "open_box", label: "Open Box" },
];

const statusOptions = [
  { value: "draft", label: "Draft" },
  { value: "ready", label: "Ready" },
  { value: "listed", label: "Listed" },
  { value: "partial_sold", label: "Partial Sold" },
  { value: "sold_out", label: "Sold Out" },
  { value: "hold", label: "Hold" },
  { value: "removed", label: "Removed" },
];

function parseMoney(value: string) {
  const parsed = Number(value.replace(/[$,]/g, "").trim() || 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseQty(value: string) {
  const parsed = Math.floor(Number(value || 0));
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function titleCase(value: string) {
  return value
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function ProductForm() {
  const [values, setValues] = useState<ProductFormValues>(initialValues);
  const [isSaving, setIsSaving] = useState(false);

  const listedPriceValue = useMemo(
    () => parseMoney(values.listedPrice),
    [values.listedPrice]
  );
  const minAcceptablePriceValue = useMemo(
    () => parseMoney(values.minAcceptablePrice),
    [values.minAcceptablePrice]
  );
  const costValue = useMemo(() => parseMoney(values.cost), [values.cost]);
  const onHandQtyValue = useMemo(() => parseQty(values.onHandQty), [values.onHandQty]);
  const reservedQtyValue = useMemo(
    () => parseQty(values.reservedQty),
    [values.reservedQty]
  );
  const availableQtyValue = useMemo(
    () => Math.max(onHandQtyValue - reservedQtyValue, 0),
    [onHandQtyValue, reservedQtyValue]
  );

  const selectedStatusLabel = useMemo(() => {
    return (
      statusOptions.find((option) => option.value === values.status)?.label ??
      "Unknown"
    );
  }, [values.status]);

  const selectedConditionLabel = useMemo(() => {
    return (
      conditionOptions.find((option) => option.value === values.condition)
        ?.label ?? "Unknown"
    );
  }, [values.condition]);

  const marginValue = useMemo(() => {
    return listedPriceValue - costValue;
  }, [listedPriceValue, costValue]);

  function updateField<K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K]
  ) {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function fillBarcodeFromSku() {
    if (!values.sku.trim()) return;

    updateField("barcodeValue", values.sku.trim().toUpperCase());
  }

  function fillTitleFromDescription() {
    if (!values.description.trim()) return;

    updateField("title", titleCase(values.description));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);

    await new Promise((resolve) => setTimeout(resolve, 900));

    setIsSaving(false);
    window.alert(
      "Product form looks great. Next step: connect this form to the items table or a Netlify create-product flow."
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
              Product record builder
            </div>
            <h2 className="section-title" style={{ margin: 0 }}>
              Create a clean product record
            </h2>
            <p className="section-subtitle" style={{ margin: "6px 0 0" }}>
              Build the SKU, pricing, quantity, and description foundation that
              supports scanning, image capture, listings, and orders.
            </p>
          </div>

          <div className="toolbar">
            <span className="badge badge-success">{selectedConditionLabel}</span>
            <span className="badge badge-warning">{selectedStatusLabel}</span>
            <span className="badge badge-neutral">
              Available {availableQtyValue}
            </span>
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
                  <Tag size={18} />
                </div>
                <div>
                  <h3 className="card-title" style={{ margin: 0 }}>
                    Product identity
                  </h3>
                  <p className="card-description" style={{ marginTop: 4 }}>
                    Define the core identifiers used everywhere in the system.
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
                      onChange={(e) => updateField("sku", e.target.value.toUpperCase())}
                      placeholder="SKU1001"
                    />
                  </div>

                  <div className="field-group">
                    <label className="label" htmlFor="itemNumber">
                      Item Number
                    </label>
                    <input
                      id="itemNumber"
                      className="input"
                      value={values.itemNumber}
                      onChange={(e) => updateField("itemNumber", e.target.value)}
                      placeholder="Legacy or vendor code"
                    />
                  </div>
                </div>

                <div className="field-group">
                  <label className="label" htmlFor="barcodeValue">
                    Barcode Value
                  </label>
                  <div className="toolbar" style={{ alignItems: "stretch" }}>
                    <input
                      id="barcodeValue"
                      className="input"
                      value={values.barcodeValue}
                      onChange={(e) =>
                        updateField("barcodeValue", e.target.value.toUpperCase())
                      }
                      placeholder="Use same as SKU for version 1"
                    />
                    <button
                      type="button"
                      className="button button-secondary"
                      onClick={fillBarcodeFromSku}
                    >
                      <ScanLine size={16} />
                      Copy SKU
                    </button>
                  </div>
                </div>

                <div className="grid-cards-2">
                  <div className="field-group">
                    <label className="label" htmlFor="category">
                      Category
                    </label>
                    <input
                      id="category"
                      className="input"
                      value={values.category}
                      onChange={(e) => updateField("category", e.target.value)}
                      placeholder="Small appliance"
                    />
                  </div>

                  <div className="field-group">
                    <label className="label" htmlFor="brand">
                      Brand
                    </label>
                    <input
                      id="brand"
                      className="input"
                      value={values.brand}
                      onChange={(e) => updateField("brand", e.target.value)}
                      placeholder="Hamilton Beach"
                    />
                  </div>
                </div>

                <div className="grid-cards-2">
                  <div className="field-group">
                    <label className="label" htmlFor="model">
                      Model
                    </label>
                    <input
                      id="model"
                      className="input"
                      value={values.model}
                      onChange={(e) => updateField("model", e.target.value)}
                      placeholder="Model number"
                    />
                  </div>

                  <div className="field-group">
                    <label className="label" htmlFor="condition">
                      Condition
                    </label>
                    <select
                      id="condition"
                      className="select"
                      value={values.condition}
                      onChange={(e) => updateField("condition", e.target.value)}
                    >
                      {conditionOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
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
                    background: "rgba(14,165,233,0.10)",
                  }}
                >
                  <TextCursorInput size={18} />
                </div>
                <div>
                  <h3 className="card-title" style={{ margin: 0 }}>
                    Product content
                  </h3>
                  <p className="card-description" style={{ marginTop: 4 }}>
                    Create listing-friendly title and description text.
                  </p>
                </div>
              </div>

              <div className="grid-auto">
                <div className="field-group">
                  <label className="label" htmlFor="title">
                    Title
                  </label>
                  <div className="toolbar" style={{ alignItems: "stretch" }}>
                    <input
                      id="title"
                      className="input"
                      value={values.title}
                      onChange={(e) => updateField("title", e.target.value)}
                      placeholder="Black toaster oven"
                    />
                    <button
                      type="button"
                      className="button button-secondary"
                      onClick={fillTitleFromDescription}
                    >
                      <Sparkles size={16} />
                      Generate
                    </button>
                  </div>
                </div>

                <div className="field-group">
                  <label className="label" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    id="description"
                    className="textarea"
                    value={values.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    placeholder="Compact black toaster oven with multi-function heating controls..."
                  />
                </div>

                <div className="field-group">
                  <label className="label" htmlFor="notes">
                    Internal Notes
                  </label>
                  <textarea
                    id="notes"
                    className="textarea"
                    value={values.notes}
                    onChange={(e) => updateField("notes", e.target.value)}
                    placeholder="Minor scratch on side panel. Test before listing."
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
                  <DollarSign size={18} />
                </div>
                <div>
                  <h3 className="card-title" style={{ margin: 0 }}>
                    Pricing
                  </h3>
                  <p className="card-description" style={{ marginTop: 4 }}>
                    Set cost, ask price, and your minimum acceptable number.
                  </p>
                </div>
              </div>

              <div className="grid-auto">
                <div className="grid-cards-3">
                  <div className="field-group">
                    <label className="label" htmlFor="cost">
                      Cost
                    </label>
                    <input
                      id="cost"
                      className="input"
                      value={values.cost}
                      onChange={(e) => updateField("cost", e.target.value)}
                      placeholder="0.00"
                    />
                  </div>

                  <div className="field-group">
                    <label className="label" htmlFor="listedPrice">
                      Listed Price
                    </label>
                    <input
                      id="listedPrice"
                      className="input"
                      value={values.listedPrice}
                      onChange={(e) => updateField("listedPrice", e.target.value)}
                      placeholder="49.99"
                    />
                  </div>

                  <div className="field-group">
                    <label className="label" htmlFor="minAcceptablePrice">
                      Min Acceptable Price
                    </label>
                    <input
                      id="minAcceptablePrice"
                      className="input"
                      value={values.minAcceptablePrice}
                      onChange={(e) =>
                        updateField("minAcceptablePrice", e.target.value)
                      }
                      placeholder="30.00"
                    />
                  </div>
                </div>

                <div className="grid-cards-3">
                  <div className="metric-card">
                    <p className="metric-label">Listed Price</p>
                    <h3 className="metric-value">
                      {formatCurrency(listedPriceValue)}
                    </h3>
                    <p className="metric-helper">Primary marketplace ask.</p>
                  </div>

                  <div className="metric-card">
                    <p className="metric-label">Minimum Price</p>
                    <h3 className="metric-value">
                      {formatCurrency(minAcceptablePriceValue)}
                    </h3>
                    <p className="metric-helper">Negotiation floor.</p>
                  </div>

                  <div className="metric-card">
                    <p className="metric-label">Gross Margin</p>
                    <h3 className="metric-value">
                      {formatCurrency(marginValue)}
                    </h3>
                    <p className="metric-helper">
                      Listed price minus acquisition cost.
                    </p>
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
                  <Package2 size={18} />
                </div>
                <div>
                  <h3 className="card-title" style={{ margin: 0 }}>
                    Inventory & status
                  </h3>
                  <p className="card-description" style={{ marginTop: 4 }}>
                    Control stock levels and current lifecycle stage.
                  </p>
                </div>
              </div>

              <div className="grid-auto">
                <div className="grid-cards-3">
                  <div className="field-group">
                    <label className="label" htmlFor="onHandQty">
                      On Hand Qty
                    </label>
                    <input
                      id="onHandQty"
                      className="input"
                      value={values.onHandQty}
                      onChange={(e) => updateField("onHandQty", e.target.value)}
                      placeholder="1"
                    />
                  </div>

                  <div className="field-group">
                    <label className="label" htmlFor="reservedQty">
                      Reserved Qty
                    </label>
                    <input
                      id="reservedQty"
                      className="input"
                      value={values.reservedQty}
                      onChange={(e) => updateField("reservedQty", e.target.value)}
                      placeholder="0"
                    />
                  </div>

                  <div className="field-group">
                    <label className="label" htmlFor="status">
                      Status
                    </label>
                    <select
                      id="status"
                      className="select"
                      value={values.status}
                      onChange={(e) => updateField("status", e.target.value)}
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid-cards-3">
                  <div className="metric-card">
                    <p className="metric-label">On Hand</p>
                    <h3 className="metric-value">{onHandQtyValue}</h3>
                    <p className="metric-helper">Physical units in stock.</p>
                  </div>

                  <div className="metric-card">
                    <p className="metric-label">Reserved</p>
                    <h3 className="metric-value">{reservedQtyValue}</h3>
                    <p className="metric-helper">Committed but not completed.</p>
                  </div>

                  <div className="metric-card">
                    <p className="metric-label">Available</p>
                    <h3 className="metric-value">{availableQtyValue}</h3>
                    <p className="metric-helper">
                      On hand minus reserved quantity.
                    </p>
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
                  <h4
                    style={{
                      margin: "0 0 8px",
                      fontSize: 15,
                      fontWeight: 800,
                    }}
                  >
                    Recommended workflow
                  </h4>
                  <p
                    style={{
                      margin: 0,
                      color: "rgb(var(--muted))",
                      fontSize: 14,
                      lineHeight: 1.7,
                    }}
                  >
                    Create the product, scan it, capture images, then move it into
                    listing status once the record is visually complete and priced.
                  </p>
                </div>

                <div className="toolbar">
                  <span className="badge badge-success">SKU-centered</span>
                  <span className="badge badge-warning">Scan compatible</span>
                  <span className="badge badge-neutral">Listing ready next</span>
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
            This starter form is ready for Supabase wiring to the{" "}
            <strong>items</strong> table.
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
              {isSaving ? "Saving..." : "Save Product"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}