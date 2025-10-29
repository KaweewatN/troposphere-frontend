import { Routes, Route, useLocation } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { queryClient as defaultQueryClient } from "./shared/lib/react-query";
import { store } from "./shared/store";
import { useAuthCallback } from "./hooks";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Navigation from "./components/navigation/Navigation";
import {
  Home,
  SearchClubs,
  Clubs,
  ClubsMembers,
  ItemDetail,
  History,
} from "./pages/user";
import NotFound from "./pages/not-found/NotFound";
import Signin from "./pages/signin";
import { Profile } from "./pages/shared";

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
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
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
        <Route
          path="/clubs/:id"
          element={
            <ProtectedRoute>
              <Clubs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clubs/:id/members"
          element={
            <ProtectedRoute>
              <ClubsMembers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/items/:id/"
          element={
            <ProtectedRoute>
              <ItemDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
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
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <div className="mx-auto min-h-screen max-w-screen-sm">
          <AppContent />
        </div>
      </QueryClientProvider>
    </Provider>
  );
}
