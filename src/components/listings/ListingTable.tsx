"use client";

import Link from "next/link";
import { ExternalLink, Globe2, Search, Tag } from "lucide-react";

export type ListingTableRow = {
  id: string;
  item_id: string;
  platform: string;
  sku?: string | null;
  listing_title: string | null;
  listing_price: number;
  listing_url: string | null;
  qty_listed: number;
  listing_status: string;
  listed_at: string | null;
};

type ListingTableProps = {
  listings?: ListingTableRow[];
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

function formatDate(value: string | null) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-CA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatStatusLabel(status: string) {
  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getStatusClass(status: string) {
  switch (status) {
    case "active":
      return "badge badge-success";
    case "pending_pickup":
      return "badge badge-warning";
    case "sold":
      return "badge badge-success";
    case "expired":
      return "badge badge-danger";
    case "deleted":
      return "badge badge-danger";
    case "draft":
    default:
      return "badge badge-neutral";
  }
}

function formatPlatform(platform: string) {
  const map: Record<string, string> = {
    facebook: "Facebook Marketplace",
    kijiji: "Kijiji",
    karrot: "Karrot",
    craigslist: "Craigslist",
    shopify: "Shopify",
    direct: "Direct Sale",
  };

  return map[platform] ?? platform;
}

export default function ListingTable({
  listings = [],
  title = "Listing Table",
  subtitle = "Review marketplace visibility, price, and listing status in one place.",
}: ListingTableProps) {
  const hasRows = listings.length > 0;

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
                placeholder="Search listings..."
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
              <Globe2 size={30} />
            </div>
            <h3 className="empty-state-title">No listings yet</h3>
            <p className="empty-state-text">
              Once products are posted to marketplaces, their platform, price,
              URL, and status will appear here.
            </p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Platform</th>
                  <th>SKU</th>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Qty Listed</th>
                  <th>Status</th>
                  <th>Listed At</th>
                  <th>URL</th>
                  <th>Open</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((listing) => (
                  <tr key={listing.id}>
                    <td>{formatPlatform(listing.platform)}</td>
                    <td
                      style={{
                        fontWeight: 800,
                        fontFamily: "var(--font-heading), sans-serif",
                      }}
                    >
                      {listing.sku || "—"}
                    </td>
                    <td style={{ minWidth: 240 }}>
                      {listing.listing_title || "—"}
                    </td>
                    <td>{formatCurrency(listing.listing_price)}</td>
                    <td>{listing.qty_listed}</td>
                    <td>
                      <span className={getStatusClass(listing.listing_status)}>
                        {formatStatusLabel(listing.listing_status)}
                      </span>
                    </td>
                    <td>{formatDate(listing.listed_at)}</td>
                    <td>
                      {listing.listing_url ? (
                        <a
                          href={listing.listing_url}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            fontSize: 14,
                            fontWeight: 700,
                            color: "rgb(var(--primary))",
                          }}
                        >
                          Visit
                          <ExternalLink size={14} />
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      <Link
                        href={`/products/${listing.sku ?? listing.item_id}`}
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
                        <Tag size={14} />
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
              <span className="badge badge-success">Listing rows loaded</span>
              <span className="badge badge-neutral">Status visible</span>
              <span className="badge badge-warning">URL tracking enabled</span>
            </div>

            <div
              style={{
                color: "rgb(var(--muted))",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              {listings.length} listing{listings.length === 1 ? "" : "s"}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}