import { createDeleteMutationFn } from "../../../shared/api";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { ValidationError } from "..";

export function useDeleteClubRole(
  clubId: string,
  options?: UseMutationOptions<
    void,
    ValidationError | Error,
    { userId: string }
  >
) {
  return useMutation<void, ValidationError | Error, { userId: string }>({
    mutationFn: ({ userId }) =>
      createDeleteMutationFn<void>({
        path: `/clubs/${clubId}/roles/${userId}`,
      }),
    ...options,
  });
}
