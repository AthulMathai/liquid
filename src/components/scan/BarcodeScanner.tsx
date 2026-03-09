"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  CornerDownRight,
  QrCode,
  RotateCcw,
  ScanLine,
  Search,
  Smartphone,
  Zap,
} from "lucide-react";

const mockMatches = [
  {
    sku: "SKU1001",
    title: "Black toaster oven",
    barcode: "SKU1001",
    qty: 3,
    status: "Ready",
    statusClass: "badge badge-success",
  },
  {
    sku: "SKU1002",
    title: "Coffee maker stainless",
    barcode: "SKU1002",
    qty: 2,
    status: "Needs photos",
    statusClass: "badge badge-warning",
  },
  {
    sku: "SKU1003",
    title: "Portable heater white",
    barcode: "SKU1003",
    qty: 1,
    status: "Draft",
    statusClass: "badge badge-neutral",
  },
];

export default function BarcodeScanner() {
  const [scanValue, setScanValue] = useState("");
  const [hasScanned, setHasScanned] = useState(false);

  const normalized = scanValue.trim().toLowerCase();

  const matchedProduct = useMemo(() => {
    if (!normalized) return null;

    return (
      mockMatches.find(
        (item) =>
          item.sku.toLowerCase() === normalized ||
          item.barcode.toLowerCase() === normalized ||
          item.title.toLowerCase().includes(normalized)
      ) ?? null
    );
  }, [normalized]);

  const handleMockScan = (value: string) => {
    setScanValue(value);
    setHasScanned(true);
  };

  const resetScanner = () => {
    setScanValue("");
    setHasScanned(false);
  };

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
            <div className="page-eyebrow" style={{ marginBottom: 12 }}>
              Scanner workspace
            </div>
            <h2 className="section-title" style={{ margin: 0 }}>
              Scan, match, and jump into the product page
            </h2>
            <p className="section-subtitle" style={{ margin: "6px 0 0" }}>
              This starter version simulates the scan result. Later, wire this to
              a real camera scanner such as <strong>html5-qrcode</strong> or{" "}
              <strong>@zxing/browser</strong>.
            </p>
          </div>

          <div className="toolbar">
            <span className="badge badge-success">Mock scan active</span>
            <span className="badge badge-neutral">Real scanner next</span>
          </div>
        </div>

        <div className="grid-cards-2">
          <div className="glass-panel">
            <div className="card-content">
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: 24,
                  minHeight: 420,
                  border: "1px solid rgba(var(--border), 0.88)",
                  background:
                    "linear-gradient(180deg, rgba(15,23,42,0.96), rgba(30,41,59,0.95))",
                  boxShadow: "var(--shadow-md)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "radial-gradient(circle at top, rgba(14,165,233,0.18), transparent 35%), linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
                    backgroundSize: "auto, 24px 24px, 24px 24px",
                    opacity: 0.9,
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
                      width: "100%",
                      maxWidth: 360,
                      aspectRatio: "1 / 1",
                      borderRadius: 28,
                      border: "2px solid rgba(99,102,241,0.8)",
                      boxShadow:
                        "0 0 0 9999px rgba(15,23,42,0.18), 0 0 36px rgba(79,70,229,0.35)",
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        left: 20,
                        right: 20,
                        top: "50%",
                        height: 2,
                        background:
                          "linear-gradient(90deg, transparent, rgba(34,197,94,0.95), transparent)",
                        boxShadow: "0 0 18px rgba(34,197,94,0.85)",
                        transform: "translateY(-50%)",
                      }}
                    />

                    <div
                      style={{
                        textAlign: "center",
                        color: "white",
                        position: "relative",
                        zIndex: 1,
                      }}
                    >
                      <div
                        style={{
                          width: 78,
                          height: 78,
                          borderRadius: 24,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "rgba(255,255,255,0.08)",
                          border: "1px solid rgba(255,255,255,0.14)",
                          marginBottom: 16,
                          backdropFilter: "blur(10px)",
                        }}
                      >
                        <ScanLine size={36} />
                      </div>

                      <h3
                        style={{
                          margin: 0,
                          fontFamily: "var(--font-heading), sans-serif",
                          fontSize: 24,
                          fontWeight: 800,
                          letterSpacing: "-0.04em",
                        }}
                      >
                        Camera scanner preview
                      </h3>

                      <p
                        style={{
                          margin: "10px auto 0",
                          maxWidth: 260,
                          color: "rgba(255,255,255,0.76)",
                          fontSize: 14,
                          lineHeight: 1.7,
                        }}
                      >
                        Center the barcode or SKU label in the frame to open the
                        matching product instantly.
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    position: "absolute",
                    left: 16,
                    right: 16,
                    bottom: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <div className="toolbar">
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        minHeight: 34,
                        padding: "0 12px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 800,
                        background: "rgba(255,255,255,0.1)",
                        color: "white",
                        border: "1px solid rgba(255,255,255,0.12)",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      <Camera size={14} />
                      Camera placeholder
                    </span>
                  </div>

                  <div className="toolbar">
                    <button
                      type="button"
                      className="button button-secondary"
                      onClick={() => handleMockScan("SKU1001")}
                    >
                      Simulate Valid Scan
                    </button>
                    <button
                      type="button"
                      className="button button-ghost"
                      onClick={resetScanner}
                    >
                      <RotateCcw size={16} />
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid-cards-3" style={{ marginTop: 18 }}>
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() => handleMockScan("SKU1001")}
                  style={{ minHeight: 54 }}
                >
                  <QrCode size={16} />
                  Scan SKU1001
                </button>

                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() => handleMockScan("SKU1002")}
                  style={{ minHeight: 54 }}
                >
                  <QrCode size={16} />
                  Scan SKU1002
                </button>

                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() => handleMockScan("UNKNOWN")}
                  style={{ minHeight: 54 }}
                >
                  <AlertTriangle size={16} />
                  Scan Unknown
                </button>
              </div>
            </div>
          </div>

          <div className="grid-auto">
            <div className="card">
              <div className="card-content">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 14,
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 16,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        "linear-gradient(135deg, rgba(79,70,229,0.14), rgba(14,165,233,0.12))",
                      border: "1px solid rgba(226,232,240,0.9)",
                    }}
                  >
                    <Search size={22} />
                  </div>

                  <div>
                    <h2 className="section-title" style={{ margin: 0 }}>
                      Scan result
                    </h2>
                    <p className="section-subtitle" style={{ margin: "4px 0 0" }}>
                      The matched product appears here after a scan.
                    </p>
                  </div>
                </div>

                <div className="field-group">
                  <label className="label" htmlFor="scan-input">
                    Manual scan value
                  </label>
                  <input
                    id="scan-input"
                    className="input"
                    placeholder="Type or paste SKU / barcode value"
                    value={scanValue}
                    onChange={(e) => {
                      setScanValue(e.target.value);
                      setHasScanned(e.target.value.trim().length > 0);
                    }}
                  />
                </div>

                {!hasScanned ? (
                  <div
                    className="empty-state"
                    style={{
                      marginTop: 18,
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
                      <ScanLine size={30} />
                    </div>
                    <h3 className="empty-state-title">Waiting for scan</h3>
                    <p className="empty-state-text">
                      Start the scanner or type a SKU manually to simulate the
                      match flow.
                    </p>
                  </div>
                ) : matchedProduct ? (
                  <div
                    style={{
                      marginTop: 18,
                      padding: 18,
                      borderRadius: 22,
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.84), rgba(248,250,252,0.92))",
                      border: "1px solid rgba(var(--border), 0.9)",
                      boxShadow: "var(--shadow-sm)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: 12,
                        marginBottom: 16,
                        flexWrap: "wrap",
                      }}
                    >
                      <div>
                        <div className="page-eyebrow" style={{ marginBottom: 10 }}>
                          Match found
                        </div>
                        <h3
                          style={{
                            margin: 0,
                            fontFamily: "var(--font-heading), sans-serif",
                            fontSize: 24,
                            fontWeight: 800,
                            letterSpacing: "-0.04em",
                          }}
                        >
                          {matchedProduct.title}
                        </h3>
                        <p
                          style={{
                            margin: "8px 0 0",
                            color: "rgb(var(--muted))",
                            fontSize: 14,
                            lineHeight: 1.65,
                          }}
                        >
                          SKU: <strong>{matchedProduct.sku}</strong> • Barcode:{" "}
                          <strong>{matchedProduct.barcode}</strong>
                        </p>
                      </div>

                      <span className={matchedProduct.statusClass}>
                        {matchedProduct.status}
                      </span>
                    </div>

                    <div className="grid-cards-2" style={{ marginBottom: 18 }}>
                      <div className="metric-card">
                        <p className="metric-label">Available Qty</p>
                        <h3 className="metric-value">{matchedProduct.qty}</h3>
                        <p className="metric-helper">
                          Current available stock for this item.
                        </p>
                      </div>

                      <div className="metric-card">
                        <p className="metric-label">Next action</p>
                        <h3
                          style={{
                            margin: 0,
                            fontFamily: "var(--font-heading), sans-serif",
                            fontSize: 22,
                            fontWeight: 800,
                            letterSpacing: "-0.04em",
                          }}
                        >
                          Open Product
                        </h3>
                        <p className="metric-helper">
                          Continue into product detail and image capture.
                        </p>
                      </div>
                    </div>

                    <div className="toolbar" style={{ justifyContent: "space-between" }}>
                      <div className="toolbar">
                        <span className="badge badge-success">Lookup successful</span>
                        <span className="badge badge-neutral">Scan-ready record</span>
                      </div>

                      <Link
                        href={`/products/${matchedProduct.sku}`}
                        className="button button-primary"
                      >
                        <CornerDownRight size={16} />
                        Go to Product
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      marginTop: 18,
                      padding: 18,
                      borderRadius: 22,
                      background: "rgba(254,249,195,0.34)",
                      border: "1px solid rgba(245,158,11,0.24)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                      }}
                    >
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 14,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "rgba(245,158,11,0.14)",
                          flexShrink: 0,
                        }}
                      >
                        <AlertTriangle size={20} />
                      </div>

                      <div>
                        <h3
                          style={{
                            margin: 0,
                            fontSize: 18,
                            fontWeight: 800,
                          }}
                        >
                          No product match found
                        </h3>
                        <p
                          style={{
                            margin: "8px 0 0",
                            color: "rgb(var(--foreground))",
                            fontSize: 14,
                            lineHeight: 1.7,
                          }}
                        >
                          The scanned value <strong>{scanValue}</strong> does not
                          currently match a product record. Check the SKU, import
                          the product first, or set the barcode value equal to the
                          SKU for a simpler workflow.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid-cards-3">
              <div className="card">
                <div className="card-content">
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 14,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(79,70,229,0.10)",
                      marginBottom: 12,
                    }}
                  >
                    <Zap size={18} />
                  </div>
                  <h3 className="card-title">Fastest workflow</h3>
                  <p className="card-description">
                    Scan the item first, then capture photos right away while the
                    physical item is already in hand.
                  </p>
                </div>
              </div>

              <div className="card">
                <div className="card-content">
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 14,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(14,165,233,0.10)",
                      marginBottom: 12,
                    }}
                  >
                    <Smartphone size={18} />
                  </div>
                  <h3 className="card-title">Mobile-first usage</h3>
                  <p className="card-description">
                    This page is designed to work best on a phone during intake,
                    photography, and quick item lookup.
                  </p>
                </div>
              </div>

              <div className="card">
                <div className="card-content">
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 14,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(16,185,129,0.10)",
                      marginBottom: 12,
                    }}
                  >
                    <CheckCircle2 size={18} />
                  </div>
                  <h3 className="card-title">Version 1 rule</h3>
                  <p className="card-description">
                    Set barcode value equal to SKU wherever possible. It removes
                    a lot of unnecessary edge cases.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}