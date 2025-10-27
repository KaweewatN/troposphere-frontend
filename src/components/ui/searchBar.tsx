import { Search, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
  initialValue?: string;
}

export default function SearchBar({
  onSearch,
  placeholder = "Search...",
  debounceMs = 1000,
  initialValue = "",
}: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);
  const [debouncedQuery, setDebouncedQuery] = useState(initialValue);

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  // Call onSearch when debounced query changes
  useEffect(() => {
    onSearch(debouncedQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  const handleClear = useCallback(() => {
    setQuery("");
  }, []);

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        {/* Search Icon */}
        <div className="absolute left-3 text-neutral-400">
          <Search size={20} />
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 text-neutral-900 border border-neutral-300 rounded-3xl 
                     focus:outline-none focus:ring-2 focus:ring-theme-purple focus:border-transparent
                     transition-all duration-200 placeholder:text-neutral-400"
        />

        {/* Clear Button */}
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 text-neutral-400 hover:text-neutral-600 
                       transition-colors duration-200"
            aria-label="Clear search"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Optional: Loading indicator when debouncing */}
      {query !== debouncedQuery && (
        <div className="absolute right-12 top-1/2 -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-theme-purple border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
