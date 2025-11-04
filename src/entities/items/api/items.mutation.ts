import { useMutation } from "@tanstack/react-query";
import { createMutationFn } from "../../../shared/api";
import type { BorrowItemRequest, BorrowItemResponse } from "../types";

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
}
