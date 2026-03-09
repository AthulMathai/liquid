import type { ReactNode } from "react";

type StatCardProps = {
  label: string;
  value: string | number;
  helper?: string;
  icon?: ReactNode;
  tone?: string;
};

export default function StatCard({
  label,
  value,
  helper,
  icon,
  tone = "rgba(79,70,229,0.10)",
}: StatCardProps) {
  return (
    <div className="metric-card">
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div>
          <p className="metric-label">{label}</p>
          <h2 className="metric-value">{value}</h2>
        </div>

        {icon ? (
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 16,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: tone,
              border: "1px solid rgba(226,232,240,0.9)",
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
        ) : null}
      </div>

      {helper ? <p className="metric-helper">{helper}</p> : null}
    </div>
  );
}