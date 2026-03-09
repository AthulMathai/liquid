"use client";

import { useCallback, useMemo, useState } from "react";
import uploadProductImage from "@/lib/images/uploadProductImage";

export type LocalCapturedImage = {
  id: string;
  file: File;
  url: string;
  name: string;
  size: number;
};

type UseImageCaptureInput = {
  itemId: string;
  sku: string;
};

type UseImageCaptureState = {
  images: LocalCapturedImage[];
  uploading: boolean;
  error: string | null;
  addFiles: (files: FileList | File[] | null) => void;
  removeImage: (id: string) => void;
  clearImages: () => void;
  uploadAll: () => Promise<void>;
  totalSize: number;
  count: number;
};

function createImageId(file: File, index: number) {
  return `${file.name}-${file.size}-${file.lastModified}-${index}`;
}

export function useImageCapture({
  itemId,
  sku,
}: UseImageCaptureInput): UseImageCaptureState {
  const [images, setImages] = useState<LocalCapturedImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addFiles = useCallback((files: FileList | File[] | null) => {
    if (!files) return;

    const nextFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (!nextFiles.length) {
      setError("Please select image files only.");
      return;
    }

    setError(null);

    setImages((current) => {
      const mapped = nextFiles.map((file, index) => ({
        id: createImageId(file, index),
        file,
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
      }));

      return [...current, ...mapped];
    });
  }, []);

  const removeImage = useCallback((id: string) => {
    setImages((current) => {
      const found = current.find((image) => image.id === id);
      if (found) {
        URL.revokeObjectURL(found.url);
      }
      return current.filter((image) => image.id !== id);
    });
  }, []);

  const clearImages = useCallback(() => {
    setImages((current) => {
      current.forEach((image) => URL.revokeObjectURL(image.url));
      return [];
    });
  }, []);

  const uploadAll = useCallback(async () => {
    if (!itemId.trim()) {
      setError("Missing itemId.");
      return;
    }

    if (!sku.trim()) {
      setError("Missing SKU.");
      return;
    }

    if (!images.length) {
      setError("No images selected.");
      return;
    }

    try {
      setUploading(true);
      setError(null);

      for (let index = 0; index < images.length; index += 1) {
        const image = images[index];

        const result = await uploadProductImage({
          itemId,
          sku,
          file: image.file,
          index: index + 1,
          makePrimary: index === 0,
        });

        if (result.error) {
          throw result.error;
        }
      }

      clearImages();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload images.");
    } finally {
      setUploading(false);
    }
  }, [clearImages, images, itemId, sku]);

  const totalSize = useMemo(
    () => images.reduce((sum, image) => sum + image.size, 0),
    [images]
  );

  return {
    images,
    uploading,
    error,
    addFiles,
    removeImage,
    clearImages,
    uploadAll,
    totalSize,
    count: images.length,
  };
}

export default useImageCapture;