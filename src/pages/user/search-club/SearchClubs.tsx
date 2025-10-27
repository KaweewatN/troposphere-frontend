import { useState, useEffect, useCallback } from "react";
import { useSearchClubs } from "../../../entities/clubs";
import { Card } from "../../../components/ui";
import SearchBar from "../../../components/ui/searchBar";
import { Image } from "../../../components/ui";
import { Link, useSearchParams } from "react-router-dom";

export default function SearchClubs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get("query") || "";
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const { data: clubs, isLoading, error } = useSearchClubs(searchQuery);

  // Update search query when URL parameter changes
  useEffect(() => {
    if (queryParam) {
      setSearchQuery(queryParam);
    }
  }, [queryParam]);

  // Handle search - update both state and URL
  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      if (query.trim()) {
        setSearchParams({ query: query.trim() });
      } else {
        setSearchParams({});
      }
    },
    [setSearchParams]
  );

  return (
    <div className="container mx-auto py-6 max-w-screen-lg">
      {/* Search Bar with debouncing */}
      <div className="px-1">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search for clubs"
          debounceMs={1000}
          initialValue={queryParam}
        />
      </div>

      <h3 className="font-semibold my-6">
        {Array.isArray(clubs) && clubs.length > 0
          ? clubs.length > 1
            ? `Showing ${clubs.length} results`
            : `Showing 1 result`
          : ""}
      </h3>

      {/* Search Results */}
      <div className="mt-6">
        {isLoading && (
          <div className="text-center py-8">
            <div className="inline-block w-8 h-8 border-4 border-theme-purple border-t-transparent rounded-full animate-spin" />
            <p className="mt-2 text-neutral-600">Searching...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8 text-red-600">
            Error loading clubs. Please try again.
          </div>
        )}

        {!isLoading &&
          Array.isArray(clubs) &&
          clubs.length === 0 &&
          searchQuery && (
            <div className="flex flex-col items-center justify-center">
              <Image
                src="/images/illustrations/not-found.svg"
                alt="404 illustration"
                width={200}
                height={200}
                priority
              />
              <div className="text-center max-w-3xs">
                <h3 className="text-theme-heading text-lg font-medium">
                  No clubs found for "{searchQuery}"
                </h3>
                <p className="text-theme-body text-sm mt-2">
                  There is no matches data that you search. Try using different
                  keyword!
                </p>
              </div>
            </div>
          )}

        {Array.isArray(clubs) && clubs.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            {clubs.map((club) => (
              <Link to={`/clubs/${club.id}`} key={club.id}>
                <Card
                  key={club.id}
                  imageUrl={club.imageUrl}
                  name={club.name}
                  description={club.description}
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
