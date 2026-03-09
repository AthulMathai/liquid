"use client";

import Link from "next/link";
import { ExternalLink, MessageSquareMore, Search, UserRound } from "lucide-react";

export type InquiryTableRow = {
  id: string;
  buyer_name: string | null;
  platform: string | null;
  sku?: string | null;
  item_title?: string | null;
  message_summary: string | null;
  offered_price: number | null;
  inquiry_status: string;
  follow_up_date: string | null;
};

type InquiryTableProps = {
  inquiries?: InquiryTableRow[];
  title?: string;
  subtitle?: string;
};

function formatCurrency(value: number | null) {
  if (value === null || value === undefined) return "—";

  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(value: string | null) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-CA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getStatusClass(status: string) {
  switch (status) {
    case "converted":
      return "badge badge-success";
    case "scheduled_pickup":
      return "badge badge-success";
    case "negotiating":
      return "badge badge-warning";
    case "ghosted":
      return "badge badge-danger";
    case "closed_lost":
      return "badge badge-danger";
    case "replied":
      return "badge badge-neutral";
    case "new":
    default:
      return "badge badge-neutral";
  }
}

function formatStatusLabel(status: string) {
  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function InquiryTable({
  inquiries = [],
  title = "Inquiry Table",
  subtitle = "Review buyers, offers, and follow-up status in one place.",
}: InquiryTableProps) {
  const hasRows = inquiries.length > 0;

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
                placeholder="Search inquiries..."
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
              <MessageSquareMore size={30} />
            </div>
            <h3 className="empty-state-title">No inquiries yet</h3>
            <p className="empty-state-text">
              As soon as buyer conversations are logged, they will appear here with
              offer and follow-up visibility.
            </p>
          </div>
        ) : (
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
                  <th>Open</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inquiry) => (
                  <tr key={inquiry.id}>
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
                        <span style={{ fontWeight: 700 }}>
                          {inquiry.buyer_name || "Unknown Buyer"}
                        </span>
                      </div>
                    </td>
                    <td>{inquiry.platform || "—"}</td>
                    <td
                      style={{
                        fontWeight: 800,
                        fontFamily: "var(--font-heading), sans-serif",
                      }}
                    >
                      {inquiry.sku || "—"}
                    </td>
                    <td style={{ minWidth: 180 }}>{inquiry.item_title || "—"}</td>
                    <td style={{ minWidth: 260 }}>
                      {inquiry.message_summary || "—"}
                    </td>
                    <td>{formatCurrency(inquiry.offered_price)}</td>
                    <td>
                      <span className={getStatusClass(inquiry.inquiry_status)}>
                        {formatStatusLabel(inquiry.inquiry_status)}
                      </span>
                    </td>
                    <td>{formatDate(inquiry.follow_up_date)}</td>
                    <td>
                      <Link
                        href={`/inquiries#${inquiry.id}`}
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
                ))}
              </tbody>
            </table>
          </div>
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
              <span className="badge badge-success">Inquiry rows loaded</span>
              <span className="badge badge-warning">Offer tracking visible</span>
              <span className="badge badge-neutral">Follow-up dates shown</span>
            </div>

            <div
              style={{
                color: "rgb(var(--muted))",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              {inquiries.length} inquiry{inquiries.length === 1 ? "" : "ies"}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}