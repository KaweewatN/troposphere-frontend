import { useMutation } from "@tanstack/react-query";
import { createMutationFn } from "../../../shared/api";
import type {
  AddItemToClubRequest,
  CreateClubRequest,
  CreateClubResponse,
  ValidationError,
  AddItemToClubResponse,
  BorrowItemFromQrCodeRequest,
  BorrowItemFromQrCodeResponse,
  ReturnItemFromQrCodeRequest,
  ReturnItemFromQrCodeResponse,
} from "../types";

/**
 * Mutation to create a new club
 * POST /clubs/
 */
export function useCreateClub() {
  return useMutation<
    CreateClubResponse,
    ValidationError | Error,
    CreateClubRequest
  >({
    mutationFn: (body) =>
      createMutationFn<CreateClubResponse, CreateClubRequest>({
        path: `/clubs/`,
        body,
      }),
  });
}

/** Mutation to upload an image for a specific club
 * POST /clubs/{club_id}/upload-image
 */
export function useUploadClubImage(clubId: number) {
  return useMutation<string, ValidationError | Error, File | Blob>({
    mutationFn: (file) =>
      createMutationFn<string, File | Blob>({
        path: `/clubs/${clubId}/upload-image`,
        body: file,
      }),
  });
}

/** Mutation to add an item to a specific club
 * POST /clubs/{club_id}/items
 */
export function useAddItemToClub(clubId: number) {
  return useMutation<
    AddItemToClubResponse,
    ValidationError | Error,
    AddItemToClubRequest
  >({
    mutationFn: (body) =>
      createMutationFn<AddItemToClubResponse, AddItemToClubRequest>({
        path: `/clubs/${clubId}/items`,
        body,
      }),
  });
}

/** Mutation to borrow an item from a specific club using QR code
 * POST /clubs/{club_id}/borrow
 */
export function useBorrowItemFromQrCode(clubId: number) {
  return useMutation<
    BorrowItemFromQrCodeResponse,
    ValidationError | Error,
    BorrowItemFromQrCodeRequest
  >({
    mutationFn: (body) =>
      createMutationFn<
        BorrowItemFromQrCodeResponse,
        BorrowItemFromQrCodeRequest
      >({
        path: `/clubs/${clubId}/borrow`,
        body,
      }),
    retry: false, // Disable automatic retries to prevent duplicate requests
  });
}

/** Mutation to return an item to a specific club using QR code
 * POST /clubs/{club_id}/return
 */
export function useReturnItemFromQrCode(clubId: number) {
  return useMutation<
    ReturnItemFromQrCodeResponse,
    ValidationError | Error,
    ReturnItemFromQrCodeRequest
  >({
    mutationFn: (body) =>
      createMutationFn<
        ReturnItemFromQrCodeResponse,
        ReturnItemFromQrCodeRequest
      >({
        path: `/clubs/${clubId}/return`,
        body,
      }),
    retry: false, // Disable automatic retries to prevent duplicate requests
  });
}
