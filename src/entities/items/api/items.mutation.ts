import { useMutation } from "@tanstack/react-query";
import { createMutationFn } from "../../../shared/api";
import type { ValidationError } from "../types/items.generic.type";
import type { UploadItemImagesResponse } from "../types/items.mutation.types";

/**
 * Mutation to upload images for a specific item
 * POST /items/{item_id}/upload-images
 */
export function useUploadItemImages(itemId: string | number) {
  return useMutation<UploadItemImagesResponse, ValidationError | Error, File[]>(
    {
      mutationFn: (files) =>
        createMutationFn<UploadItemImagesResponse, File[]>({
          path: `/items/${itemId}/upload-images`,
          body: files,
        }),
    }
  );
}
