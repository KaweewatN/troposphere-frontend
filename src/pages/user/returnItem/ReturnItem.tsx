import { useParams, useNavigate, useLocation } from "react-router-dom";
import type { UserHistory } from "../../../entities/users/types";
import { Badge, Button, QRScanner, showError } from "../../../components/ui";
import { ArrowLeft, Calendar, Package } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchUserHistory } from "../../../entities/users/api";

export default function ReturnItem() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const transactionId = parseInt(id || "0", 10);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);

  // Get transaction data from navigation state
  const transaction = location.state?.transaction as UserHistory | undefined;

  // Fetch user history to get item_qr_code
  const { data: userHistory } = useSearchUserHistory();

  // Find the current transaction in user history
  // Extend UserHistory type to include item_qr_code for local use
  type UserHistoryWithQR = UserHistory & { item_qr_code?: string };
  const currentHistory = userHistory?.data?.find(
    (h: UserHistoryWithQR) => h.transaction_id === transactionId
  );

  console.log("Transaction data:", currentHistory);

  // Use item_qr_code from history (fallback to undefined if not present)
  const item_qr_code = (currentHistory as UserHistoryWithQR)?.item_qr_code;

  console.log("User history data:", userHistory);

  // Redirect if no transaction data
  useEffect(() => {
    if (!transaction) {
      navigate("/history");
    }
  }, [transaction, navigate]);

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Extract category from item name (simple heuristic)
  const getCategory = (name: string): string => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("camera")) return "Camera";
    if (lowerName.includes("printer") || lowerName.includes("3d"))
      return "3D Printer";
    if (lowerName.includes("drone")) return "Drone";
    if (lowerName.includes("laptop") || lowerName.includes("computer"))
      return "Computer";
    if (lowerName.includes("arduino") || lowerName.includes("kit"))
      return "Electronics Kit";
    return "Equipment";
  };

  if (!transactionId || isNaN(transactionId) || !transaction) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-screen-lg">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-red-600">
            Invalid Transaction
          </h2>
          <Button onClick={() => navigate("/history")} className="mt-4">
            Back to History
          </Button>
        </div>
      </div>
    );
  }

  const category = getCategory(transaction.item_name);

  // Handle QR scan and validate
  const handleQRScan = (qrCode: string) => {
    setIsQRScannerOpen(false);
    // Validate scanned QR code matches item_qr_code from user history
    if (!item_qr_code) {
      showError("Unable to validate item QR code.");
      return;
    }
    if (qrCode !== item_qr_code) {
      showError("Scanned QR code does not match this item.");
      return;
    }
    // Pass item_club_id and item_qr_code to confirmation page
    navigate(`/items/return/${transactionId}/confirm`, {
      state: {
        scannedQrCode: qrCode,
        transaction: transaction,
        item_club_id: transaction.item_club_id,
        item_qr_code: item_qr_code,
      },
    });
  };

  // Handle opening QR scanner
  const handleReturnClick = () => {
    setIsQRScannerOpen(true);
  };

  // Handle closing QR scanner
  const handleCloseScanner = () => {
    setIsQRScannerOpen(false);
  };

  return (
    <div className="container mx-auto max-w-screen-lg pb-24">
      {/* Back Button */}
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-theme-purple hover:text-theme-purple-dark transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back
        </button>
      </div>

      {/* Item Image - Placeholder since we don't have image from transaction */}
      <div className="relative w-full bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl overflow-hidden mb-6">
        <div className="aspect-video relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <Package className="h-24 w-24 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Category Badge */}
      <div className="mb-3">
        <Badge variant="gray" className="text-sm px-3 py-1.5">
          {category}
        </Badge>
      </div>

      {/* Item Title */}
      <h1 className="text-3xl font-bold text-theme-heading mb-6">
        {transaction.item_name}
      </h1>

      {/* Return Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
        <h3 className="text-lg font-bold text-blue-900 mb-2">
          Return Instructions
        </h3>
        <p className="text-sm text-blue-700">
          Please scan the QR code on the item to confirm you are returning the
          correct item. Make sure the item is in good condition before
          proceeding.
        </p>
      </div>

      {/* Metadata Section */}
      <div className="bg-white rounded-2xl border border-theme-primary-border divide-y divide-gray-100 mb-6">
        {/* Category Row */}
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-sm text-theme-description font-medium">
              Category
            </span>
          </div>
          <span className="text-theme-heading font-semibold">{category}</span>
        </div>

        {/* Item Status Row */}
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center">
              <Package className="h-5 w-5 text-yellow-600" />
            </div>
            <span className="text-sm text-theme-description font-medium">
              Status
            </span>
          </div>
          <Badge variant="yellow" className="font-semibold capitalize">
            {transaction.status}
          </Badge>
        </div>

        {/* Borrow Date Row */}
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
            <span className="text-sm text-theme-description font-medium">
              Borrowed Date
            </span>
          </div>
          <span className="text-theme-heading font-semibold">
            {formatDate(transaction.borrow_date)}
          </span>
        </div>

        {/* Return Date Row */}
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-red-600" />
            </div>
            <span className="text-sm text-theme-description font-medium">
              Expected Return Date
            </span>
          </div>
          <span className="text-theme-heading font-semibold">
            {formatDate(transaction.return_date)}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <div className="fixed bottom-20 left-0 right-0 px-5 max-w-screen-sm mx-auto">
        <Button
          onClick={handleReturnClick}
          className="w-full py-4 text-base font-semibold shadow-lg bg-blue-600 hover:bg-blue-700"
        >
          Scan QR Code to Return
        </Button>
      </div>

      {/* QR Scanner Modal */}
      <QRScanner
        isOpen={isQRScannerOpen}
        onClose={handleCloseScanner}
        onScan={handleQRScan}
        timeout={15000}
      />
    </div>
  );
}
