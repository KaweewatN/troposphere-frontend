import { createDeleteMutationFn } from "../../../shared/api";
import { api } from "../../../shared/api/axios.config";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { ValidationError } from "../types/items.generic.type";
import type { DeleteItemImagesResponse } from "../types/items.mutation.types";

/**
 * Hook to delete an item by ID
 * DELETE /items/{item_id}
 */
export function useDeleteItem(
  options?: UseMutationOptions<
    void,
    ValidationError | Error,
    { itemId: string }
  >
) {
  return useMutation<void, ValidationError | Error, { itemId: string }>({
    mutationFn: ({ itemId }) =>
      createDeleteMutationFn<void>({
        path: `/items/${itemId}`,
      }),
    ...options,
  });
}

/**
 * Hook to delete images for an item
 * DELETE /items/{item_id}/delete-images
 * Request body: { image_urls: string[] }
 */
export function useDeleteItemImages(
  itemId: string | number,
  options?: UseMutationOptions<
    DeleteItemImagesResponse,
    ValidationError | Error,
    string[]
  >
) {
  return useMutation<
    DeleteItemImagesResponse,
    ValidationError | Error,
    string[]
  >({
    mutationFn: async (imageUrls: string[]) => {
      const response = await api.delete<DeleteItemImagesResponse>(
        `/items/${itemId}/delete-images`,
        {
          data: {
            image_urls: imageUrls,
          },
        }
      );
      return response.data;
    },
    ...options,
  });
}
