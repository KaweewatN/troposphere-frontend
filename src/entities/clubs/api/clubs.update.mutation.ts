import { useMutation } from "@tanstack/react-query";
import { createUpdateMutationFn } from "../../../shared/api";
import type { ValidationError } from "../types";

interface AddMemberToClubRequest {
  role: number;
}
interface AddMemberToClubResponse {
  user_id: number;
  club_id: number;
  role: number;
  joined_at: string;
}

export function useAddMemberToClub(clubId: number, userId: string) {
  return useMutation<
    AddMemberToClubResponse,
    ValidationError | Error,
    AddMemberToClubRequest
  >({
    mutationFn: (body) =>
      createUpdateMutationFn<AddMemberToClubResponse, AddMemberToClubRequest>({
        path: `/clubs/${clubId}/roles/${userId}`,
        body,
      }),
  });
}
