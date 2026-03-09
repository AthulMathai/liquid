"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  MessageSquareMore,
  Save,
  Tag,
  UserRound,
} from "lucide-react";

type InquiryFormValues = {
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  platform: string;
  sku: string;
  messageSummary: string;
  offeredPrice: string;
  inquiryStatus: string;
  followUpDate: string;
  notes: string;
};

const initialValues: InquiryFormValues = {
  buyerName: "",
  buyerEmail: "",
  buyerPhone: "",
  platform: "facebook",
  sku: "",
  messageSummary: "",
  offeredPrice: "",
  inquiryStatus: "new",
  followUpDate: "",
  notes: "",
};

const platformOptions = [
  { value: "facebook", label: "Facebook Marketplace" },
  { value: "kijiji", label: "Kijiji" },
  { value: "karrot", label: "Karrot" },
  { value: "craigslist", label: "Craigslist" },
  { value: "direct", label: "Direct Sale" },
];

const statusOptions = [
  { value: "new", label: "New" },
  { value: "replied", label: "Replied" },
  { value: "negotiating", label: "Negotiating" },
  { value: "scheduled_pickup", label: "Scheduled Pickup" },
  { value: "ghosted", label: "Ghosted" },
  { value: "converted", label: "Converted" },
  { value: "closed_lost", label: "Closed Lost" },
];

export default function InquiryForm() {
  const [values, setValues] = useState<InquiryFormValues>(initialValues);
  const [isSaving, setIsSaving] = useState(false);

  const selectedPlatformLabel = useMemo(() => {
    return (
      platformOptions.find((option) => option.value === values.platform)?.label ??
      "Unknown"
    );
  }, [values.platform]);

  const selectedStatusLabel = useMemo(() => {
    return (
      statusOptions.find((option) => option.value === values.inquiryStatus)
        ?.label ?? "Unknown"
    );
  }, [values.inquiryStatus]);

  function updateField<K extends keyof InquiryFormValues>(
    key: K,
    value: InquiryFormValues[K]
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
      "Inquiry form looks good. Next step: connect this form to the inquiries table."
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
              Inquiry intake
            </div>
            <h2 className="section-title" style={{ margin: 0 }}>
              Log a buyer inquiry
            </h2>
            <p className="section-subtitle" style={{ margin: "6px 0 0" }}>
              Capture the buyer, product, offer, and next action so follow-ups
              stay organized and easy to convert into orders.
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
                  <UserRound size={18} />
                </div>
                <div>
                  <h3 className="card-title" style={{ margin: 0 }}>
                    Buyer details
                  </h3>
                  <p className="card-description" style={{ marginTop: 4 }}>
                    Basic contact information for the inquiry.
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
                      placeholder="buyer@example.com"
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
                  <Tag size={18} />
                </div>
                <div>
                  <h3 className="card-title" style={{ margin: 0 }}>
                    Inquiry context
                  </h3>
                  <p className="card-description" style={{ marginTop: 4 }}>
                    Identify the platform, product, and buyer intent.
                  </p>
                </div>
              </div>

              <div className="grid-auto">
                <div className="grid-cards-2">
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
                  <label className="label" htmlFor="messageSummary">
                    Message Summary
                  </label>
                  <textarea
                    id="messageSummary"
                    className="textarea"
                    value={values.messageSummary}
                    onChange={(e) =>
                      updateField("messageSummary", e.target.value)
                    }
                    placeholder="Buyer asked if the item is still available and offered $40."
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
                  <MessageSquareMore size={18} />
                </div>
                <div>
                  <h3 className="card-title" style={{ margin: 0 }}>
                    Offer & status
                  </h3>
                  <p className="card-description" style={{ marginTop: 4 }}>
                    Track negotiation state and proposed price.
                  </p>
                </div>
              </div>

              <div className="grid-auto">
                <div className="grid-cards-2">
                  <div className="field-group">
                    <label className="label" htmlFor="offeredPrice">
                      Offered Price
                    </label>
                    <input
                      id="offeredPrice"
                      className="input"
                      value={values.offeredPrice}
                      onChange={(e) =>
                        updateField("offeredPrice", e.target.value)
                      }
                      placeholder="40.00"
                    />
                  </div>

                  <div className="field-group">
                    <label className="label" htmlFor="inquiryStatus">
                      Inquiry Status
                    </label>
                    <select
                      id="inquiryStatus"
                      className="select"
                      value={values.inquiryStatus}
                      onChange={(e) =>
                        updateField("inquiryStatus", e.target.value)
                      }
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
                    Internal Notes
                  </label>
                  <textarea
                    id="notes"
                    className="textarea"
                    value={values.notes}
                    onChange={(e) => updateField("notes", e.target.value)}
                    placeholder="Buyer seems motivated. Mention bundle discount if they ask about other items."
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
                  <CalendarDays size={18} />
                </div>
                <div>
                  <h3 className="card-title" style={{ margin: 0 }}>
                    Follow-up planning
                  </h3>
                  <p className="card-description" style={{ marginTop: 4 }}>
                    Keep a clear next step so no strong lead gets lost.
                  </p>
                </div>
              </div>

              <div className="grid-auto">
                <div className="field-group">
                  <label className="label" htmlFor="followUpDate">
                    Follow-Up Date
                  </label>
                  <input
                    id="followUpDate"
                    type="datetime-local"
                    className="input"
                    value={values.followUpDate}
                    onChange={(e) =>
                      updateField("followUpDate", e.target.value)
                    }
                  />
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
                    Log the inquiry, reply on the marketplace, track the offer,
                    then convert it into an order and reserve inventory as soon
                    as the buyer commits.
                  </p>
                </div>

                <div className="toolbar">
                  <span className="badge badge-success">Buyer tracked</span>
                  <span className="badge badge-warning">Offer visible</span>
                  <span className="badge badge-neutral">Follow-up ready</span>
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
            <strong>inquiries</strong> table.
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
              {isSaving ? "Saving..." : "Save Inquiry"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}