import { useState } from "react";
import { useSearchClubs } from "../../entities/clubs";
import { Card } from "../../components/ui";
import SearchBar from "../../components/ui/searchBar";
import { Image } from "../../components/ui";

export default function SearchClubs() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: clubs, isLoading, error } = useSearchClubs(searchQuery);

  return (
    <div className="container mx-auto py-6 max-w-screen-lg">
      {/* Search Bar with debouncing */}
      <div className="px-1">
        <SearchBar
          onSearch={setSearchQuery}
          placeholder="Search for clubs"
          debounceMs={1000}
        />
      </div>

      <h3 className="font-semibold my-6">
        {clubs?.length
          ? clubs?.length > 1
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

        {!isLoading && clubs && clubs.length === 0 && searchQuery && (
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

        {clubs && clubs.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            {clubs.map((club) => (
              <Card
                key={club.id}
                imageUrl={"https://picsum.photos/200?random=" + club.id}
                name={club.name}
                description={club.description}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
