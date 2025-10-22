import { useQuery } from "@tanstack/react-query";
import { createQueryFn } from "../../../shared/api";
import type { Club, ClubMembersResponse } from "../model";

/**
 * Search for clubs by query string
 * GET /clubs/search?query={query}
 */
export function useSearchClubs(query: string = "") {
  return useQuery({
    queryKey: ["clubs", "search", query],
    queryFn: () =>
      createQueryFn<Club[]>({
        path: `/clubs/search?query=${encodeURIComponent(query)}`,
      }),
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
    enabled: !!clubId, // Only fetch when clubId is provided
  });
}
