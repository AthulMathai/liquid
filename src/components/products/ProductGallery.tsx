"use client";

import { useMemo, useState } from "react";
import {
  ImageIcon,
  Maximize2,
  Star,
  Trash2,
  UploadCloud,
} from "lucide-react";

export type ProductGalleryImage = {
  id: string;
  url: string;
  alt?: string | null;
  fileName?: string | null;
  isPrimary?: boolean;
  sortOrder?: number;
};

type ProductGalleryProps = {
  images?: ProductGalleryImage[];
  title?: string;
  subtitle?: string;
  onSetPrimary?: (imageId: string) => void;
  onDelete?: (imageId: string) => void;
};

export default function ProductGallery({
  images = [],
  title = "Product Gallery",
  subtitle = "Review image coverage, choose a primary photo, and keep listing visuals clean.",
  onSetPrimary,
  onDelete,
}: ProductGalleryProps) {
  const sortedImages = useMemo(() => {
    return [...images].sort((a, b) => {
      const aPrimary = a.isPrimary ? 1 : 0;
      const bPrimary = b.isPrimary ? 1 : 0;

      if (aPrimary !== bPrimary) return bPrimary - aPrimary;

      const aOrder = typeof a.sortOrder === "number" ? a.sortOrder : 999999;
      const bOrder = typeof b.sortOrder === "number" ? b.sortOrder : 999999;

      return aOrder - bOrder;
    });
  }, [images]);

  const [selectedImageId, setSelectedImageId] = useState<string | null>(
    sortedImages[0]?.id ?? null
  );

  const selectedImage =
    sortedImages.find((image) => image.id === selectedImageId) ??
    sortedImages[0] ??
    null;

  const hasImages = sortedImages.length > 0;

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
            <span className="badge badge-success">
              {sortedImages.length} image{sortedImages.length === 1 ? "" : "s"}
            </span>
            <span className="badge badge-neutral">Primary visible</span>
          </div>
        </div>

        {!hasImages ? (
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
              <UploadCloud size={32} />
            </div>

            <h3 className="empty-state-title">No product images yet</h3>
            <p className="empty-state-text">
              Once images are uploaded for this product, they will appear here so
              you can review coverage and set the best primary image.
            </p>

            <div
              className="toolbar"
              style={{ justifyContent: "center", marginTop: 18 }}
            >
              <span className="badge badge-warning">Needs images</span>
              <span className="badge badge-neutral">Gallery ready</span>
            </div>
          </div>
        ) : (
          <>
            <div className="grid-cards-2">
              <div
                style={{
                  borderRadius: 24,
                  overflow: "hidden",
                  border: "1px solid rgba(var(--border), 0.88)",
                  boxShadow: "var(--shadow-sm)",
                  background: "rgba(255,255,255,0.72)",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    minHeight: 420,
                    background: "rgba(248,250,252,0.9)",
                  }}
                >
                  {selectedImage ? (
                    <img
                      src={selectedImage.url}
                      alt={selectedImage.alt || selectedImage.fileName || "Product image"}
                      style={{
                        width: "100%",
                        height: 420,
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  ) : null}

                  <div
                    className="toolbar"
                    style={{
                      position: "absolute",
                      left: 16,
                      right: 16,
                      bottom: 16,
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                    }}
                  >
                    <div className="toolbar">
                      {selectedImage?.isPrimary ? (
                        <span className="badge badge-success">Primary Image</span>
                      ) : (
                        <span className="badge badge-neutral">Gallery Image</span>
                      )}

                      <span className="badge badge-warning">
                        {selectedImage?.fileName || "Unnamed"}
                      </span>
                    </div>

                    <div className="toolbar">
                      <button
                        type="button"
                        className="button button-secondary"
                        onClick={() =>
                          selectedImage &&
                          onSetPrimary?.(selectedImage.id)
                        }
                        disabled={!selectedImage}
                      >
                        <Star size={16} />
                        Set Primary
                      </button>

                      <button
                        type="button"
                        className="button button-ghost"
                        onClick={() =>
                          selectedImage &&
                          window.open(selectedImage.url, "_blank", "noopener,noreferrer")
                        }
                        disabled={!selectedImage}
                      >
                        <Maximize2 size={16} />
                        Open
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid-auto">
                <div className="grid-cards-2">
                  <div className="metric-card">
                    <p className="metric-label">Primary Image</p>
                    <h3
                      style={{
                        margin: 0,
                        fontFamily: "var(--font-heading), sans-serif",
                        fontSize: 22,
                        fontWeight: 800,
                        letterSpacing: "-0.04em",
                      }}
                    >
                      {sortedImages.some((image) => image.isPrimary) ? "Yes" : "No"}
                    </h3>
                    <p className="metric-helper">
                      Used as the main thumbnail across the app.
                    </p>
                  </div>

                  <div className="metric-card">
                    <p className="metric-label">Image Count</p>
                    <h3 className="metric-value">{sortedImages.length}</h3>
                    <p className="metric-helper">
                      Total photos currently attached to this product.
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    padding: 16,
                    borderRadius: 18,
                    background: "rgba(248,250,252,0.86)",
                    border: "1px solid rgba(226,232,240,0.85)",
                  }}
                >
                  <h4
                    style={{
                      margin: "0 0 8px",
                      fontSize: 15,
                      fontWeight: 800,
                    }}
                  >
                    Best practice
                  </h4>
                  <p
                    style={{
                      margin: 0,
                      color: "rgb(var(--muted))",
                      fontSize: 14,
                      lineHeight: 1.7,
                    }}
                  >
                    Choose the clearest front-facing photo as the primary image.
                    That same image will usually become the main listing thumbnail.
                  </p>
                </div>

                <div className="grid-auto">
                  {sortedImages.map((image, index) => {
                    const isSelected = image.id === selectedImage?.id;

                    return (
                      <button
                        key={image.id}
                        type="button"
                        onClick={() => setSelectedImageId(image.id)}
                        className="card"
                        style={{
                          textAlign: "left",
                          background: isSelected
                            ? "rgba(79,70,229,0.08)"
                            : "rgba(255,255,255,0.62)",
                          border: isSelected
                            ? "1px solid rgba(79,70,229,0.28)"
                            : undefined,
                        }}
                      >
                        <div className="card-content">
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "88px minmax(0, 1fr) auto",
                              gap: 14,
                              alignItems: "center",
                            }}
                          >
                            <div
                              style={{
                                width: 88,
                                height: 72,
                                borderRadius: 16,
                                overflow: "hidden",
                                border: "1px solid rgba(var(--border), 0.84)",
                                background: "rgba(255,255,255,0.82)",
                                flexShrink: 0,
                              }}
                            >
                              <img
                                src={image.url}
                                alt={
                                  image.alt ||
                                  image.fileName ||
                                  `Product image ${index + 1}`
                                }
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  display: "block",
                                }}
                              />
                            </div>

                            <div style={{ minWidth: 0 }}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                  flexWrap: "wrap",
                                  marginBottom: 6,
                                }}
                              >
                                <h3
                                  className="card-title"
                                  style={{
                                    margin: 0,
                                    fontSize: 15,
                                  }}
                                >
                                  {image.fileName || `image-${index + 1}`}
                                </h3>

                                {image.isPrimary ? (
                                  <span className="badge badge-success">
                                    Primary
                                  </span>
                                ) : null}
                              </div>

                              <p className="card-description" style={{ margin: 0 }}>
                                {image.alt || "Product image preview"}
                              </p>
                            </div>

                            <div className="toolbar">
                              <button
                                type="button"
                                className="button button-ghost"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  onSetPrimary?.(image.id);
                                }}
                                aria-label={`Set ${image.fileName || `image ${index + 1}`} as primary`}
                              >
                                <Star size={16} />
                              </button>

                              <button
                                type="button"
                                className="button button-ghost"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  onDelete?.(image.id);
                                }}
                                aria-label={`Delete ${image.fileName || `image ${index + 1}`}`}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="toolbar" style={{ marginTop: 18 }}>
              <span className="badge badge-success">Gallery loaded</span>
              <span className="badge badge-neutral">Primary image supported</span>
              <span className="badge badge-warning">Ready for listings</span>
            </div>
          </>
        )}

        {!hasImages ? (
          <div className="grid-cards-3" style={{ marginTop: 18 }}>
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
                  <ImageIcon size={18} />
                </div>
                <h3 className="card-title">Need coverage</h3>
                <p className="card-description">
                  A product should ideally have front, angle, and detail images
                  before it moves into listing status.
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
                  <Star size={18} />
                </div>
                <h3 className="card-title">Choose one hero image</h3>
                <p className="card-description">
                  The primary image should be the best single representation of
                  the item for browsing and marketplace thumbnails.
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
                  <UploadCloud size={18} />
                </div>
                <h3 className="card-title">Upload next</h3>
                <p className="card-description">
                  Use the image capture component to attach photos directly under
                  the SKU and make this product visually sell-ready.
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}