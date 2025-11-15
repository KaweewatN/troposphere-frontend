import { useMutation } from "@tanstack/react-query";
import { createUpdateMutationFn } from "../../../shared/api";
import type { ValidationError } from "../types/items.generic.type";
import type {
  ApproveItemTransactionRequest,
  ApproveItemTransactionResponse,
} from "../types/items.mutation.types";

/**
 * Mutation to approve an item transaction
 * PUT /items/clubs/{club_id}/approval/{transaction_id}
 */
export function useApproveItemTransaction(
  clubId: string | number,
  transactionId: string | number
) {
  return useMutation<
    ApproveItemTransactionResponse,
    ValidationError | Error,
    ApproveItemTransactionRequest
  >({
    mutationFn: (body) =>
      createUpdateMutationFn<
        ApproveItemTransactionResponse,
        ApproveItemTransactionRequest
      >({
        path: `/items/clubs/${clubId}/approval/${transactionId}`,
        body,
      }),
  });
}
