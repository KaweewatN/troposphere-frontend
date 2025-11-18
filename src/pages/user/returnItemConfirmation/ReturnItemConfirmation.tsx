import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import type { UserHistory } from "../../../entities/users/types";
import { useReturnItemFromQrCode } from "../../../entities/clubs";
import { Button, showError, showSuccess } from "../../../components/ui";
import { Calendar, ChevronLeft, Package } from "lucide-react";
import { useUserProfile } from "../../../hooks";

export default function ReturnItemConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const [returnDate] = useState<Date>(new Date());
  const isSubmittingRef = useRef(false);

  // Get transaction, scanned QR code, and item info from navigation state
  const transaction = (location.state as { transaction?: UserHistory })
    ?.transaction;
  const scannedQrCode = (location.state as { scannedQrCode?: string })
    ?.scannedQrCode;
  const item_club_id = (location.state as { item_club_id?: number })
    ?.item_club_id;
  const item_qr_code = (location.state as { item_qr_code?: string })
    ?.item_qr_code;

  const { name: userName } = useUserProfile();
  // Use item_club_id for mutation parameter
  const returnMutation = useReturnItemFromQrCode(
    item_club_id || transaction?.item_club_id || 0
  );

  // Protect the page - redirect if no QR code was scanned or no transaction data
  useEffect(() => {
    if (!scannedQrCode || !transaction) {
      navigate(`/history`, { replace: true });
    }
  }, [scannedQrCode, transaction, navigate]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleReturn = async () => {
    // Prevent double submission using ref
    if (isSubmittingRef.current) {
      return;
    }

    if (!scannedQrCode || !transaction || !item_qr_code) {
      showError("Invalid return request");
      navigate(`/history`, { replace: true });
      return;
    }

    isSubmittingRef.current = true;

    try {
      const payload = {
        qr_code: item_qr_code,
      };
      // Use mutateAsync to await the result
      await returnMutation.mutateAsync(payload);
      // Show success toast
      showSuccess("Item returned successfully!");
    } catch (error: unknown) {
      showError("Return failed. Please try again.");
      console.error("Return error:", error);
    } finally {
      isSubmittingRef.current = false;
      queryClient.invalidateQueries({ queryKey: ["history", "users"] });
      queryClient.invalidateQueries({
        queryKey: ["items", transaction.item_id],
      });
      navigate("/history", { replace: true });
      window.location.reload();
    }
  };

  if (!transaction || !scannedQrCode) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="container mx-auto max-w-screen-lg pb-24 px-4">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">Confirm Return</h1>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="relative h-48 bg-gradient-to-br from-blue-100 to-blue-200">
          <div className="absolute inset-0 flex items-center justify-center">
            <Package className="h-16 w-16 text-blue-400" />
          </div>
        </div>
        <div className="p-4">
          <h2 className="text-xl font-bold text-theme-heading mb-2">
            {transaction.item_name}
          </h2>
          <p className="text-sm text-theme-description">
            Transaction ID: #{transaction.transaction_id}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-bold text-theme-heading mb-4">
          Return Details
        </h3>
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
          <span className="text-theme-description text-sm">Returned by</span>
          <span className="text-theme-purple font-semibold">
            {userName || "Loading..."}
          </span>
        </div>
        <div className="flex items-start justify-between mb-4">
          <span className="text-theme-description text-sm">Return Date</span>
          <div className="flex items-center gap-2 text-right">
            <Calendar className="h-4 w-4 text-blue-600" />
            <span className="text-theme-heading font-medium text-sm">
              {formatDate(returnDate)}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6">
        <h3 className="text-lg font-bold text-blue-900 mb-3">
          Item Condition Check
        </h3>
        <p className="text-sm text-blue-700 leading-relaxed">
          By proceeding, you confirm that you are returning this item in good
          condition. Please ensure all components are included and the item is
          clean and functional.
        </p>
      </div>

      <div className="fixed bottom-20 left-0 right-0 px-5 max-w-screen-sm mx-auto">
        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center bg-white border-2 border-gray-300 hover:border-gray-400 transition-all shadow-lg"
          >
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </button>
          <Button
            onClick={handleReturn}
            disabled={isSubmittingRef.current || returnMutation.isPending}
            className="flex-1 py-4 text-base font-semibold shadow-lg bg-blue-600 hover:bg-blue-700"
          >
            {isSubmittingRef.current || returnMutation.isPending
              ? "Returning..."
              : "Confirm Return"}
          </Button>
        </div>
      </div>
    </div>
  );
}
