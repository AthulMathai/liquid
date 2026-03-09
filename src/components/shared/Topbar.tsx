"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Boxes,
  Command,
  LayoutDashboard,
  ScanLine,
  Search,
  Settings,
  ShoppingCart,
  Sparkles,
} from "lucide-react";

const quickLinks = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Scan",
    href: "/scan",
    icon: ScanLine,
  },
  {
    label: "Products",
    href: "/products",
    icon: Boxes,
  },
  {
    label: "Orders",
    href: "/orders",
    icon: ShoppingCart,
  },
];

function getPageLabel(pathname: string) {
  if (pathname.startsWith("/dashboard")) return "Dashboard";
  if (pathname.startsWith("/imports")) return "Imports";
  if (pathname.startsWith("/scan")) return "Scan";
  if (pathname.startsWith("/products")) return "Products";
  if (pathname.startsWith("/orders")) return "Orders";
  if (pathname.startsWith("/listings")) return "Listings";
  if (pathname.startsWith("/inquiries")) return "Inquiries";
  if (pathname.startsWith("/settings")) return "Settings";
  return "Workspace";
}

export default function Topbar() {
  const pathname = usePathname();
  const pageLabel = getPageLabel(pathname);

  return (
    <header
      className="glass-panel"
      style={{
        position: "sticky",
        top: 16,
        zIndex: 30,
      }}
    >
      <div className="card-content">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div
              className="toolbar"
              style={{ marginBottom: 10, alignItems: "center", gap: 10 }}
            >
              <span className="badge badge-neutral">Liquidation Hub</span>
              <span className="badge badge-success">{pageLabel}</span>
            </div>

            <h1
              style={{
                margin: 0,
                fontFamily: "var(--font-heading), sans-serif",
                fontSize: "clamp(1.2rem, 1.5vw, 1.6rem)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                color: "rgb(var(--foreground))",
              }}
            >
              Fast control for inventory, listings, orders, and sell-through.
            </h1>

            <p
              style={{
                margin: "6px 0 0",
                color: "rgb(var(--muted))",
                fontSize: 14,
                lineHeight: 1.65,
                maxWidth: 760,
              }}
            >
              Keep everything SKU-centered so scanning, photo intake, pricing,
              and fulfillment all stay connected.
            </p>
          </div>

          <div className="toolbar" style={{ flexWrap: "wrap" }}>
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
                  pointerEvents: "none",
                }}
              />
              <input
                className="input"
                placeholder="Search SKU, buyer, order..."
                style={{
                  paddingLeft: 40,
                  minWidth: 260,
                }}
              />
            </div>

            <button type="button" className="button button-secondary">
              <Bell size={16} />
              Alerts
            </button>

            <Link href="/settings" className="button button-ghost">
              <Settings size={16} />
              Settings
            </Link>
          </div>
        </div>

        <div
          style={{
            marginTop: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div className="toolbar" style={{ flexWrap: "wrap" }}>
            {quickLinks.map((item) => {
              const Icon = item.icon;
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={active ? "button button-primary" : "button button-secondary"}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="toolbar" style={{ flexWrap: "wrap" }}>
            <span className="badge badge-success">
              <Sparkles size={12} />
              SKU-first workflow
            </span>
            <span className="badge badge-warning">
              <Command size={12} />
              Scan → Capture → List
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}