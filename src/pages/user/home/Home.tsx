import { Link, useNavigate } from "react-router-dom";
import {
  useSearchUserClubs,
  // useSearchUserHistory,
} from "../../../entities/users";
// import { Image } from "../../../components/ui";
// import type { UserHistory } from "../../../entities/users/types";
import { Card } from "../../../components/ui";
import SearchBar from "../../../components/ui/searchBar";
import { WelcomeHeader } from "./components";
// import { formatDate } from "./utils/getCurrentDate";
// import { Package, SquareLibrary } from "lucide-react";
import { SquareLibrary } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const { data: clubsResponse, isLoading: isLoadingClubs } =
    useSearchUserClubs();
  // const { data: historyResponse, isLoading: isLoadingHistory } =
  //   useSearchUserHistory();

  const userClubs = clubsResponse?.data || [];
  // const userHistory = historyResponse?.data || [];

  // Filter only approved borrowed items
  // const approvedBorrowedItems = userHistory.filter(
  //   (item) => item.status === "approved"
  // );

  // Handle search - navigate to search page with query
  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/search-clubs?query=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="container mx-auto max-w-screen-lg pb-24">
      {/* Welcome Header */}
      <WelcomeHeader />

      {/* Search Bar */}
      <div className="mb-8">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search for clubs"
          debounceMs={1000}
        />
      </div>

      {/* My Borrowed Items */}
      {/* <div className="mb-6">
        <h2 className="text-lg font-semibold text-theme-heading mb-4">
          Currently Borrowed Items
        </h2>

        {isLoadingHistory ? (
          <div className="text-center py-8">
            <div className="inline-block w-6 h-6 border-4 border-theme-purple border-t-transparent rounded-full animate-spin" />
            <p className="mt-2 text-theme-body text-sm">Loading history...</p>
          </div>
        ) : approvedBorrowedItems.length > 0 ? (
          <div className="space-y-3">
            {approvedBorrowedItems.map((item: UserHistory) => (
              <div
                key={item.transaction_id}
                className="bg-theme-secondary rounded-2xl px-4 py-2 flex items-center justify-start gap-x-7"
              >
                <div>
                  <Image
                    src={item.item_name || ""}
                    alt={item.item_name}
                    className="object-cover rounded-md"
                    width={100}
                    height={100}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-theme-heading mb-2">
                    {item.item_name}
                  </h3>
                  <p className="text-sm text-theme-description">
                    Issued date: {formatDate(item.borrow_date)}
                  </p>
                  <p className="text-sm text-theme-description">
                    Return date: {formatDate(item.return_date)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full inline-flex items-center justify-center py-5 gap-2">
            <Package className="text-theme-body" size={24} />
            <p className="text-theme-body text-sm">No borrowed items yet</p>
          </div>
        )}
      </div> */}

      {/* My Clubs */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-theme-heading mb-4">
          My Clubs
        </h2>
        {isLoadingClubs ? (
          <div className="text-center py-8">
            <div className="inline-block w-6 h-6 border-4 border-theme-purple border-t-transparent rounded-full animate-spin" />
            <p className="mt-2 text-theme-body text-sm">Loading clubs...</p>
          </div>
        ) : userClubs.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {userClubs.map((club) => (
              <Link to={`/clubs/${club.club_id}`} key={club.club_id}>
                <Card imageUrl={club.image_path} name={club.club_name} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="w-full inline-flex items-center justify-center py-5 gap-2">
            <SquareLibrary className="text-theme-body" size={24} />
            <p className="text-theme-body text-sm">No clubs joined yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
