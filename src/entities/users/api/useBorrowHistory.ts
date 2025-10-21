import { useQuery } from "@tanstack/react-query";
import { userManagementQueries } from "./user.query";

/**
 * Hook to fetch user's borrow history
 * @returns React Query result with borrow history data
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useBorrowHistory();
 *
 * if (data) {
 *   console.log(data.history); // Array of borrow history items
 * }
 * ```
 */
export const useBorrowHistory = () => {
  return useQuery(userManagementQueries.borrowHistory());
};
