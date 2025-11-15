import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchItemId, useBorrowItem } from "../../../entities/items";
import { useSearchClubDetails } from "../../../entities/clubs";
import { Image, Button } from "../../../components/ui";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useUserProfile } from "../../../hooks";

export default function ConfirmBorrow() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const itemId = parseInt(id || "0", 10);

    const [borrowDate] = useState<Date>(new Date());
    const [returnDate, setReturnDate] = useState<Date | null>(null);
    const [showCalendar, setShowCalendar] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successData, setSuccessData] = useState<{ message: string; item_name: string } | null>(null);

    const { data: itemData, isLoading } = useSearchItemId(itemId);
    const { data: clubData } = useSearchClubDetails(itemData?.club_id || 0);
    const { name: userName } = useUserProfile();
    const borrowMutation = useBorrowItem(); const calculateDays = () => {
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

    const handleBorrow = () => {
        if (!returnDate) {
            alert("Please select a return date");
            return;
        }

        if (!itemData?.qr_code || !itemData?.club_id) {
            alert("Item information is incomplete");
            return;
        }

        // Format the return date with proper time component
        // Set to end of day (23:59:59) in local timezone
        const returnDateTime = new Date(returnDate);
        returnDateTime.setHours(23, 59, 59, 999);
        const formattedReturnDate = returnDateTime.toISOString();

        const payload = {
            club_id: itemData.club_id,
            item_id: itemData.id,
            qr_code: itemData.qr_code,
            return_date: formattedReturnDate,
        };

        borrowMutation.mutate(
            payload,
            {
                onSuccess: (data) => {
                    // Invalidate history query to refetch latest data
                    queryClient.invalidateQueries({ queryKey: ["history", "users"] });
                    setSuccessData(data);
                    setShowSuccessModal(true);
                },
                onError: (error: any) => {
                    const errorMessage = error.response?.data?.message || error.message || "Unknown error occurred";
                    alert(`Failed to borrow item: ${errorMessage}`);
                    console.error("Borrow error:", error);
                },
            }
        );
    };

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        navigate("/history");
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
                    <Button onClick={() => navigate(-1)} className="mt-4">Go Back</Button>
                </div>
            </div>
        );
    }

    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
        <div className="container mx-auto max-w-screen-lg pb-24 px-4">
            <h1 className="text-2xl font-bold text-theme-purple mb-6">Confirmation</h1>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                <div className="relative h-48 bg-gray-100">
                    {itemData.images && itemData.images.length > 0 ? (
                        <Image src={itemData.images[0]} alt={itemData.name} fill objectFit="cover" className="absolute inset-0" />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Calendar className="h-16 w-16 text-gray-300" />
                        </div>
                    )}
                </div>
                <div className="p-4">
                    <h2 className="text-xl font-bold text-theme-heading mb-2">{itemData.name}</h2>
                    <p className="text-sm text-theme-description">Club: {clubData?.data?.name || "Loading..."}</p>
                </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                <h3 className="text-lg font-bold text-theme-heading mb-4">Borrowing Details</h3>
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                    <span className="text-theme-description text-sm">Borrowed by</span>
                    <span className="text-theme-purple font-semibold">{userName || "Loading..."}</span>
                </div>
                <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-100">
                    <span className="text-theme-description text-sm">Borrow Date</span>
                    <div className="flex items-center gap-2 text-right">
                        <Calendar className="h-4 w-4 text-theme-purple" />
                        <span className="text-theme-heading font-medium text-sm">{formatDate(borrowDate)}</span>
                    </div>
                </div>
                <div className="relative mb-4">
                    <div className="flex items-start justify-between">
                        <span className="text-theme-description text-sm">Return Due Date</span>
                        <div className="flex items-center gap-2 text-right">
                            <Calendar className="h-4 w-4 text-theme-purple" />
                            <button onClick={() => setShowCalendar(!showCalendar)} className="text-theme-heading font-medium text-sm hover:text-theme-purple transition-colors">
                                {returnDate ? formatDate(returnDate) : "Select return date"}
                            </button>
                        </div>
                    </div>
                    {showCalendar && (
                        <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-200 p-4 z-50 w-80">
                            <div className="flex items-center justify-between mb-4">
                                <button onClick={handlePreviousMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                <span className="font-semibold text-theme-heading">{currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
                                <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="grid grid-cols-7 gap-1 text-center">
                                {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                                    <div key={i} className="text-xs font-semibold text-theme-description py-2">{day}</div>
                                ))}
                                {Array.from({ length: startingDayOfWeek }).map((_, i) => (<div key={`empty-${i}`} className="py-2" />))}
                                {Array.from({ length: daysInMonth }).map((_, i) => {
                                    const day = i + 1;
                                    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                                    const isToday = date.toDateString() === new Date().toDateString();
                                    const isSelected = returnDate && date.toDateString() === returnDate.toDateString();
                                    const isPast = date < today;
                                    return (
                                        <button key={day} onClick={() => !isPast && handleDateSelect(day)} disabled={isPast} className={`py-2 rounded-lg text-sm font-medium transition-colors ${isPast ? "text-gray-300 cursor-not-allowed" : "hover:bg-gray-100"} ${isSelected ? "bg-theme-purple text-white hover:bg-theme-purple-dark" : ""} ${isToday && !isSelected ? "border-2 border-theme-purple" : ""}`}>
                                            {day}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
                {returnDate && (<div className="text-sm text-theme-description mb-4">({calculateDays()}-days)</div>)}
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                <h3 className="text-lg font-bold text-theme-heading mb-3">Responsibility Agreement</h3>
                <p className="text-sm text-theme-description leading-relaxed">By proceeding, you agree to return this item and all its components in good condition. You are responsible for any damage or loss.</p>
            </div>
            <div className="fixed bottom-20 left-0 right-0 px-5 max-w-screen-sm mx-auto">
                <div className="flex gap-3">
                    <button onClick={() => navigate(-1)} className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center bg-white border-2 border-gray-300 hover:border-gray-400 transition-all shadow-lg">
                        <ChevronLeft className="h-6 w-6 text-gray-600" />
                    </button>
                    <Button onClick={handleBorrow} disabled={!returnDate || borrowMutation.isPending} className="flex-1 py-4 text-base font-semibold shadow-lg">
                        {borrowMutation.isPending ? "Borrowing..." : "Borrow this item"}
                    </Button>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccessModal && successData && (
                <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in fade-in zoom-in duration-300">
                        {/* Success Icon */}
                        <div className="bg-gradient-to-br from-green-400 to-green-600 pt-8 pb-6 px-6 text-center">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Successfully Borrowed!</h2>
                            <p className="text-green-50 text-sm">Your borrowing request has been confirmed</p>
                        </div>

                        {/* Details */}
                        <div className="p-6 space-y-4">
                            <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-theme-purple bg-opacity-10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Calendar className="w-4 h-4 text-theme-purple" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Item Name</p>
                                        <p className="font-semibold text-theme-heading text-lg">{successData.item_name}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Calendar className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Borrowed By</p>
                                        <p className="font-semibold text-theme-heading">{userName}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Calendar className="w-4 h-4 text-orange-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Borrow Date</p>
                                        <p className="font-semibold text-theme-heading">{formatDate(borrowDate)}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Calendar className="w-4 h-4 text-red-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Return Date</p>
                                        <p className="font-semibold text-theme-heading">{returnDate && formatDate(returnDate)}</p>
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-gray-200">
                                    <p className="text-sm text-gray-600 text-center">
                                        Duration: <span className="font-semibold text-theme-purple">{calculateDays()} days</span>
                                    </p>
                                </div>
                            </div>

                            <Button onClick={handleCloseSuccessModal} className="w-full py-3 text-base font-semibold">
                                View My History
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
