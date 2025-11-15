import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  useSearchItemInClubApproval,
  useApproveItemTransaction,
} from "../../../entities/items";
import { BackButton, Modal, Badge } from "../../../components/ui";
import { showSuccess, showError } from "../../../components/ui/toast";
import { CheckCircle, XCircle, Clock, User, Calendar } from "lucide-react";
import type { ItemSearchInClubApproval } from "../../../entities/items/types";

export default function ApproveItem() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const clubId = parseInt(id || "0", 10);

  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<ItemSearchInClubApproval | null>(null);

  const {
    data: approvalItems,
    isLoading,
    error,
    refetch,
  } = useSearchItemInClubApproval(clubId);

  const { mutate: approveTransaction, isPending } = useApproveItemTransaction(
    clubId,
    selectedTransaction?.transaction_id || 0
  );

  const handleApproveClick = (transaction: ItemSearchInClubApproval) => {
    setSelectedTransaction(transaction);
    setIsApprovalModalOpen(true);
  };

  const handleConfirmApprove = () => {
    if (selectedTransaction) {
      approveTransaction(
        { action: "approve" },
        {
          onSuccess: (response) => {
            showSuccess(`${response.message} - Item: ${response.item_name}`);
            setIsApprovalModalOpen(false);
            setSelectedTransaction(null);
            refetch();
          },
          onError: (error: Error | { detail: Array<{ msg: string }> }) => {
            const errorMessage =
              error instanceof Error
                ? error.message
                : "detail" in error
                ? error.detail[0]?.msg || "Failed to approve transaction"
                : "Failed to approve transaction";
            showError(`Error: ${errorMessage}`);
            setIsApprovalModalOpen(false);
            setSelectedTransaction(null);
          },
        }
      );
    }
  };

  const handleCancelApprove = () => {
    setIsApprovalModalOpen(false);
    setSelectedTransaction(null);
  };

  const handleRejectClick = (transaction: ItemSearchInClubApproval) => {
    setSelectedTransaction(transaction);
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    if (selectedTransaction) {
      approveTransaction(
        { action: "reject" },
        {
          onSuccess: (response) => {
            showSuccess(`${response.message} - Item: ${response.item_name}`);
            setIsRejectModalOpen(false);
            setSelectedTransaction(null);
            refetch();
          },
          onError: (error: Error | { detail: Array<{ msg: string }> }) => {
            const errorMessage =
              error instanceof Error
                ? error.message
                : "detail" in error
                ? error.detail[0]?.msg || "Failed to reject transaction"
                : "Failed to reject transaction";
            showError(`Error: ${errorMessage}`);
            setIsRejectModalOpen(false);
            setSelectedTransaction(null);
          },
        }
      );
    }
  };

  const handleCancelReject = () => {
    setIsRejectModalOpen(false);
    setSelectedTransaction(null);
  };

  if (!clubId || isNaN(clubId)) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-red-600">
            Invalid Club ID
          </h2>
          <button
            onClick={() => navigate("/admin/myclubs")}
            className="mt-4 px-4 py-2 bg-theme-purple text-white rounded-lg"
          >
            Back to My Clubs
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-theme-purple border-t-transparent rounded-full animate-spin" />
          <p className="mt-2 text-neutral-600">Loading pending approvals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "There was an error loading the pending approvals.";

    return (
      <div className="container mx-auto py-6 px-4">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-red-600">
            Error loading approvals
          </h2>
          <p className="text-neutral-600 mt-2">{errorMessage}</p>
          <button
            onClick={() => navigate(`/admin/${clubId}/club-management`)}
            className="mt-4 px-4 py-2 bg-theme-purple text-white rounded-lg"
          >
            Back to Club Management
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-screen-lg pb-24">
      {/* Back Button */}
      <div className="mb-4">
        <BackButton />
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black mb-2">
          Pending Approvals
        </h1>
        <p className="text-theme-description text-sm">
          Review and approve pending borrow requests
        </p>
      </div>

      {/* Approval Items List */}
      {!approvalItems || approvalItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-theme-primary-border">
          <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-theme-description">No pending approvals</p>
        </div>
      ) : (
        <div className="space-y-4">
          {approvalItems.map((transaction) => (
            <div
              key={transaction.transaction_id}
              className="bg-white rounded-xl border border-theme-primary-border p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-black mb-1">
                    {transaction.item_name}
                  </h3>
                  <Badge
                    variant="yellow"
                    className="inline-flex items-center gap-1"
                  >
                    <Clock className="h-3 w-3" />
                    {transaction.status}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">Transaction ID</p>
                  <p className="text-sm font-medium text-gray-700">
                    #{transaction.transaction_id}
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {/* Borrower Info */}
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-theme-purple" />
                  <span className="text-gray-600">Borrower:</span>
                  <span className="font-medium text-gray-800">
                    {transaction.borrower_name}
                  </span>
                </div>

                {/* Request Date */}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-theme-purple" />
                  <span className="text-gray-600">Requested:</span>
                  <span className="font-medium text-gray-800">
                    {formatDate(transaction.requested_at)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleApproveClick(transaction)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-colors font-medium"
                >
                  <CheckCircle className="h-4 w-4" />
                  Approve
                </button>
                <button
                  onClick={() => handleRejectClick(transaction)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors font-medium"
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Approval Confirmation Modal */}
      <Modal
        isOpen={isApprovalModalOpen}
        onClose={handleCancelApprove}
        title="Approve Transaction"
        icon={<CheckCircle className="h-5 w-5 text-green-600" />}
        titleColor="text-green-600"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to approve this borrow request?
          </p>

          {selectedTransaction && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Item:</span>
                <span className="text-sm font-medium text-gray-800">
                  {selectedTransaction.item_name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Borrower:</span>
                <span className="text-sm font-medium text-gray-800">
                  {selectedTransaction.borrower_name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Transaction ID:</span>
                <span className="text-sm font-medium text-gray-800">
                  #{selectedTransaction.transaction_id}
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-end mt-6">
            <button
              onClick={handleCancelApprove}
              disabled={isPending}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmApprove}
              disabled={isPending}
              className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Approving...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Confirm Approve
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Reject Confirmation Modal */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={handleCancelReject}
        title="Reject Transaction"
        icon={<XCircle className="h-5 w-5 text-red-600" />}
        titleColor="text-red-600"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to reject this borrow request?
          </p>

          {selectedTransaction && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Item:</span>
                <span className="text-sm font-medium text-gray-800">
                  {selectedTransaction.item_name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Borrower:</span>
                <span className="text-sm font-medium text-gray-800">
                  {selectedTransaction.borrower_name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Transaction ID:</span>
                <span className="text-sm font-medium text-gray-800">
                  #{selectedTransaction.transaction_id}
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-end mt-6">
            <button
              onClick={handleCancelReject}
              disabled={isPending}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmReject}
              disabled={isPending}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Rejecting...
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4" />
                  Confirm Reject
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
