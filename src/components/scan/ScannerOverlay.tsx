type ScannerOverlayProps = {
  title?: string;
  subtitle?: string;
  active?: boolean;
};

export default function ScannerOverlay({
  title = "Align barcode inside frame",
  subtitle = "Center the SKU or barcode label so the scanner can match the product quickly.",
  active = true,
}: ScannerOverlayProps) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        borderRadius: 24,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at top, rgba(14,165,233,0.16), transparent 30%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          opacity: 0.55,
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: 360,
            aspectRatio: "1 / 1",
            borderRadius: 28,
            border: active
              ? "2px solid rgba(99,102,241,0.82)"
              : "2px solid rgba(148,163,184,0.55)",
            boxShadow: active
              ? "0 0 0 9999px rgba(15,23,42,0.2), 0 0 32px rgba(79,70,229,0.34)"
              : "0 0 0 9999px rgba(15,23,42,0.28)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 14,
              left: 14,
              width: 28,
              height: 28,
              borderTop: "3px solid rgba(255,255,255,0.9)",
              borderLeft: "3px solid rgba(255,255,255,0.9)",
              borderTopLeftRadius: 12,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 14,
              right: 14,
              width: 28,
              height: 28,
              borderTop: "3px solid rgba(255,255,255,0.9)",
              borderRight: "3px solid rgba(255,255,255,0.9)",
              borderTopRightRadius: 12,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 14,
              left: 14,
              width: 28,
              height: 28,
              borderBottom: "3px solid rgba(255,255,255,0.9)",
              borderLeft: "3px solid rgba(255,255,255,0.9)",
              borderBottomLeftRadius: 12,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 14,
              right: 14,
              width: 28,
              height: 28,
              borderBottom: "3px solid rgba(255,255,255,0.9)",
              borderRight: "3px solid rgba(255,255,255,0.9)",
              borderBottomRightRadius: 12,
            }}
          />

          <div
            style={{
              position: "absolute",
              left: 18,
              right: 18,
              top: "50%",
              height: 2,
              transform: "translateY(-50%)",
              background: active
                ? "linear-gradient(90deg, transparent, rgba(34,197,94,0.98), transparent)"
                : "linear-gradient(90deg, transparent, rgba(148,163,184,0.85), transparent)",
              boxShadow: active ? "0 0 18px rgba(34,197,94,0.8)" : "none",
            }}
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-end",
              padding: 24,
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                minHeight: 34,
                padding: "0 14px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 800,
                color: "white",
                background: "rgba(15,23,42,0.42)",
                border: "1px solid rgba(255,255,255,0.12)",
                backdropFilter: "blur(8px)",
                marginBottom: 10,
              }}
            >
              {active ? "Scanner Active" : "Scanner Paused"}
            </div>

            <h3
              style={{
                margin: 0,
                color: "white",
                fontFamily: "var(--font-heading), sans-serif",
                fontSize: 20,
                fontWeight: 800,
                letterSpacing: "-0.04em",
              }}
            >
              {title}
            </h3>

            <p
              style={{
                margin: "8px auto 0",
                maxWidth: 260,
                color: "rgba(255,255,255,0.76)",
                fontSize: 13,
                lineHeight: 1.65,
              }}
            >
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}