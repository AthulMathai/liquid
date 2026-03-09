"use client";

import { ChangeEvent, useMemo, useRef, useState } from "react";
import {
  Camera,
  CheckCircle2,
  ImagePlus,
  Loader2,
  ScanLine,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";

type ImageCaptureUploadProps = {
  sku: string;
};

type LocalPreview = {
  id: string;
  file: File;
  url: string;
};

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

export default function ImageCaptureUpload({
  sku,
}: ImageCaptureUploadProps) {
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const filesInputRef = useRef<HTMLInputElement | null>(null);

  const [images, setImages] = useState<LocalPreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const totalSize = useMemo(() => {
    return images.reduce((sum, image) => sum + image.file.size, 0);
  }, [images]);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const validFiles = Array.from(fileList).filter((file) =>
      file.type.startsWith("image/")
    );

    if (!validFiles.length) {
      window.alert("Please select image files only.");
      return;
    }

    const nextImages = validFiles.map((file, index) => ({
      id: `${file.name}-${file.size}-${file.lastModified}-${index}`,
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((current) => [...current, ...nextImages]);
  };

  const onCameraChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files);
  };

  const onFilesChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files);
  };

  const removeImage = (id: string) => {
    setImages((current) => {
      const found = current.find((image) => image.id === id);
      if (found) URL.revokeObjectURL(found.url);
      return current.filter((image) => image.id !== id);
    });
  };

  const clearAllImages = () => {
    images.forEach((image) => URL.revokeObjectURL(image.url));
    setImages([]);
  };

  const handleMockUpload = async () => {
    if (!images.length) {
      window.alert("Add at least one image first.");
      return;
    }

    setIsUploading(true);

    await new Promise((resolve) => setTimeout(resolve, 1400));

    setIsUploading(false);
    window.alert(
      `Images are ready to be uploaded for ${sku}. Next step: connect this button to Supabase Storage and save records into item_images.`
    );
  };

  return (
    <div className="card">
      <div className="card-content">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 16,
          }}
        >
          <div>
            <div className="page-eyebrow" style={{ marginBottom: 12 }}>
              Image intake
            </div>
            <h2 className="section-title" style={{ margin: 0 }}>
              Capture and upload product images
            </h2>
            <p className="section-subtitle" style={{ margin: "6px 0 0" }}>
              Save photos under <strong>{sku}</strong> so every image stays tied
              to the correct product record.
            </p>
          </div>

          <div className="toolbar">
            <span className="badge badge-success">SKU-linked</span>
            <span className="badge badge-neutral">Storage-ready</span>
          </div>
        </div>

        <div
          style={{
            padding: 16,
            borderRadius: 18,
            background: "rgba(248,250,252,0.86)",
            border: "1px solid rgba(226,232,240,0.85)",
            marginBottom: 18,
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
            Recommended workflow: scan the item, open this product page, take
            3–5 photos, and upload them immediately. In production, these files
            should be stored in a path like{" "}
            <strong>{`product-images/${sku}/image-1.jpg`}</strong>.
          </p>
        </div>

        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          onChange={onCameraChange}
          style={{ display: "none" }}
        />

        <input
          ref={filesInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={onFilesChange}
          style={{ display: "none" }}
        />

        <div className="grid-cards-2" style={{ marginBottom: 18 }}>
          <button
            type="button"
            className="button button-primary"
            onClick={() => cameraInputRef.current?.click()}
            style={{ minHeight: 54 }}
          >
            <Camera size={18} />
            Use Camera
          </button>

          <button
            type="button"
            className="button button-secondary"
            onClick={() => filesInputRef.current?.click()}
            style={{ minHeight: 54 }}
          >
            <ImagePlus size={18} />
            Upload From Files
          </button>
        </div>

        <div className="grid-cards-3" style={{ marginBottom: 18 }}>
          <div className="metric-card">
            <p className="metric-label">Selected Images</p>
            <h3 className="metric-value">{images.length}</h3>
            <p className="metric-helper">Images currently queued for upload.</p>
          </div>

          <div className="metric-card">
            <p className="metric-label">Total Size</p>
            <h3 className="metric-value">{formatFileSize(totalSize)}</h3>
            <p className="metric-helper">Combined size of selected image files.</p>
          </div>

          <div className="metric-card">
            <p className="metric-label">Target Folder</p>
            <h3
              style={{
                margin: 0,
                fontFamily: "var(--font-heading), sans-serif",
                fontSize: 20,
                fontWeight: 800,
                letterSpacing: "-0.04em",
                wordBreak: "break-word",
              }}
            >
              {sku}
            </h3>
            <p className="metric-helper">Primary folder key for image storage.</p>
          </div>
        </div>

        {images.length === 0 ? (
          <div className="empty-state card" style={{ background: "rgba(255,255,255,0.62)" }}>
            <div className="card-content">
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

              <h3 className="empty-state-title">No images selected yet</h3>
              <p className="empty-state-text">
                Use the camera for live intake or upload files from your device.
                Once connected to Supabase, these images will be stored directly
                under the product’s SKU path.
              </p>

              <div
                className="toolbar"
                style={{ justifyContent: "center", marginTop: 18 }}
              >
                <span className="badge badge-neutral">Capture-ready</span>
                <span className="badge badge-success">Multi-image upload</span>
                <span className="badge badge-warning">Best with 3–5 photos</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                flexWrap: "wrap",
                marginBottom: 14,
              }}
            >
              <div>
                <h3 className="section-title" style={{ margin: 0 }}>
                  Upload queue
                </h3>
                <p className="section-subtitle" style={{ margin: "4px 0 0" }}>
                  Preview the selected files before sending them to storage.
                </p>
              </div>

              <button
                type="button"
                className="button button-ghost"
                onClick={clearAllImages}
              >
                <Trash2 size={16} />
                Clear all
              </button>
            </div>

            <div className="grid-cards-3">
              {images.map((image, index) => (
                <div key={image.id} className="card">
                  <div
                    style={{
                      borderRadius: 18,
                      overflow: "hidden",
                      border: "1px solid rgba(var(--border), 0.84)",
                      background: "rgba(255,255,255,0.8)",
                    }}
                  >
                    <img
                      src={image.url}
                      alt={`${sku} preview ${index + 1}`}
                      style={{
                        width: "100%",
                        height: 220,
                        objectFit: "cover",
                      }}
                    />
                  </div>

                  <div className="card-content" style={{ paddingTop: 14 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: 10,
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <h3
                          className="card-title"
                          style={{ marginBottom: 6, wordBreak: "break-word" }}
                        >
                          image-{index + 1}
                        </h3>
                        <p className="card-description" style={{ marginBottom: 6 }}>
                          {image.file.name}
                        </p>
                        <p
                          style={{
                            margin: 0,
                            color: "rgb(var(--muted))",
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          {formatFileSize(image.file.size)}
                        </p>
                      </div>

                      <button
                        type="button"
                        className="button button-ghost"
                        onClick={() => removeImage(image.id)}
                        aria-label={`Remove image ${index + 1}`}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="grid-cards-3" style={{ marginTop: 20 }}>
          <div
            style={{
              padding: 16,
              borderRadius: 18,
              background: "rgba(16,185,129,0.08)",
              border: "1px solid rgba(16,185,129,0.18)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 8,
              }}
            >
              <CheckCircle2 size={18} style={{ color: "rgb(var(--success))" }} />
              <h3
                style={{
                  margin: 0,
                  fontSize: 15,
                  fontWeight: 800,
                }}
              >
                Best practice
              </h3>
            </div>

            <p
              style={{
                margin: 0,
                color: "rgb(var(--foreground))",
                fontSize: 14,
                lineHeight: 1.65,
              }}
            >
              Capture front, side, and detail shots so the same image set can be
              reused across Facebook Marketplace, Kijiji, Karrot, and local ads.
            </p>
          </div>

          <div
            style={{
              padding: 16,
              borderRadius: 18,
              background: "rgba(79,70,229,0.08)",
              border: "1px solid rgba(79,70,229,0.16)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 8,
              }}
            >
              <ScanLine size={18} style={{ color: "rgb(var(--primary))" }} />
              <h3
                style={{
                  margin: 0,
                  fontSize: 15,
                  fontWeight: 800,
                }}
              >
                Intake shortcut
              </h3>
            </div>

            <p
              style={{
                margin: 0,
                color: "rgb(var(--foreground))",
                fontSize: 14,
                lineHeight: 1.65,
              }}
            >
              Use scan-to-product first, then capture images. That avoids saving
              photos under the wrong item and keeps intake much faster.
            </p>
          </div>

          <div
            style={{
              padding: 16,
              borderRadius: 18,
              background: "rgba(245,158,11,0.10)",
              border: "1px solid rgba(245,158,11,0.18)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 8,
              }}
            >
              <UploadCloud size={18} style={{ color: "rgb(var(--warning))" }} />
              <h3
                style={{
                  margin: 0,
                  fontSize: 15,
                  fontWeight: 800,
                }}
              >
                Next integration
              </h3>
            </div>

            <p
              style={{
                margin: 0,
                color: "rgb(var(--foreground))",
                fontSize: 14,
                lineHeight: 1.65,
              }}
            >
              Wire this component to Supabase Storage and save image metadata in
              the <strong>item_images</strong> table after upload completes.
            </p>
          </div>
        </div>

        <div
          className="toolbar"
          style={{
            marginTop: 22,
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <div className="toolbar">
            <span className="badge badge-success">Folder: {sku}</span>
            <span className="badge badge-neutral">Local preview active</span>
          </div>

          <div className="toolbar">
            <button
              type="button"
              className="button button-secondary"
              onClick={() => filesInputRef.current?.click()}
              disabled={isUploading}
            >
              <ImagePlus size={16} />
              Add More
            </button>

            <button
              type="button"
              className="button button-primary"
              onClick={() => void handleMockUpload()}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <UploadCloud size={16} />
                  Upload Images
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}