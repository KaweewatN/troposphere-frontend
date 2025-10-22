import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { setAuthTokens } from "../shared/lib/auth";

/**
 * Custom hook to handle OAuth authentication callback
 *
 * Features:
 * - Captures token from URL parameters after OAuth redirect
 * - Stores token in localStorage using setAuthTokens utility
 * - Redirects to home page after storing token
 * - Cleans up URL by removing token parameters
 */
export function useAuthCallback() {
  const location = useLocation();
  const navigate = useNavigate();

  // Handle authentication callback with token in URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");

    if (token) {
      // Use the setAuthTokens utility to store token properly
      setAuthTokens({
        access_token: token,
        token_type: "bearer",
        expires_at: Date.now() + 3600000, // 1 hour from now
      });

      // Clean up URL by removing the token parameter and redirect to home
      navigate("/", { replace: true });
    }
  }, [location.search, navigate]);

  // Global check for auth callback - handles when backend redirects to itself
  useEffect(() => {
    if (location.pathname === "/auth/google/callback") {
      // Already on the callback route, let it handle
      return;
    }
  }, [location, navigate]);
}
