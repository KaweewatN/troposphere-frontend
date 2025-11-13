import { createDeleteMutationFn } from "../../../shared/api";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { ValidationError } from "../types/items.generic.type";

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
 */
export function useDeleteItemImages(
  options?: UseMutationOptions<
    void,
    ValidationError | Error,
    { itemId: string }
  >
) {
  return useMutation<void, ValidationError | Error, { itemId: string }>({
    mutationFn: ({ itemId }) =>
      createDeleteMutationFn<void>({
        path: `/items/${itemId}/delete-images`,
      }),
    ...options,
  });
}
