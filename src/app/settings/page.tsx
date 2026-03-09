import {
  Bell,
  Camera,
  Database,
  Globe2,
  ImageIcon,
  ScanLine,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import AppShell from "@/components/shared/AppShell";

const settingCards = [
  {
    title: "Scanner Settings",
    description:
      "Control how scan-to-product lookup behaves, including barcode strategy and fallback behavior.",
    icon: ScanLine,
    tone: "rgba(79,70,229,0.10)",
    values: [
      { label: "Primary scan mode", value: "Barcode = SKU" },
      { label: "Minimum scan length", value: "4 characters" },
      { label: "Timeout", value: "1500 ms" },
    ],
  },
  {
    title: "Image Upload Settings",
    description:
      "Manage limits and defaults for product image capture and storage behavior.",
    icon: Camera,
    tone: "rgba(14,165,233,0.10)",
    values: [
      { label: "Max upload count", value: "10 images" },
      { label: "Max file size", value: "10 MB" },
      { label: "Storage bucket", value: "product-images" },
    ],
  },
  {
    title: "Marketplace Defaults",
    description:
      "Set baseline options for local marketplace operations and listing workflow.",
    icon: Globe2,
    tone: "rgba(16,185,129,0.10)",
    values: [
      { label: "Default currency", value: "CAD" },
      { label: "Default locale", value: "en-CA" },
      { label: "Primary channels", value: "Facebook, Kijiji, Karrot" },
    ],
  },
];

const advancedAreas = [
  {
    title: "Database & Storage",
    text: "Review Supabase connection, storage bucket naming, and backup/export workflows.",
    icon: Database,
    tone: "rgba(79,70,229,0.10)",
  },
  {
    title: "Image Intake Rules",
    text: "Define photo standards, default image counts, and primary image behavior.",
    icon: ImageIcon,
    tone: "rgba(14,165,233,0.10)",
  },
  {
    title: "Notifications & Follow-up",
    text: "Later, this can control reminders for buyer follow-up and stale listings.",
    icon: Bell,
    tone: "rgba(245,158,11,0.12)",
  },
  {
    title: "Permissions & Security",
    text: "This area can later support roles, auth policies, and safer operational controls.",
    icon: ShieldCheck,
    tone: "rgba(16,185,129,0.10)",
  },
];

export default function SettingsPage() {
  return (
    <AppShell
      title="Settings"
      subtitle="Control the default behavior for scanning, image intake, storage, and marketplace workflow from one place."
      action={
        <button type="button" className="button button-primary">
          <SlidersHorizontal size={16} />
          Save Settings
        </button>
      }
    >
      <section className="grid-cards-3">
        {settingCards.map((card) => {
          const Icon = card.icon;

          return (
            <div key={card.title} className="card">
              <div className="card-content">
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 16,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: card.tone,
                    border: "1px solid rgba(226,232,240,0.9)",
                    marginBottom: 16,
                  }}
                >
                  <Icon size={24} />
                </div>

                <h2 className="card-title">{card.title}</h2>
                <p className="card-description" style={{ marginBottom: 16 }}>
                  {card.description}
                </p>

                <div className="grid-auto">
                  {card.values.map((item) => (
                    <div
                      key={item.label}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 12,
                        padding: "12px 0",
                        borderBottom: "1px solid rgba(var(--border), 0.72)",
                      }}
                    >
                      <span
                        style={{
                          color: "rgb(var(--muted))",
                          fontSize: 14,
                          fontWeight: 600,
                        }}
                      >
                        {item.label}
                      </span>
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 800,
                          color: "rgb(var(--foreground))",
                          textAlign: "right",
                        }}
                      >
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <section className="section">
        <div className="glass-panel">
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
                  Operational defaults
                </div>
                <h2
                  className="page-title"
                  style={{
                    fontSize: "clamp(1.35rem, 1.8vw, 2rem)",
                    marginBottom: 10,
                  }}
                >
                  Keep the system opinionated so day-to-day operations stay fast.
                </h2>
                <p className="page-subtitle" style={{ maxWidth: 760 }}>
                  The best settings for this app are the ones that reduce
                  decision fatigue. Strong defaults make intake, listing, and
                  order handling much more reliable when you are moving through a
                  lot of products quickly.
                </p>
              </div>

              <div className="toolbar">
                <span className="badge badge-success">Defaults matter</span>
                <span className="badge badge-neutral">Operator-friendly</span>
                <span className="badge badge-warning">Keep version 1 simple</span>
              </div>
            </div>

            <div className="grid-cards-3">
              <div className="card">
                <div className="card-content">
                  <p className="metric-label">Best scanner rule</p>
                  <h3
                    style={{
                      margin: 0,
                      fontFamily: "var(--font-heading), sans-serif",
                      fontSize: 22,
                      fontWeight: 800,
                      letterSpacing: "-0.04em",
                    }}
                  >
                    Barcode = SKU
                  </h3>
                  <p className="metric-helper">
                    Keeps scan matching reliable and removes unnecessary edge
                    cases in version 1.
                  </p>
                </div>
              </div>

              <div className="card">
                <div className="card-content">
                  <p className="metric-label">Best image rule</p>
                  <h3
                    style={{
                      margin: 0,
                      fontFamily: "var(--font-heading), sans-serif",
                      fontSize: 22,
                      fontWeight: 800,
                      letterSpacing: "-0.04em",
                    }}
                  >
                    3–5 photos
                  </h3>
                  <p className="metric-helper">
                    Enough for strong listings without slowing intake too much.
                  </p>
                </div>
              </div>

              <div className="card">
                <div className="card-content">
                  <p className="metric-label">Best inventory rule</p>
                  <h3
                    style={{
                      margin: 0,
                      fontFamily: "var(--font-heading), sans-serif",
                      fontSize: 22,
                      fontWeight: 800,
                      letterSpacing: "-0.04em",
                    }}
                  >
                    Reserve immediately
                  </h3>
                  <p className="metric-helper">
                    As soon as a buyer commits, reserved quantity should update.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Advanced areas</h2>
        <p className="section-subtitle">
          These settings can expand later as the system becomes more automated.
        </p>

        <div className="grid-cards-4">
          {advancedAreas.map((area) => {
            const Icon = area.icon;

            return (
              <div key={area.title} className="card">
                <div className="card-content">
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 16,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: area.tone,
                      border: "1px solid rgba(226,232,240,0.9)",
                      marginBottom: 16,
                    }}
                  >
                    <Icon size={22} />
                  </div>

                  <h3 className="card-title">{area.title}</h3>
                  <p className="card-description">{area.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </AppShell>
  );
}