import { supabase } from "@/lib/supabase/client";

export type SetPrimaryImageInput = {
  itemId: string;
  imageId: string;
};

export type SetPrimaryImageSuccess = {
  imageId: string;
  itemId: string;
  primaryImageUrl: string | null;
};

export type SetPrimaryImageResult =
  | { data: SetPrimaryImageSuccess; error: null }
  | { data: null; error: Error };

export async function setPrimaryImage({
  itemId,
  imageId,
}: SetPrimaryImageInput): Promise<SetPrimaryImageResult> {
  try {
    const safeItemId = itemId.trim();
    const safeImageId = imageId.trim();

    if (!safeItemId) {
      return {
        data: null,
        error: new Error("itemId is required."),
      };
    }

    if (!safeImageId) {
      return {
        data: null,
        error: new Error("imageId is required."),
      };
    }

    const resetExisting = await supabase
      .from("item_images")
      .update({ is_primary: false })
      .eq("item_id", safeItemId)
      .eq("is_primary", true);

    if (resetExisting.error) {
      return {
        data: null,
        error: new Error(resetExisting.error.message),
      };
    }

    const setNewPrimary = await supabase
      .from("item_images")
      .update({ is_primary: true })
      .eq("id", safeImageId)
      .eq("item_id", safeItemId)
      .select("id, item_id, public_url")
      .single();

    if (setNewPrimary.error || !setNewPrimary.data) {
      return {
        data: null,
        error: new Error(
          setNewPrimary.error?.message || "Failed to set primary image."
        ),
      };
    }

    return {
      data: {
        imageId: setNewPrimary.data.id,
        itemId: setNewPrimary.data.item_id,
        primaryImageUrl: setNewPrimary.data.public_url,
      },
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error
          ? error
          : new Error("Failed to update primary image."),
    };
  }
}

export default setPrimaryImage;