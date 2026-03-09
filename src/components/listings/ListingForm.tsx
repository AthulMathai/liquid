"use client";

import { useMemo, useState } from "react";
import {
  ExternalLink,
  Globe2,
  Save,
  Tag,
  TextCursorInput,
  Wallet,
} from "lucide-react";

type ListingFormValues = {
  itemId: string;
  sku: string;
  platform: string;
  listingTitle: string;
  listingPrice: string;
  qtyListed: string;
  listingUrl: string;
  externalListingId: string;
  listingStatus: string;
  listedAt: string;
  notes: string;
};

const initialValues: ListingFormValues = {
  itemId: "",
  sku: "",
  platform: "facebook",
  listingTitle: "",
  listingPrice: "",
  qtyListed: "1",
  listingUrl: "",
  externalListingId: "",
  listingStatus: "draft",
  listedAt: "",
  notes: "",
};

const platformOptions = [
  { value: "facebook", label: "Facebook Marketplace" },
  { value: "kijiji", label: "Kijiji" },
  { value: "karrot", label: "Karrot" },
  { value: "craigslist", label: "Craigslist" },
  { value: "shopify", label: "Shopify" },
  { value: "direct", label: "Direct Sale" },
];

const statusOptions = [
  { value: "draft", label: "Draft" },
  { value: "active", label: "Active" },
  { value: "pending_pickup", label: "Pending Pickup" },
  { value: "sold", label: "Sold" },
  { value: "expired", label: "Expired" },
  { value: "deleted", label: "Deleted" },
];

export default function ListingForm() {
  const [values, setValues] = useState<ListingFormValues>(initialValues);
  const [isSaving, setIsSaving] = useState(false);

  const selectedPlatformLabel = useMemo(() => {
    return (
      platformOptions.find((option) => option.value === values.platform)?.label ??
      "Unknown"
    );
  }, [values.platform]);

  const selectedStatusLabel = useMemo(() => {
    return (
      statusOptions.find((option) => option.value === values.listingStatus)
        ?.label ?? "Unknown"
    );
  }, [values.listingStatus]);

  function updateField<K extends keyof ListingFormValues>(
    key: K,
    value: ListingFormValues[K]
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
      "Listing form looks good. Next step: connect this form to the marketplace_listings table."
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
              Listing intake
            </div>
            <h2 className="section-title" style={{ margin: 0 }}>
              Create or track a marketplace listing
            </h2>
            <p className="section-subtitle" style={{ margin: "6px 0 0" }}>
              Save the platform, title, live price, URL, and status so every
              product listing is visible from one central system.
            </p>
          </div>

          <div className="toolbar">
            <span className="badge badge-success">{selectedPlatformLabel}</span>
            <span className="badge badge-warning">{selectedStatusLabel}</span>
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
                    Product link
                  </h3>
                  <p className="card-description" style={{ marginTop: 4 }}>
                    Tie this listing back to the correct product record.
                  </p>
                </div>
              </div>

              <div className="grid-auto">
                <div className="grid-cards-2">
                  <div className="field-group">
                    <label className="label" htmlFor="itemId">
                      Item ID
                    </label>
                    <input
                      id="itemId"
                      className="input"
                      value={values.itemId}
                      onChange={(e) => updateField("itemId", e.target.value)}
                      placeholder="UUID or internal item reference"
                    />
                  </div>

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

                <div className="field-group">
                  <label className="label" htmlFor="externalListingId">
                    External Listing ID
                  </label>
                  <input
                    id="externalListingId"
                    className="input"
                    value={values.externalListingId}
                    onChange={(e) =>
                      updateField("externalListingId", e.target.value)
                    }
                    placeholder="Marketplace-native listing ID"
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
                  <TextCursorInput size={18} />
                </div>
                <div>
                  <h3 className="card-title" style={{ margin: 0 }}>
                    Listing content
                  </h3>
                  <p className="card-description" style={{ marginTop: 4 }}>
                    Define what the customer sees on the marketplace.
                  </p>
                </div>
              </div>

              <div className="grid-auto">
                <div className="field-group">
                  <label className="label" htmlFor="listingTitle">
                    Listing Title
                  </label>
                  <input
                    id="listingTitle"
                    className="input"
                    value={values.listingTitle}
                    onChange={(e) => updateField("listingTitle", e.target.value)}
                    placeholder="Black toaster oven"
                  />
                </div>

                <div className="grid-cards-2">
                  <div className="field-group">
                    <label className="label" htmlFor="listingPrice">
                      Listing Price
                    </label>
                    <input
                      id="listingPrice"
                      className="input"
                      value={values.listingPrice}
                      onChange={(e) => updateField("listingPrice", e.target.value)}
                      placeholder="49.99"
                    />
                  </div>

                  <div className="field-group">
                    <label className="label" htmlFor="qtyListed">
                      Qty Listed
                    </label>
                    <input
                      id="qtyListed"
                      className="input"
                      value={values.qtyListed}
                      onChange={(e) => updateField("qtyListed", e.target.value)}
                      placeholder="1"
                    />
                  </div>
                </div>

                <div className="field-group">
                  <label className="label" htmlFor="listingUrl">
                    Listing URL
                  </label>
                  <input
                    id="listingUrl"
                    className="input"
                    value={values.listingUrl}
                    onChange={(e) => updateField("listingUrl", e.target.value)}
                    placeholder="https://..."
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
                  <Globe2 size={18} />
                </div>
                <div>
                  <h3 className="card-title" style={{ margin: 0 }}>
                    Listing lifecycle
                  </h3>
                  <p className="card-description" style={{ marginTop: 4 }}>
                    Track whether the listing is draft, live, pending, or sold.
                  </p>
                </div>
              </div>

              <div className="grid-auto">
                <div className="grid-cards-2">
                  <div className="field-group">
                    <label className="label" htmlFor="listingStatus">
                      Listing Status
                    </label>
                    <select
                      id="listingStatus"
                      className="select"
                      value={values.listingStatus}
                      onChange={(e) => updateField("listingStatus", e.target.value)}
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="field-group">
                    <label className="label" htmlFor="listedAt">
                      Listed At
                    </label>
                    <input
                      id="listedAt"
                      type="datetime-local"
                      className="input"
                      value={values.listedAt}
                      onChange={(e) => updateField("listedAt", e.target.value)}
                    />
                  </div>
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
                    placeholder="Posted manually on Facebook Marketplace. Need to copy to Kijiji later."
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
                    background: "rgba(16,185,129,0.10)",
                  }}
                >
                  <Wallet size={18} />
                </div>
                <div>
                  <h3 className="card-title" style={{ margin: 0 }}>
                    Posting guidance
                  </h3>
                  <p className="card-description" style={{ marginTop: 4 }}>
                    Keep your listing records current so inventory and sales stay aligned.
                  </p>
                </div>
              </div>

              <div className="grid-auto">
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
                    Build the product record first, capture images, then post to
                    the marketplace and save the URL here. Once the item is sold,
                    update the listing state immediately.
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
                  <h4
                    style={{
                      margin: "0 0 8px",
                      fontSize: 15,
                      fontWeight: 800,
                    }}
                  >
                    Version 1 reminder
                  </h4>
                  <p
                    style={{
                      margin: 0,
                      color: "rgb(var(--muted))",
                      fontSize: 14,
                      lineHeight: 1.7,
                    }}
                  >
                    Posting can stay manual for now. The important part is
                    keeping the platform, price, URL, and status visible in the hub.
                  </p>
                </div>

                {values.listingUrl.trim() ? (
                  <a
                    href={values.listingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="button button-secondary"
                    style={{ width: "fit-content" }}
                  >
                    <ExternalLink size={16} />
                    Open Listing URL
                  </a>
                ) : null}

                <div className="toolbar">
                  <span className="badge badge-success">Cross-post ready</span>
                  <span className="badge badge-warning">Manual sync for now</span>
                  <span className="badge badge-neutral">URL tracked</span>
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
            <strong>marketplace_listings</strong> table.
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
              {isSaving ? "Saving..." : "Save Listing"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}