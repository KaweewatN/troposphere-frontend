import { useQuery } from "@tanstack/react-query";
import { userManagementQueries } from "./user.query";

/**
 * Hook to fetch club moderators by club ID
 * @param clubId - The ID of the club
 * @returns React Query result with club moderators data
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useClubModerators(123);
 *
 * if (data) {
 *   console.log(data.moderators); // Array of club moderator users
 * }
 * ```
 */
export const useClubModerators = (clubId: number | string) => {
  return useQuery(userManagementQueries.clubModerators(clubId));
};
