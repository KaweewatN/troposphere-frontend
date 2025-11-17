import { Navigate, useLocation, useParams } from "react-router-dom";
import { isAuthenticated } from "../../shared/lib/auth";
import { useEffect, useState } from "react";
import { ModeratorNavigation } from "../navigation";
import { useUserProfile } from "../../hooks/useUserProfile";
import { ShieldAlert } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Moderator Route Component
 * - Redirects to signin page if user is not authenticated
 * - Checks if user is a moderator of the specific club
 * - Shows error page if user is not authorized for the club
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isClient, setIsClient] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  const location = useLocation();
  const params = useParams<{ id: string }>();
  const clubId = params.id ? parseInt(params.id, 10) : null;

  const { memberships, isLoading } = useUserProfile();

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

  // Show loading while fetching user profile
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
          <p className="mt-4 text-slate-600 font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Check if user has moderator role in any club
  const isModerator = memberships.some((m) => m.role === "MODERATOR");

  if (!isModerator) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            Access Denied
          </h2>
          <p className="text-slate-600 mb-6">
            You cannot access this page. You need moderator privileges to view
            this content.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-theme-purple text-white rounded-xl font-semibold hover:bg-theme-purple transition-colors mr-3"
          >
            Go Back
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="px-6 py-3 bg-white border-2 border-theme-purple text-theme-purple rounded-xl font-semibold hover:bg-theme-purple/10 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // If clubId exists in URL, check if user is moderator of that specific club
  if (clubId !== null && !isNaN(clubId)) {
    const isModeratorOfClub = memberships.some(
      (m) => m.role === "MODERATOR" && m.club_id === clubId
    );

    if (!isModeratorOfClub) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldAlert className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Access Denied
            </h2>
            <p className="text-slate-600 mb-2">You cannot access this page.</p>
            <p className="text-slate-500 text-sm mb-6">
              You are not a moderator of club ID: {clubId}
            </p>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-theme-purple text-white rounded-xl font-semibold hover:bg-theme-purple transition-colors mr-3"
            >
              Go Back
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              className="px-6 py-3 bg-white border-2 border-theme-purple text-theme-purple rounded-xl font-semibold hover:bg-theme-purple/10 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="pt-7 px-5">
      {children}
      {showNavigation && <ModeratorNavigation />}
    </div>
  );
}
