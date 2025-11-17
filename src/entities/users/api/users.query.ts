import { useQuery } from "@tanstack/react-query";
import { createQueryFn } from "../../../shared/api";
import type {
  UserClubsResponse,
  UserHistoryResponse,
  UserProfileResponse,
  UserByStudentIdResponse,
} from "../types";

/**
 * Get clubs associated with the current user
 * GET /users/clubs/
 */
export function useSearchUserClubs() {
  return useQuery({
    queryKey: ["clubs", "users"],
    queryFn: () =>
      createQueryFn<UserClubsResponse>({
        path: `/users/clubs/`,
      }),
    retry: 1,
    throwOnError: false,
  });
}

/**
 * Get borrowing history of the current user
 * GET /users/history/
 */
export function useSearchUserHistory() {
  return useQuery({
    queryKey: ["history", "users"],
    queryFn: () =>
      createQueryFn<UserHistoryResponse>({
        path: `/users/history/`,
      }),
    retry: 1,
    throwOnError: false,
  });
}

/**
 * Get profile information of the current user
 * GET /users/profile/
 */
export function useGetUserProfile(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: () =>
      createQueryFn<UserProfileResponse>({
        path: `/users/profile/`,
      }),
    retry: 1,
    throwOnError: false,
    enabled: options?.enabled !== false,
  });
}

export function useGetUserByStudentId(studentId: string) {
  return useQuery({
    queryKey: ["user", "studentId", studentId],
    queryFn: () =>
      createQueryFn<UserByStudentIdResponse>({
        path: `/users/search?q=${studentId}`,
      }),
    retry: 1,
    throwOnError: false,
    enabled: !!studentId,
  });
}
