import { useMutation } from "@tanstack/react-query";
import { createMutationFn } from "../../../shared/api";
import type { BorrowItemRequest, BorrowItemResponse } from "../types";
import type { ValidationError } from "../types/items.generic.type";
import type {
  UploadItemImagesResponse,
  CreateItemRequest,
  CreateItemResponse,
} from "../types/items.mutation.types";

/**
 * Mutation to borrow an item
 * POST /clubs/{club_id}/borrow
 * Creates a borrowing request for an item
 */
export function useBorrowItem() {
    return useMutation<BorrowItemResponse, Error, BorrowItemRequest>({
        mutationFn: ({ club_id, item_id, qr_code, return_date }) =>
            createMutationFn<BorrowItemResponse, Omit<BorrowItemRequest, 'club_id'>>({
                path: `/clubs/${club_id}/borrow`,
                body: {
                    item_id,
                    qr_code,
                    return_date,
                },
            }),
    });

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

/**
 * Mutation to create a new item
 * POST /items
 */
export function useCreateItem() {
  return useMutation<
    CreateItemResponse,
    ValidationError | Error,
    CreateItemRequest
  >({
    mutationFn: (data) =>
      createMutationFn<CreateItemResponse, CreateItemRequest>({
        path: `/items`,
        body: data,
      }),
  });
}
