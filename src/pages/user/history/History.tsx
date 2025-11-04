import { useSearchUserHistory } from "../../../entities/users";
import { Image } from "../../../components/ui";
import type { UserHistory } from "../../../entities/users/types";
import { Package } from "lucide-react";

export default function History() {
  const { data: historyResponse, isLoading } = useSearchUserHistory();

  const userHistory = historyResponse?.data || [];

  // Show all items if no status filtering works
  // The backend might return all borrowed items without specific status filtering
  const currentlyBorrowed = userHistory.length > 0 ? userHistory : [];
  const borrowHistory: UserHistory[] = [];

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  // Check if item has met the due date (return date has passed)
  const hasMetDueDate = (returnDate: string) => {
    const dueDate = new Date(returnDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to compare only dates
    return dueDate <= today;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-screen-lg">
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-theme-purple border-t-transparent rounded-full animate-spin" />
          <p className="mt-2 text-neutral-600">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-screen-lg pb-24">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-theme-heading mb-6">
        My Borrowing History
      </h1>

      {/* Currently Borrowed Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-theme-heading mb-4">
          Currently Borrowed
        </h2>

        {currentlyBorrowed.length > 0 ? (
          <div className="space-y-4">
            {currentlyBorrowed.map((item: UserHistory) => (
              <div
                key={item.transaction_id}
                className="bg-theme-secondary rounded-2xl p-4 flex items-start gap-4"
              >
                {/* Item Image */}
                <div className="flex-shrink-0 w-28 h-28 bg-gray-200 rounded-xl overflow-hidden">
                  <Image
                    src={item.item_name || ""}
                    alt={item.item_name}
                    className="object-cover w-full h-full rounded-md"
                    width={112}
                    height={112}
                  />
                </div>

                {/* Item Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-theme-heading text-lg">
                      {item.item_name}
                    </h3>
                    {hasMetDueDate(item.return_date) && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full flex-shrink-0 ml-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        Waiting for approval
                      </span>
                    )}
                  </div>
                  {hasMetDueDate(item.return_date) && (
                    <p className="text-sm text-yellow-600 font-medium mb-2">
                      ⏳ This item is waiting for moderator approval to confirm return
                    </p>
                  )}
                  <p className="text-sm text-theme-description mb-1">
                    Date Borrowed: {formatDate(item.borrow_date)}
                  </p>
                  <p className="text-sm text-theme-description mb-1">
                    Date Returned: {formatDate(item.return_date)}
                  </p>
                  <p className="text-sm text-theme-description">
                    Condition on return: <span className="font-semibold">Good</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full inline-flex items-center justify-center py-8 gap-2">
            <Package className="text-theme-body" size={24} />
            <p className="text-theme-body text-sm">No currently borrowed items</p>
          </div>
        )}
      </div>

      {/* Borrow History Section */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-theme-heading mb-4">
          Borrow History
        </h2>

        {borrowHistory.length > 0 ? (
          <div className="space-y-3">
            {borrowHistory.map((item: UserHistory) => (
              <div
                key={item.transaction_id}
                className="bg-theme-secondary rounded-2xl p-4"
              >
                <h3 className="font-bold text-theme-heading text-base mb-2">
                  {item.item_name}
                </h3>
                <p className="text-sm text-theme-description mb-1">
                  Issued date: {formatDate(item.borrow_date)}
                </p>
                <p className="text-sm text-theme-description">
                  Return date: {formatDate(item.return_date)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full inline-flex items-center justify-center py-8 gap-2">
            <Package className="text-theme-body" size={24} />
            <p className="text-theme-body text-sm">No borrow history yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
