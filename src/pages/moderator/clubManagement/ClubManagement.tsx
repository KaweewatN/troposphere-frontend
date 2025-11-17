import { useParams, useNavigate, Link } from "react-router-dom";
import { useSearchClubDetails } from "../../../entities/clubs";
import { useSearchItemsInClub } from "../../../entities/items";
import type { ItemSearchInClub } from "../../../entities/items/types/items.query.types";
import { Image, Badge, Button } from "../../../components/ui";
import SearchBar from "../../../components/ui/searchBar";
import { Check, TriangleAlert, ShieldAlert } from "lucide-react";
import { BackButton } from "../../../components/ui";
import { AxiosError } from "axios";
import { useState, useEffect, useRef, useCallback } from "react";

export default function ClubManagement() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const clubId = parseInt(id || "0", 10);
  const [searchQuery, setSearchQuery] = useState("");
  const [limit, setLimit] = useState(10);
  const [allItems, setAllItems] = useState<ItemSearchInClub[]>([]);
  const observerTarget = useRef<HTMLDivElement>(null);

  const {
    data: clubDetailsResponse,
    isLoading: isLoadingDetails,
    error: detailsError,
  } = useSearchClubDetails(clubId);

  const {
    data: clubItemsResponse,
    isLoading: isLoadingItems,
    error: itemsError,
    isFetching,
  } = useSearchItemsInClub(clubId, 0, limit, searchQuery);

  const clubDetails = clubDetailsResponse?.data;
  const totalMembers = clubDetailsResponse?.data?.total_members || 0;

  // Update allItems when new data arrives
  useEffect(() => {
    const items = clubItemsResponse?.data || [];
    setAllItems(items);
  }, [clubItemsResponse?.data]);

  // Reset limit when search query changes
  useEffect(() => {
    setLimit(10);
  }, [searchQuery]);

  // Infinite scroll observer
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && !isFetching && allItems.length >= limit) {
        setLimit((prev) => prev + 10);
      }
    },
    [isFetching, allItems.length, limit]
  );

  useEffect(() => {
    const element = observerTarget.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "100px",
      threshold: 0.1,
    });

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [handleObserver]);

  const isLoading = isLoadingDetails || isLoadingItems;
  const hasError = detailsError || itemsError;

  // Check for 403 Forbidden error
  const is403Error =
    (detailsError as AxiosError)?.response?.status === 403 ||
    (itemsError as AxiosError)?.response?.status === 403;

  if (!clubId || isNaN(clubId)) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-red-600">
            Invalid Club ID
          </h2>
          <Button onClick={() => navigate("/search-clubs")} className="mt-4">
            Back to Search
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-theme-purple border-t-transparent rounded-full animate-spin" />
          <p className="mt-2 text-neutral-600">Loading club details...</p>
        </div>
      </div>
    );
  }

  // Handle 403 Forbidden - No permission
  if (is403Error) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-screen-lg">
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <div className="bg-yellow-100 p-4 rounded-full">
              <ShieldAlert className="h-12 w-12 text-yellow-600" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-yellow-600 mb-3">
            Access Denied
          </h2>
          <p className="text-neutral-700 mb-2 max-w-md mx-auto">
            You don't have permission for borrowing in this club/lab.
          </p>
          <p className="text-neutral-600 text-sm mb-6 max-w-md mx-auto">
            Please contact the moderator or admin of this club for help.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate("/search-clubs")}
              className="py-2 px-4 rounded-3xl border border-theme-purple text-theme-purple hover:bg-theme-purple hover:text-white transition-colors"
            >
              Back to Search
            </button>
            <Button onClick={() => navigate("/")}>Go Home</Button>
          </div>
        </div>
      </div>
    );
  }

  if (hasError || !clubDetails) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-red-600">
            Error loading club details
          </h2>
          <p className="text-neutral-600 mt-2">
            The club you're looking for doesn't exist or there was an error
            loading it.
          </p>
          <Button onClick={() => navigate("/search-clubs")} className="mt-4">
            Back to Search
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-screen-lg pb-24">
      {/* Back Button */}
      <div className="mb-4">
        <BackButton />
      </div>

      {/* Club Header */}
      <div className="bg-white overflow-hidden">
        <div className="relative h-48 bg-gradient-to-br from-theme-purple to-purple-600 ">
          <Image
            src={clubDetails.image_path}
            alt={clubDetails.name}
            fill
            objectFit="cover"
            className="absolute inset-0"
          />
        </div>

        <div className="py-6 px-3">
          <h1 className="text-2xl font-bold text-black mb-2">
            {clubDetails.name}
          </h1>
          <p className="text-theme-description text-sm mb-4">
            {clubDetails.description}
          </p>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-theme-purple"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <p className="text-black font-medium hover:underline">
                {totalMembers} {totalMembers === 1 ? "Member" : "Members"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Items Section */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-black">Items</h2>
        </div>

        {/* Search Bar */}
        <div className="mb-7">
          <SearchBar
            onSearch={setSearchQuery}
            placeholder="Search items by name or description..."
            debounceMs={500}
          />
        </div>

        {(isLoadingItems || isFetching) && allItems.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-block w-6 h-6 border-4 border-theme-purple border-t-transparent rounded-full animate-spin" />
            <p className="mt-2 text-sm text-neutral-600">
              {searchQuery ? "Searching..." : "Loading items..."}
            </p>
          </div>
        ) : allItems.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-x-2 gap-y-3">
              {allItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-theme-primary-border overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Item Image */}
                  <Link to={`/items/${item.id}`} className="block">
                    <div className="relative h-40 bg-gray-100">
                      {item.images && item.images.length > 0 ? (
                        <Image
                          src={item.images[0]}
                          alt={item.name}
                          fill
                          objectFit="cover"
                          className="absolute inset-0"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12 text-gray-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                            />
                          </svg>
                        </div>
                      )}

                      {/* Status Badge */}
                      <div className="absolute top-2 right-2">
                        <Badge
                          variant={
                            item.status === "AVAILABLE"
                              ? "green"
                              : item.status === "BORROWED"
                              ? "yellow"
                              : "gray"
                          }
                        >
                          {item.status === "AVAILABLE" && (
                            <Check className="h-3 w-3" strokeWidth={3} />
                          )}
                          {item.status === "BORROWED" && (
                            <TriangleAlert
                              className="h-3 w-3"
                              strokeWidth={3}
                            />
                          )}
                        </Badge>
                      </div>

                      {/* High Risk Badge */}
                      {item.is_high_risk && (
                        <div className="absolute top-2 left-2">
                          <Badge variant="red">
                            <TriangleAlert
                              className="h-3 w-3"
                              strokeWidth={3}
                            />
                            High Risk
                          </Badge>
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Item Info */}
                  <div className="p-4">
                    <Link to={`/items/${item.id}`}>
                      <h3 className="font-semibold text-black text-base mb-2 hover:text-theme-purple transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-xs text-theme-description line-clamp-2">
                        {item.description.length > 60
                          ? item.description.substring(0, 60) + "..."
                          : item.description}
                      </p>

                      {/* QR Code indicator */}
                      {item.qr_code && (
                        <div className="mt-3 flex items-center gap-2 text-xs text-theme-purple">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                            />
                          </svg>
                          <span>QR Code Available</span>
                        </div>
                      )}
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Infinite scroll trigger and loading indicator */}
            <div ref={observerTarget} className="py-4">
              {isFetching && allItems.length > 0 && (
                <div className="text-center">
                  <div className="inline-block w-6 h-6 border-4 border-theme-purple border-t-transparent rounded-full animate-spin" />
                  <p className="mt-2 text-sm text-neutral-600">
                    Loading more items...
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-theme-description">
            <p>
              {searchQuery
                ? "No items found matching your search."
                : "No items found in this club."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
