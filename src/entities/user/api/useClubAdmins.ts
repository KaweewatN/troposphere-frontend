import { useQuery } from "@tanstack/react-query";
import { userManagementQueries } from "./user.query";

/**
 * Hook to fetch club admins by club ID
 * @param clubId - The ID of the club
 * @returns React Query result with club admins data
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useClubAdmins(123);
 *
 * if (data) {
 *   console.log(data.admins); // Array of club admin users
 * }
 * ```
 */
export const useClubAdmins = (clubId: number | string) => {
  return useQuery(userManagementQueries.clubAdmins(clubId));
};
