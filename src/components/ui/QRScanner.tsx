import { useEffect, useRef, useState } from "react";
import { X, Camera } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (decodedText: string) => void;
  timeout?: number; // in milliseconds, default 15000 (15 seconds)
}

export function QRScanner({
  isOpen,
  onClose,
  onScan,
  timeout = 15000,
}: QRScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>("");
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const startScanner = async () => {
      try {
        setIsScanning(true);
        setError("");

        // Initialize scanner
        const html5QrCode = new Html5Qrcode("qr-reader");
        scannerRef.current = html5QrCode;

        // Start scanning
        await html5QrCode.start(
          { facingMode: "environment" }, // Use back camera
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            // Success callback
            onScan(decodedText);
            stopScanner();
          },
          () => {
            // Error callback (optional, for continuous scanning)
          }
        );

        // Set timeout to auto-close after specified time
        timeoutRef.current = setTimeout(() => {
          stopScanner();
          onClose();
        }, timeout);
      } catch (err) {
        console.error("Error starting QR scanner:", err);
        setError("Failed to access camera. Please check permissions.");
        setIsScanning(false);
      }
    };

    const stopScanner = async () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      if (scannerRef.current && scannerRef.current.isScanning) {
        try {
          await scannerRef.current.stop();
          scannerRef.current.clear();
        } catch (err) {
          console.error("Error stopping scanner:", err);
        }
      }
      setIsScanning(false);
    };

    startScanner();

    return () => {
      stopScanner();
    };
  }, [isOpen, onScan, onClose, timeout]);

  const handleClose = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black text-white">
        <div className="flex items-center gap-3">
          <Camera className="h-6 w-6" />
          <h2 className="text-lg font-semibold">Scan QR Code</h2>
        </div>
        <button
          onClick={handleClose}
          className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          aria-label="Close scanner"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Scanner Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="relative w-full max-w-sm">
          {/* QR Reader Container */}
          <div
            id="qr-reader"
            className="w-full rounded-lg overflow-hidden shadow-2xl"
          />

          {/* Scanning Indicator */}
          {isScanning && !error && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-64 h-64 border-4 border-theme-purple rounded-lg animate-pulse" />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 rounded-lg">
              <div className="text-center text-white p-4">
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 text-center text-white max-w-sm">
          <p className="text-sm opacity-75">
            Position the QR code within the frame to scan
          </p>
          <p className="text-xs opacity-50 mt-2">
            Auto-closing in {timeout / 1000} seconds
          </p>
        </div>
      </div>
    </div>
  );
}
