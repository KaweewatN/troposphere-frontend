import { useEffect } from "react";
import { useGetUserProfile } from "../entities/users";
import { useAppDispatch, useAppSelector } from "../shared/store/hooks";
import { setUserProfile } from "../shared/store/slices/userSlice";

/**
 * Custom hook to fetch and manage user profile in Redux
 * - Fetches profile only if not already loaded in Redux
 * - Stores profile data globally for reuse across the app
 * - Returns profile data, loading state, and error
 */
export function useUserProfile() {
  const dispatch = useAppDispatch();
  const { profile, isLoaded } = useAppSelector((state) => state.user);

  // Only fetch if profile is not already loaded
  const shouldFetch = !isLoaded;
  const {
    data: profileResponse,
    isLoading,
    error,
  } = useGetUserProfile({
    enabled: shouldFetch,
  });

  // Store profile in Redux when fetched
  useEffect(() => {
    if (profileResponse?.data && !isLoaded) {
      dispatch(setUserProfile(profileResponse.data));
    }
  }, [profileResponse, isLoaded, dispatch]);

  return {
    profile: profile || profileResponse?.data || null,
    isLoading: !isLoaded && isLoading,
    error,
    name: profile?.name || profileResponse?.data?.name || "",
    email: profile?.email || profileResponse?.data?.email || "",
    picture: profile?.picture || profileResponse?.data?.picture || null,
  };
}
