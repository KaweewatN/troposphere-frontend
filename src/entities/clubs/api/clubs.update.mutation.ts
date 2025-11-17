import { useMutation } from "@tanstack/react-query";
import { createUpdateMutationFn } from "../../../shared/api";
import type {
  ValidationError,
  UpdateItemInClubRequest,
  UpdateItemInClubResponse,
} from "../types";

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

export function useUpdateItemInClub(clubId: number, itemId: number) {
  return useMutation<
    UpdateItemInClubResponse,
    ValidationError | Error,
    UpdateItemInClubRequest
  >({
    mutationFn: (body) =>
      createUpdateMutationFn<UpdateItemInClubResponse, UpdateItemInClubRequest>(
        {
          path: `/clubs/${clubId}/items/${itemId}`,
          body,
        }
      ),
  });
}
