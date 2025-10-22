import { Routes, Route, useLocation } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { queryClient as defaultQueryClient } from "./shared/lib/react-query";
import { useAuthCallback } from "./hooks";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Navigation from "./components/navigation/Navigation";
import Home from "./pages/user/home/Home";
import NotFound from "./pages/not-found/NotFound";
import Signin from "./pages/signin";
import SearchClubs from "./pages/search-club";

interface AppProps {
  queryClient?: QueryClient;
}

function AppContent() {
  const location = useLocation();
  const showNavigation =
    location.pathname !== "/signin" &&
    location.pathname !== "/auth/google/callback";

  // Handle OAuth callback and token storage
  useAuthCallback();

  return (
    <>
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/auth/google/callback" element={<Signin />} />
        <Route path="*" element={<NotFound />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search-clubs"
          element={
            <ProtectedRoute>
              <SearchClubs />
            </ProtectedRoute>
          }
        />
      </Routes>
      {showNavigation && <Navigation />}
    </>
  );
}

export default function App({
  queryClient = defaultQueryClient,
}: AppProps = {}) {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="mx-auto min-h-screen max-w-screen-sm">
        <AppContent />
      </div>
    </QueryClientProvider>
  );
}
