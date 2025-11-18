import { useSearchUserHistory } from "../../../entities/users";
import { Button } from "../../../components/ui";
import type { UserHistory } from "../../../entities/users/types";
import { Package, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function History() {
  const navigate = useNavigate();
  const { data: historyResponse, isLoading } = useSearchUserHistory();

  const userHistory = historyResponse?.data || [];

  // Should be fixed: for a list of history items, keep only the entry with the
  // latest (highest) transaction_id for each `item_qr_code`.
  const getLatestByQR = (items: UserHistory[]) => {
    const map = new Map<string, UserHistory>();

    items.forEach((item) => {
      const key = item.item_qr_code ?? String(item.transaction_id);
      const existing = map.get(key);
      if (!existing) {
        map.set(key, item);
        return;
      }

      // Compare transaction_id - prefer the item with the higher (latest) id.
      // Attempt numeric comparison, fall back to string comparison.
      const a = Number(existing.transaction_id);
      const b = Number(item.transaction_id);
      const isNumeric = Number.isFinite(a) && Number.isFinite(b);

      if (
        (isNumeric && b > a) ||
        (!isNumeric &&
          String(item.transaction_id) > String(existing.transaction_id))
      ) {
        map.set(key, item);
      }
    });

    return Array.from(map.values());
  };

  const latestHistory = getLatestByQR(userHistory);
  console.log("Latest by QR:", latestHistory);

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  // Check if item is overdue (return date has passed)
  const isOverdue = (returnDate: string) => {
    const dueDate = new Date(returnDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    return today > dueDate;
  };

  // Categorize items based on status and overdue using deduped latestHistory
  const overdueItems = latestHistory.filter(
    (item) => item.status === "approved" && isOverdue(item.return_date)
  );

  const currentlyBorrowed = latestHistory.filter(
    (item) => item.status === "approved" && !isOverdue(item.return_date)
  );

  const pendingItems = latestHistory.filter(
    (item) =>
      item.status === "pending_approval" ||
      item.status === "pending_condition_check"
  );

  const borrowHistory = latestHistory.filter(
    (item) => item.status === "completed" || item.status === "rejected"
  );

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

      {/* Overdue Section */}
      {overdueItems.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-red-600 mb-4">Overdue Items</h2>

          <div className="space-y-4">
            {overdueItems.map((item: UserHistory) => (
              <div
                key={item.transaction_id}
                className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-start gap-4"
              >
                {/* Item Icon */}
                <div className="flex-shrink-0 w-28 h-28 bg-red-100 rounded-xl flex items-center justify-center">
                  <Package className="h-16 w-16 text-red-400" />
                </div>

                {/* Item Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-theme-heading text-lg">
                      {item.item_name}
                    </h3>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full flex-shrink-0 ml-2">
                      ⚠️ OVERDUE
                    </span>
                  </div>
                  <p className="text-sm text-red-600 font-medium mb-2">
                    ⏰ This item is overdue! Please return it as soon as
                    possible.
                  </p>
                  <p className="text-sm text-theme-description mb-1">
                    Date Borrowed: {formatDate(item.borrow_date)}
                  </p>
                  <p className="text-sm text-red-600 font-semibold mb-3">
                    Due Date: {formatDate(item.return_date)}
                  </p>

                  {/* Return Button */}
                  <Button
                    onClick={() =>
                      navigate(`/items/return/${item.transaction_id}`, {
                        state: { transaction: item },
                      })
                    }
                    className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 justify-center"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Return Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending Approval Section */}
      {pendingItems.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-yellow-600 mb-4">
            Pending Approval
          </h2>

          <div className="space-y-4">
            {pendingItems.map((item: UserHistory) => (
              <div
                key={item.transaction_id}
                className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4 flex items-start gap-4"
              >
                {/* Item Icon */}
                <div className="flex-shrink-0 w-28 h-28 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Package className="h-16 w-16 text-yellow-400" />
                </div>

                {/* Item Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-theme-heading text-lg">
                      {item.item_name}
                    </h3>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full flex-shrink-0 ml-2">
                      ⏳{" "}
                      {item.status === "pending_approval"
                        ? "Pending Approval"
                        : "Pending Check"}
                    </span>
                  </div>
                  <p className="text-sm text-yellow-600 font-medium mb-2">
                    {item.status === "pending_approval"
                      ? "⏳ Waiting for moderator to approve your borrow request"
                      : "⏳ Waiting for moderator to check item condition"}
                  </p>
                  <p className="text-sm text-theme-description mb-1">
                    Borrowed: {formatDate(item.borrow_date)}
                  </p>
                  <p className="text-sm text-theme-description mb-3">
                    Due Date: {formatDate(item.return_date)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
                {/* Item Icon */}
                <div className="flex-shrink-0 w-28 h-28 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                  <Package className="h-16 w-16 text-blue-400" />
                </div>

                {/* Item Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-theme-heading text-lg">
                      {item.item_name}
                    </h3>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex-shrink-0 ml-2">
                      ✓ Active
                    </span>
                  </div>
                  <p className="text-sm text-theme-description mb-1">
                    Borrowed: {formatDate(item.borrow_date)}
                  </p>
                  <p className="text-sm text-theme-description mb-3">
                    Due Date: {formatDate(item.return_date)}
                  </p>

                  {/* Return Button */}
                  <Button
                    onClick={() =>
                      navigate(`/items/return/${item.transaction_id}`, {
                        state: { transaction: item },
                      })
                    }
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 justify-center"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Return Item
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full inline-flex items-center justify-center py-8 gap-2">
            <Package className="text-theme-body" size={24} />
            <p className="text-theme-body text-sm">
              No currently borrowed items
            </p>
          </div>
        )}
      </div>

      {/* Borrow History Section */}
      {borrowHistory.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-theme-heading mb-4">
            Borrow History
          </h2>

          <div className="space-y-3">
            {borrowHistory.map((item: UserHistory) => (
              <div
                key={item.transaction_id}
                className="bg-theme-secondary rounded-2xl p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-theme-heading text-base">
                    {item.item_name}
                  </h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      item.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.status === "completed" ? "✓ Completed" : "✗ Rejected"}
                  </span>
                </div>
                <p className="text-sm text-theme-description mb-1">
                  Borrowed: {formatDate(item.borrow_date)}
                </p>
                <p className="text-sm text-theme-description">
                  Returned: {formatDate(item.return_date)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
