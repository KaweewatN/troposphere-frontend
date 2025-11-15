import { X } from "lucide-react";
import type { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  icon?: ReactNode;
  titleColor?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  icon,
  titleColor = "text-slate-900",
  maxWidth = "md",
}: ModalProps) {
  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 px-4">
      <div
        className={`bg-white rounded-2xl p-6 shadow-2xl w-full ${maxWidthClasses[maxWidth]}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3
            className={`text-xl font-bold ${titleColor} flex items-center gap-2`}
          >
            {icon}
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
}
