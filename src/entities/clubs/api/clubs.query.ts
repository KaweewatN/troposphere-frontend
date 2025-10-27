import { useQuery } from "@tanstack/react-query";
import { createQueryFn } from "../../../shared/api";
import type {
  ClubResponse,
  ClubMembersResponse,
  ClubDetailsResponse,
} from "../types";

/**
 * Search for clubs by query string
 * GET /clubs/search?query={query}
 */
export function useSearchClubs(query: string = "") {
  return useQuery({
    queryKey: ["clubs", "search", query],
    queryFn: () =>
      createQueryFn<ClubResponse>({
        path: `/clubs/search?query=${encodeURIComponent(query)}`,
      }),
    retry: 1,
    throwOnError: false, // Errors will be in the error property
  });
}

/**
 * Get club members by club ID
 * GET /clubs/{club_id}/members/
 */
export function useSearchClubMembers(clubId: number) {
  return useQuery({
    queryKey: ["clubs", clubId, "members"],
    queryFn: () =>
      createQueryFn<ClubMembersResponse>({
        path: `/clubs/${clubId}/members/`,
      }),
    enabled: !!clubId,
    retry: 1,
    throwOnError: false,
  });
}

/**
 * Get specific club member by club ID and user ID
 * GET /clubs/{club_id}/members/{user_id}
 */
export function useSearchClubMembersId(clubId: number, userId: number) {
  return useQuery({
    queryKey: ["clubs", clubId, "members", userId],
    queryFn: () =>
      createQueryFn<ClubMembersResponse>({
        path: `/clubs/${clubId}/members/${userId}`,
      }),
    enabled: !!clubId && !!userId,
    retry: 1,
    throwOnError: false,
  });
}

/** Get detailed information about a specific club by club ID
 * GET /clubs/{club_id}/details
 */
export function useSearchClubDetails(clubId: number) {
  return useQuery({
    queryKey: ["clubs", clubId, "details"],
    queryFn: () =>
      createQueryFn<ClubDetailsResponse>({
        path: `/clubs/${clubId}/details`,
      }),
    enabled: !!clubId,
    retry: 1,
    throwOnError: false,
  });
}
