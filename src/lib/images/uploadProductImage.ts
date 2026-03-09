import { supabase } from "@/lib/supabase/client";
import generateStoragePath from "./generateStoragePath";

export type UploadProductImageInput = {
  itemId: string;
  sku: string;
  file: File;
  index?: number;
  makePrimary?: boolean;
};

export type UploadProductImageSuccess = {
  itemImageId: string;
  storagePath: string;
  publicUrl: string | null;
  fileName: string;
  isPrimary: boolean;
};

export type UploadProductImageResult =
  | { data: UploadProductImageSuccess; error: null }
  | { data: null; error: Error };

const BUCKET_NAME = "product-images";

export async function uploadProductImage({
  itemId,
  sku,
  file,
  index,
  makePrimary = false,
}: UploadProductImageInput): Promise<UploadProductImageResult> {
  try {
    if (!itemId.trim()) {
      return {
        data: null,
        error: new Error("itemId is required."),
      };
    }

    if (!sku.trim()) {
      return {
        data: null,
        error: new Error("sku is required."),
      };
    }

    if (!file) {
      return {
        data: null,
        error: new Error("file is required."),
      };
    }

    const storagePath = generateStoragePath({
      sku,
      fileName: file.name,
      index,
    });

    const uploadResponse = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || "image/jpeg",
      });

    if (uploadResponse.error) {
      return {
        data: null,
        error: new Error(uploadResponse.error.message),
      };
    }

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(storagePath);

    const publicUrl = publicUrlData?.publicUrl ?? null;

    if (makePrimary) {
      const clearPrimary = await supabase
        .from("item_images")
        .update({ is_primary: false })
        .eq("item_id", itemId)
        .eq("is_primary", true);

      if (clearPrimary.error) {
        return {
          data: null,
          error: new Error(clearPrimary.error.message),
        };
      }
    }

    const insertResult = await supabase
      .from("item_images")
      .insert({
        item_id: itemId,
        storage_path: storagePath,
        public_url: publicUrl,
        file_name: file.name,
        sort_order: typeof index === "number" ? index : 0,
        is_primary: makePrimary,
      })
      .select("id, storage_path, public_url, file_name, is_primary")
      .single();

    if (insertResult.error || !insertResult.data) {
      return {
        data: null,
        error: new Error(insertResult.error?.message || "Failed to save image metadata."),
      };
    }

    return {
      data: {
        itemImageId: insertResult.data.id,
        storagePath: insertResult.data.storage_path,
        publicUrl: insertResult.data.public_url,
        fileName: insertResult.data.file_name,
        isPrimary: insertResult.data.is_primary,
      },
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error
          ? error
          : new Error("Failed to upload product image."),
    };
  }
}

export default uploadProductImage;