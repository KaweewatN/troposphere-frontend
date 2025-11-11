import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../../shared/lib/auth";
import { useEffect, useState } from "react";
import { ModeratorNavigation } from "../navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Protected Route Component
 * Redirects to signin page if user is not authenticated
 * Checks localStorage for auth token
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isClient, setIsClient] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  const location = useLocation();
  const showNavigation =
    location.pathname !== "/signin" &&
    location.pathname !== "/auth/google/callback";

  useEffect(() => {
    // Mark as client-side after mount
    setIsClient(true);

    // Small delay to ensure any pending localStorage operations are complete
    const timer = setTimeout(() => {
      setIsAuthChecked(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  // During SSR or while checking auth, render nothing to avoid flickering
  if (!isClient || !isAuthChecked) {
    return null;
  }

  // On client side, check authentication from localStorage
  const authenticated = isAuthenticated();

  if (!authenticated) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div className="pt-7 px-5">
      {children}
      {showNavigation && <ModeratorNavigation />}
    </div>
  );
}
