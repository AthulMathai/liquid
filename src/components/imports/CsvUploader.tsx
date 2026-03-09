"use client";

import { ChangeEvent, DragEvent, useMemo, useRef, useState } from "react";
import {
  FileSpreadsheet,
  FolderOpen,
  Loader2,
  UploadCloud,
  X,
} from "lucide-react";

type UploadState = "idle" | "dragging" | "selected" | "uploading";

function formatFileSize(bytes: number) {
  if (!bytes || Number.isNaN(bytes)) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

export default function CsvUploader() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileDetails = useMemo(() => {
    if (!selectedFile) return null;

    return {
      name: selectedFile.name,
      size: formatFileSize(selectedFile.size),
      type: selectedFile.type || "text/csv",
      lastModified: new Date(selectedFile.lastModified).toLocaleDateString(),
    };
  }, [selectedFile]);

  const acceptFile = (file: File | null) => {
    if (!file) return;

    const isCsv =
      file.type === "text/csv" ||
      file.name.toLowerCase().endsWith(".csv") ||
      file.type === "application/vnd.ms-excel";

    if (!isCsv) {
      window.alert("Please select a CSV file.");
      return;
    }

    setSelectedFile(file);
    setUploadState("selected");
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    acceptFile(file);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setUploadState((current) =>
      current === "uploading" ? "uploading" : "dragging"
    );
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setUploadState((current) =>
      current === "uploading"
        ? "uploading"
        : selectedFile
          ? "selected"
          : "idle"
    );
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const file = event.dataTransfer.files?.[0] ?? null;
    acceptFile(file);
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setUploadState("idle");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleMockUpload = async () => {
    if (!selectedFile) return;

    setUploadState("uploading");

    await new Promise((resolve) => setTimeout(resolve, 1200));

    setUploadState("selected");
    window.alert(
      "CSV selected successfully. Next step: wire this button to the real import function."
    );
  };

  const isDragging = uploadState === "dragging";
  const isUploading = uploadState === "uploading";

  return (
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
            <UploadCloud size={22} />
          </div>

          <div>
            <h2 className="section-title" style={{ margin: 0 }}>
              Upload inventory CSV
            </h2>
            <p className="section-subtitle" style={{ margin: "4px 0 0" }}>
              Drop your product file here or browse from your computer.
            </p>
          </div>
        </div>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          style={{
            position: "relative",
            minHeight: 260,
            borderRadius: 24,
            border: isDragging
              ? "1.5px solid rgba(var(--primary), 0.55)"
              : "1.5px dashed rgba(148,163,184,0.45)",
            background: isDragging
              ? "linear-gradient(135deg, rgba(79,70,229,0.08), rgba(14,165,233,0.08))"
              : "linear-gradient(180deg, rgba(255,255,255,0.84), rgba(248,250,252,0.88))",
            boxShadow: isDragging ? "var(--shadow-md)" : "var(--shadow-xs)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            cursor: "pointer",
            transition:
              "border-color 180ms ease, background 180ms ease, box-shadow 180ms ease, transform 180ms ease",
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          {!selectedFile ? (
            <div
              style={{
                textAlign: "center",
                maxWidth: 460,
              }}
            >
              <div
                style={{
                  width: 76,
                  height: 76,
                  borderRadius: 24,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(79,70,229,0.10)",
                  border: "1px solid rgba(226,232,240,0.9)",
                  marginBottom: 18,
                }}
              >
                <FileSpreadsheet size={34} />
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
                {isDragging ? "Drop your CSV here" : "Drop your CSV to begin"}
              </h3>

              <p
                style={{
                  margin: "10px auto 0",
                  color: "rgb(var(--muted))",
                  fontSize: 14,
                  lineHeight: 1.7,
                  maxWidth: 420,
                }}
              >
                Bring in SKU, description, quantity, pricing, and barcode values
                to create a scan-ready product catalog.
              </p>

              <div
                className="toolbar"
                style={{
                  justifyContent: "center",
                  marginTop: 18,
                }}
              >
                <span className="badge badge-neutral">CSV only</span>
                <span className="badge badge-success">Fast intake</span>
                <span className="badge badge-warning">Validate before import</span>
              </div>

              <div style={{ marginTop: 22 }}>
                <button
                  type="button"
                  className="button button-primary"
                  onClick={(event) => {
                    event.stopPropagation();
                    inputRef.current?.click();
                  }}
                >
                  <FolderOpen size={16} />
                  Browse files
                </button>
              </div>
            </div>
          ) : (
            <div
              style={{
                width: "100%",
                maxWidth: 620,
              }}
            >
              <div
                className="card"
                style={{
                  background: "rgba(255,255,255,0.76)",
                }}
              >
                <div className="card-content">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: 14,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 14,
                        minWidth: 0,
                      }}
                    >
                      <div
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: 18,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background:
                            "linear-gradient(135deg, rgba(79,70,229,0.14), rgba(14,165,233,0.10))",
                          border: "1px solid rgba(226,232,240,0.9)",
                          flexShrink: 0,
                        }}
                      >
                        <FileSpreadsheet size={26} />
                      </div>

                      <div style={{ minWidth: 0 }}>
                        <p className="metric-label" style={{ marginBottom: 6 }}>
                          Selected file
                        </p>
                        <h3
                          style={{
                            margin: 0,
                            fontFamily: "var(--font-heading), sans-serif",
                            fontSize: 20,
                            fontWeight: 800,
                            letterSpacing: "-0.03em",
                            wordBreak: "break-word",
                          }}
                        >
                          {fileDetails?.name}
                        </h3>

                        <div
                          className="toolbar"
                          style={{
                            marginTop: 12,
                            gap: 10,
                          }}
                        >
                          <span className="badge badge-neutral">
                            {fileDetails?.size}
                          </span>
                          <span className="badge badge-success">
                            {fileDetails?.type}
                          </span>
                          <span className="badge badge-warning">
                            {fileDetails?.lastModified}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="button button-ghost"
                      onClick={(event) => {
                        event.stopPropagation();
                        clearSelectedFile();
                      }}
                      aria-label="Remove selected file"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div
                    style={{
                      marginTop: 18,
                      padding: 14,
                      borderRadius: 16,
                      background: "rgba(248,250,252,0.86)",
                      border: "1px solid rgba(226,232,240,0.85)",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        color: "rgb(var(--muted))",
                        fontSize: 14,
                        lineHeight: 1.7,
                      }}
                    >
                      The next step is to preview the headers, map the columns,
                      validate the rows, and then send the data into the import
                      pipeline.
                    </p>
                  </div>

                  <div
                    className="toolbar"
                    style={{
                      marginTop: 18,
                      justifyContent: "space-between",
                    }}
                  >
                    <div className="toolbar">
                      <span className="badge badge-success">Ready</span>
                      <span className="badge badge-neutral">
                        Catalog intake pending
                      </span>
                    </div>

                    <div className="toolbar">
                      <button
                        type="button"
                        className="button button-secondary"
                        onClick={(event) => {
                          event.stopPropagation();
                          inputRef.current?.click();
                        }}
                        disabled={isUploading}
                      >
                        Replace file
                      </button>

                      <button
                        type="button"
                        className="button button-primary"
                        onClick={(event) => {
                          event.stopPropagation();
                          void handleMockUpload();
                        }}
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Preparing...
                          </>
                        ) : (
                          <>
                            <UploadCloud size={16} />
                            Continue import
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="toolbar" style={{ marginTop: 16 }}>
          <span className="badge badge-neutral">Expected: inventory CSV</span>
          <span className="badge badge-success">Best with unique SKU</span>
          <span className="badge badge-warning">Barcode can match SKU</span>
        </div>
      </div>
    </div>
  );
}