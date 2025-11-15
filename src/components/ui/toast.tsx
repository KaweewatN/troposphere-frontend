import { toast, Bounce } from "react-toastify";
import type { ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Default toast configuration
const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  transition: Bounce,
};

// Success notification
export const showSuccess = (message: string, options?: ToastOptions) => {
  toast.success(message, {
    ...defaultOptions,
    ...options,
  });
};

// Error notification
export const showError = (message: string, options?: ToastOptions) => {
  toast.error(message, {
    ...defaultOptions,
    ...options,
  });
};

// Warning notification
export const showWarning = (message: string, options?: ToastOptions) => {
  toast.warning(message, {
    ...defaultOptions,
    ...options,
  });
};

// Info notification (bonus)
export const showInfo = (message: string, options?: ToastOptions) => {
  toast.info(message, {
    ...defaultOptions,
    ...options,
  });
};

// Generic toast with custom type
export const showToast = (
  message: string,
  type: "success" | "error" | "warning" | "info" = "info",
  options?: ToastOptions
) => {
  toast[type](message, {
    ...defaultOptions,
    ...options,
  });
};
