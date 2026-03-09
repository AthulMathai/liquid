import type { ReactNode } from "react";

type EmptyStateProps = {
  title?: string;
  text?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  badges?: ReactNode;
};

export default function EmptyState({
  title = "Nothing here yet",
  text = "Once data is available, it will appear here.",
  icon,
  actions,
  badges,
}: EmptyStateProps) {
  return (
    <div
      className="empty-state"
      style={{
        borderRadius: 20,
        border: "1px solid rgba(var(--border), 0.86)",
        background: "rgba(248,250,252,0.72)",
      }}
    >
      {icon ? (
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 24,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(79,70,229,0.10)",
            border: "1px solid rgba(226,232,240,0.9)",
            marginBottom: 14,
          }}
        >
          {icon}
        </div>
      ) : null}

      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-text">{text}</p>

      {actions ? (
        <div
          className="toolbar"
          style={{ justifyContent: "center", marginTop: 18 }}
        >
          {actions}
        </div>
      ) : null}

      {badges ? (
        <div
          className="toolbar"
          style={{ justifyContent: "center", marginTop: 18 }}
        >
          {badges}
        </div>
      ) : null}
    </div>
  );
}