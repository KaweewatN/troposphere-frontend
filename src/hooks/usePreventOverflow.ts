import { useEffect } from "react";

/**
 * Custom hook to prevent body overflow (scrolling) when component is mounted
 * Automatically restores original overflow value on unmount
 */
export function usePreventOverflow() {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);
}
