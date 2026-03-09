"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Boxes,
  ChevronRight,
  Globe2,
  LayoutDashboard,
  MessageSquareMore,
  PackageSearch,
  ScanLine,
  Settings,
  ShoppingCart,
  Upload,
} from "lucide-react";

const navigation = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    match: ["/dashboard"],
  },
  {
    label: "Imports",
    href: "/imports",
    icon: Upload,
    match: ["/imports"],
  },
  {
    label: "Scan",
    href: "/scan",
    icon: ScanLine,
    match: ["/scan"],
  },
  {
    label: "Products",
    href: "/products",
    icon: Boxes,
    match: ["/products"],
  },
  {
    label: "Orders",
    href: "/orders",
    icon: ShoppingCart,
    match: ["/orders"],
  },
  {
    label: "Listings",
    href: "/listings",
    icon: Globe2,
    match: ["/listings"],
  },
  {
    label: "Inquiries",
    href: "/inquiries",
    icon: MessageSquareMore,
    match: ["/inquiries"],
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    match: ["/settings"],
  },
];

function isActivePath(pathname: string, matchers: string[]) {
  return matchers.some((matcher) => {
    if (matcher === "/") return pathname === "/";
    return pathname === matcher || pathname.startsWith(`${matcher}/`);
  });
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        position: "sticky",
        top: 16,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div className="glass-panel">
        <div className="card-content">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 18,
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 18,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  "linear-gradient(135deg, rgba(79,70,229,0.16), rgba(14,165,233,0.14))",
                border: "1px solid rgba(226,232,240,0.9)",
                boxShadow: "var(--shadow-sm)",
                flexShrink: 0,
              }}
            >
              <PackageSearch size={24} />
            </div>

            <div style={{ minWidth: 0 }}>
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgb(var(--muted))",
                }}
              >
                Liquidation Hub
              </p>
              <h2
                style={{
                  margin: "4px 0 0",
                  fontFamily: "var(--font-heading), sans-serif",
                  fontSize: 20,
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  color: "rgb(var(--foreground))",
                }}
              >
                Ops Control
              </h2>
            </div>
          </div>

          <div
            style={{
              padding: 14,
              borderRadius: 18,
              background: "rgba(248,250,252,0.82)",
              border: "1px solid rgba(226,232,240,0.86)",
              marginBottom: 18,
            }}
          >
            <p
              style={{
                margin: 0,
                color: "rgb(var(--muted))",
                fontSize: 13,
                lineHeight: 1.7,
              }}
            >
              Run your entire liquidation workflow from one place: import stock,
              scan items, capture images, manage listings, and close orders fast.
            </p>
          </div>

          <nav
            aria-label="Sidebar navigation"
            style={{
              display: "grid",
              gap: 8,
            }}
          >
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActivePath(pathname, item.match);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    minHeight: 52,
                    padding: "0 14px",
                    borderRadius: 16,
                    textDecoration: "none",
                    color: active
                      ? "rgb(var(--foreground))"
                      : "rgb(var(--muted))",
                    background: active
                      ? "linear-gradient(135deg, rgba(79,70,229,0.10), rgba(14,165,233,0.08))"
                      : "transparent",
                    border: active
                      ? "1px solid rgba(79,70,229,0.18)"
                      : "1px solid transparent",
                    boxShadow: active ? "var(--shadow-xs)" : "none",
                    transition: "all 160ms ease",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      minWidth: 0,
                    }}
                  >
                    <span
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 12,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: active
                          ? "rgba(79,70,229,0.12)"
                          : "rgba(148,163,184,0.08)",
                        border: "1px solid rgba(226,232,240,0.86)",
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={18} />
                    </span>

                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: active ? 800 : 700,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.label}
                    </span>
                  </span>

                  <ChevronRight
                    size={16}
                    style={{
                      opacity: active ? 1 : 0.45,
                      flexShrink: 0,
                    }}
                  />
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="card" style={{ background: "rgba(255,255,255,0.64)" }}>
        <div className="card-content">
          <p className="metric-label">Best workflow</p>
          <h3
            style={{
              margin: 0,
              fontFamily: "var(--font-heading), sans-serif",
              fontSize: 20,
              fontWeight: 800,
              letterSpacing: "-0.04em",
            }}
          >
            Scan → Capture → List
          </h3>
          <p className="metric-helper">
            Build around SKU-first intake and everything stays faster and cleaner.
          </p>
        </div>
      </div>
    </aside>
  );
}