// Noted: This file has been edited to prevent double submission when borrowing an item. But somehow the issue persists. (successfully database side, but frontend shows error sometimes)

import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchItemId } from "../../../entities/items";
import {
  useSearchClubDetails,
  useBorrowItemFromQrCode,
} from "../../../entities/clubs";
import { Image, Button, showError } from "../../../components/ui";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useUserProfile } from "../../../hooks";

export default function ConfirmBorrow() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const itemId = parseInt(id || "0", 10);

  const [borrowDate] = useState<Date>(new Date());
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const isSubmittingRef = useRef(false);

  const { data: itemData, isLoading, refetch } = useSearchItemId(itemId);
  const { data: clubData } = useSearchClubDetails(itemData?.club_id || 0);
  const { name: userName } = useUserProfile();
  const borrowMutation = useBorrowItemFromQrCode(itemData?.club_id || 0);

  // Get scanned QR code from navigation state
  const scannedQrCode = (location.state as { scannedQrCode?: string })
    ?.scannedQrCode;

  // Protect the page - redirect if no QR code was scanned
  useEffect(() => {
    if (!scannedQrCode) {
      navigate(`/items/${itemId}`, { replace: true });
    }
  }, [scannedQrCode, itemId, navigate]);

  // Check if item is available when component mounts
  useEffect(() => {
    if (itemData && itemData.status !== "AVAILABLE") {
      alert(
        `This item is currently ${itemData.status.toLowerCase()} and cannot be borrowed.`
      );
      navigate(`/items/${itemId}`, { replace: true });
    }
  }, [itemData, itemId, navigate]);
  const calculateDays = () => {
    if (!returnDate) return 0;
    const diffTime = Math.abs(returnDate.getTime() - borrowDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    return { daysInMonth, startingDayOfWeek };
  };

  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    setReturnDate(selectedDate);
    setShowCalendar(false);
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const handleBorrow = async () => {
    // Prevent double submission using ref
    if (isSubmittingRef.current) {
      return;
    }

    if (!returnDate) {
      showError("Please select a return date");
      return;
    }

    if (!scannedQrCode) {
      showError("QR code is required");
      navigate(`/items/${itemId}`, { replace: true });
      return;
    }

    isSubmittingRef.current = true;

    try {
      // Refetch item data to ensure it's still available
      const { data: latestItemData } = await refetch();

      if (latestItemData && latestItemData.status !== "AVAILABLE") {
        showError(
          `This item is currently ${latestItemData.status.toLowerCase()} and cannot be borrowed.`
        );
        navigate(`/items/${itemId}`, { replace: true });
        isSubmittingRef.current = false;
        return;
      }

      // Format the return date to ISO string
      const returnDateTime = new Date(returnDate);
      returnDateTime.setHours(23, 59, 59, 999);
      const formattedReturnDate = returnDateTime.toISOString();

      const payload = {
        qr_code: scannedQrCode,
        return_date: formattedReturnDate,
      };

      // Use mutateAsync to await the result
      await borrowMutation.mutateAsync(payload);
    } catch (error: unknown) {
      console.error("Borrow error:", error);
    } finally {
      isSubmittingRef.current = false;

      // Always navigate to history page and reload
      queryClient.invalidateQueries({ queryKey: ["history", "users"] });
      queryClient.invalidateQueries({ queryKey: ["items", itemId] });
      navigate("/history", { replace: true });
      window.location.reload();
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-screen-lg">
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-theme-purple border-t-transparent rounded-full animate-spin" />
          <p className="mt-2 text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!itemData) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-screen-lg">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-red-600">Item not found</h2>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="container mx-auto max-w-screen-lg pb-24 px-4">
      <h1 className="text-2xl font-bold text-theme-purple mb-6">
        Confirmation
      </h1>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="relative h-48 bg-gray-100">
          {itemData.images && itemData.images.length > 0 ? (
            <Image
              src={itemData.images[0]}
              alt={itemData.name}
              fill
              objectFit="cover"
              className="absolute inset-0"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Calendar className="h-16 w-16 text-gray-300" />
            </div>
          )}
        </div>
        <div className="p-4">
          <h2 className="text-xl font-bold text-theme-heading mb-2">
            {itemData.name}
          </h2>
          <p className="text-sm text-theme-description">
            Club: {clubData?.data?.name || "Loading..."}
          </p>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-bold text-theme-heading mb-4">
          Borrowing Details
        </h3>
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
          <span className="text-theme-description text-sm">Borrowed by</span>
          <span className="text-theme-purple font-semibold">
            {userName || "Loading..."}
          </span>
        </div>
        <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-100">
          <span className="text-theme-description text-sm">Borrow Date</span>
          <div className="flex items-center gap-2 text-right">
            <Calendar className="h-4 w-4 text-theme-purple" />
            <span className="text-theme-heading font-medium text-sm">
              {formatDate(borrowDate)}
            </span>
          </div>
        </div>
        <div className="relative mb-4">
          <div className="flex items-start justify-between">
            <span className="text-theme-description text-sm">
              Return Due Date
            </span>
            <div className="flex items-center gap-2 text-right">
              <Calendar className="h-4 w-4 text-theme-purple" />
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="text-theme-heading font-medium text-sm hover:text-theme-purple transition-colors"
              >
                {returnDate ? formatDate(returnDate) : "Select return date"}
              </button>
            </div>
          </div>
          {showCalendar && (
            <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-200 p-4 z-50 w-80">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={handlePreviousMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="font-semibold text-theme-heading">
                  {currentMonth.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <button
                  onClick={handleNextMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center">
                {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                  <div
                    key={i}
                    className="text-xs font-semibold text-theme-description py-2"
                  >
                    {day}
                  </div>
                ))}
                {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} className="py-2" />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const date = new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth(),
                    day
                  );
                  const isToday =
                    date.toDateString() === new Date().toDateString();
                  const isSelected =
                    returnDate &&
                    date.toDateString() === returnDate.toDateString();
                  const isPast = date < today;
                  return (
                    <button
                      key={day}
                      onClick={() => !isPast && handleDateSelect(day)}
                      disabled={isPast}
                      className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                        isPast
                          ? "text-gray-300 cursor-not-allowed"
                          : "hover:bg-gray-100"
                      } ${
                        isSelected
                          ? "bg-theme-purple text-white hover:bg-theme-purple-dark"
                          : ""
                      } ${
                        isToday && !isSelected
                          ? "border-2 border-theme-purple"
                          : ""
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        {returnDate && (
          <div className="text-sm text-theme-description mb-4">
            ({calculateDays()}-days)
          </div>
        )}
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-bold text-theme-heading mb-3">
          Responsibility Agreement
        </h3>
        <p className="text-sm text-theme-description leading-relaxed">
          By proceeding, you agree to return this item and all its components in
          good condition. You are responsible for any damage or loss.
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
            onClick={handleBorrow}
            disabled={
              !returnDate || isSubmittingRef.current || borrowMutation.isPending
            }
            className="flex-1 py-4 text-base font-semibold shadow-lg"
          >
            {isSubmittingRef.current || borrowMutation.isPending
              ? "Borrowing..."
              : "Borrow this item"}
          </Button>
        </div>
      </div>
    </div>
  );
}
