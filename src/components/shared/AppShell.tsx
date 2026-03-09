import type { ReactNode } from "react";
import { Boxes, LayoutDashboard, PackageSearch, Settings } from "lucide-react";
import Link from "next/link";

type AppShellProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
};

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/imports", label: "Imports", icon: PackageSearch },
  { href: "/products", label: "Products", icon: Boxes },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function AppShell({
  children,
  title,
  subtitle,
  action,
}: AppShellProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "280px minmax(0, 1fr)",
        gap: 20,
        padding: 20,
      }}
    >
      <aside
        className="glass-panel"
        style={{
          padding: 18,
          position: "sticky",
          top: 20,
          height: "calc(100vh - 40px)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: 14,
            borderRadius: 20,
            background:
              "linear-gradient(135deg, rgba(79,70,229,0.16), rgba(14,165,233,0.10))",
            border: "1px solid rgba(226,232,240,0.9)",
            boxShadow: "var(--shadow-xs)",
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
              background: "rgba(255,255,255,0.8)",
              marginBottom: 14,
            }}
          >
            <Boxes size={26} />
          </div>

          <h2
            style={{
              margin: 0,
              fontFamily: "var(--font-heading), sans-serif",
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: "-0.04em",
            }}
          >
            Liquidation Hub
          </h2>

          <p
            style={{
              margin: "8px 0 0",
              color: "rgb(var(--muted))",
              fontSize: 14,
              lineHeight: 1.65,
            }}
          >
            Inventory, images, and orders organized around one SKU-driven
            workflow.
          </p>
        </div>

        <nav
          style={{
            display: "grid",
            gap: 10,
            marginTop: 22,
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  minHeight: 48,
                  padding: "0 14px",
                  borderRadius: 14,
                  border: "1px solid rgba(226,232,240,0.86)",
                  background: "rgba(255,255,255,0.72)",
                  boxShadow: "var(--shadow-xs)",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "rgb(var(--foreground))",
                  transition: "transform 160ms ease, box-shadow 160ms ease",
                }}
              >
                <span
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 12,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(79,70,229,0.08)",
                  }}
                >
                  <Icon size={17} />
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div
          className="card"
          style={{
            marginTop: "auto",
          }}
        >
          <div className="card-content">
            <p
              className="metric-label"
              style={{ marginBottom: 8 }}
            >
              Recommended flow
            </p>

            <h3
              style={{
                margin: 0,
                fontFamily: "var(--font-heading), sans-serif",
                fontSize: 18,
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
            >
              Import → Scan → Capture → List → Sell
            </h3>

            <p
              style={{
                margin: "10px 0 0",
                color: "rgb(var(--muted))",
                fontSize: 13,
                lineHeight: 1.65,
              }}
            >
              Keep everything anchored to the SKU so the catalog, photos, and
              order flow stay aligned.
            </p>
          </div>
        </div>
      </aside>

      <div
        style={{
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <header className="glass-panel" style={{ padding: 22 }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div>
              {title ? (
                <h1
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-heading), sans-serif",
                    fontSize: "clamp(1.6rem, 2vw, 2.3rem)",
                    lineHeight: 1.05,
                    fontWeight: 800,
                    letterSpacing: "-0.04em",
                  }}
                >
                  {title}
                </h1>
              ) : null}

              {subtitle ? (
                <p
                  style={{
                    margin: title ? "10px 0 0" : 0,
                    maxWidth: 760,
                    color: "rgb(var(--muted))",
                    fontSize: 14,
                    lineHeight: 1.7,
                  }}
                >
                  {subtitle}
                </p>
              ) : null}
            </div>

            {action ? <div className="toolbar">{action}</div> : null}
          </div>
        </header>

        <main style={{ minWidth: 0 }}>{children}</main>
      </div>
    </div>
  );
}