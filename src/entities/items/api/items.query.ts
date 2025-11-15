import { useQuery } from "@tanstack/react-query";
import { createQueryFn } from "../../../shared/api";
import type {
  ItemSearchResponse,
  ItemIdSearchResponse,
  ItemSearchInClubResponse,
  ItemSearchInClubApprovalResponse,
} from "../types";

/** Search for items by query string and club ID
 * GET /items/search */
export function useSearchItems(query: string = "", clubId: number) {
  return useQuery({
    queryKey: ["items", "search", query, clubId],
    queryFn: () => {
      const params = new URLSearchParams();
      if (query) params.append("query", encodeURIComponent(query));
      if (clubId) params.append("club_id", clubId.toString());

      return createQueryFn<ItemSearchResponse>({
        path: `/items/search?${params.toString()}`,
      });
    },
    enabled: !!query && !!clubId,
    retry: 1,
  });
}

/** Get item details by item ID
 * GET /items/{item_id} */
export function useSearchItemId(itemId: number) {
  return useQuery({
    queryKey: ["items", itemId],
    queryFn: () =>
      createQueryFn<ItemIdSearchResponse>({
        path: `/items/${itemId}`,
      }),
    enabled: !!itemId,
    retry: 1,
  });
}

/** Get all items in a specific club with pagination
 * GET /items/club/{club_id} */
export function useSearchItemsInClub(
  clubId: number,
  skip: number = 0,
  limit: number = 10,
  query: string = ""
) {
  return useQuery({
    queryKey: ["items", "club", clubId, skip, limit, query],
    queryFn: () => {
      const params = new URLSearchParams();
      params.append("skip", skip.toString());
      params.append("limit", limit.toString());
      if (query) params.append("query", query);

      return createQueryFn<ItemSearchInClubResponse>({
        path: `/items/club/${clubId}?${params.toString()}`,
      });
    },
    enabled: !!clubId,
    retry: 1,
    staleTime: 1000 * 60, // Consider data fresh for 1 minute
    gcTime: 5 * 60 * 1000, // Keep unused data in cache for 5 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    placeholderData: (previousData) => previousData, // Keep previous data while fetching new data
  });
}

/** Get latest pending transactions for approval in a club
 * GET /items/clubs/{club_id}/approval */
export function useSearchItemInClubApproval(
  clubId: number,
  skip: number = 0,
  limit: number = 10
) {
  return useQuery({
    queryKey: ["items", "clubs", clubId, "approval", skip, limit],
    queryFn: () => {
      const params = new URLSearchParams();
      params.append("skip", skip.toString());
      params.append("limit", limit.toString());

      return createQueryFn<ItemSearchInClubApprovalResponse>({
        path: `/items/clubs/${clubId}/approval?${params.toString()}`,
      });
    },
    enabled: !!clubId,
    retry: 1,
  });
}
