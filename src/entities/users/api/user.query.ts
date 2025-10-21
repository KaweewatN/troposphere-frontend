import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { createQueryFn } from "../../../shared/api/createQueryFn";
import type {
  BorrowHistoryResponse,
  ClubAdminsResponse,
  ClubModeratorsResponse,
  UserClubsResponse,
} from "../model/User";

/**
 * User Management queries for specific endpoints
 */
export const userManagementQueries = {
  /**
   * Get user's borrow history
   * GET /users/history
   */
  borrowHistory: () =>
    queryOptions({
      queryKey: ["users", "history"],
      queryFn: () =>
        createQueryFn<BorrowHistoryResponse>({
          path: "/users/history",
        }),
      placeholderData: keepPreviousData,
    }),

  /**
   * Get club admins by club ID
   * GET /users/admin/club/{club_id}
   */
  clubAdmins: (clubId: number | string) =>
    queryOptions({
      queryKey: ["users", "admin", "club", clubId],
      queryFn: () =>
        createQueryFn<ClubAdminsResponse>({
          path: `/users/admin/club/${clubId}`,
        }),
      placeholderData: keepPreviousData,
      enabled: !!clubId,
    }),

  /**
   * Get club moderators by club ID
   * GET /users/moderator/club/{club_id}
   */
  clubModerators: (clubId: number | string) =>
    queryOptions({
      queryKey: ["users", "moderator", "club", clubId],
      queryFn: () =>
        createQueryFn<ClubModeratorsResponse>({
          path: `/users/moderator/club/${clubId}`,
        }),
      placeholderData: keepPreviousData,
      enabled: !!clubId,
    }),

  /**
   * Get user's clubs
   * GET /users/clubs
   */
  userClubs: () =>
    queryOptions({
      queryKey: ["users", "clubs"],
      queryFn: () =>
        createQueryFn<UserClubsResponse>({
          path: "/users/clubs",
        }),
      placeholderData: keepPreviousData,
    }),
};
