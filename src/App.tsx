import { Routes, Route } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { queryClient as defaultQueryClient } from "./shared/lib/react-query";
import { store } from "./shared/store";
import { useAuthCallback } from "./hooks";
import { ProtectedRoute, ModeratorRoute } from "./components/auth";
import {
  Home,
  SearchClubs,
  Clubs,
  ClubsMembers,
  ItemDetail,
  History,
} from "./pages/user";
import NotFound from "./pages/not-found/NotFound";
import {
  ClubManagement,
  AddItem,
  ApproveItem,
  ModeratorHome,
  MemberManagement,
  AddMemberToClub,
  MyClubs,
  AddNewItem,
  ModeratorProfile,
} from "./pages/moderator";
import Signin from "./pages/signin";
import { Profile } from "./pages/shared";

interface AppProps {
  queryClient?: QueryClient;
}

function AppContent() {
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
        {/* Moderator Routes */}
        <Route
          path="/moderator/myclubs"
          element={
            <ModeratorRoute>
              <MyClubs />
            </ModeratorRoute>
          }
        />
        <Route
          path="/moderator/:id/club-management"
          element={
            <ModeratorRoute>
              <ClubManagement />
            </ModeratorRoute>
          }
        />
        <Route
          path="/moderator/:id/add-item"
          element={
            <ModeratorRoute>
              <AddItem />
            </ModeratorRoute>
          }
        />
        <Route
          path="/moderator/add-item/:id"
          element={
            <ModeratorRoute>
              <AddNewItem />
            </ModeratorRoute>
          }
        />
        <Route
          path="/moderator/:id/approve-item"
          element={
            <ModeratorRoute>
              <ApproveItem />
            </ModeratorRoute>
          }
        />
        <Route
          path="/moderator/:id/member-management"
          element={
            <ModeratorRoute>
              <MemberManagement />
            </ModeratorRoute>
          }
        />
        <Route
          path="/moderator/:id/member-management/add-member"
          element={
            <ModeratorRoute>
              <AddMemberToClub />
            </ModeratorRoute>
          }
        />
        <Route
          path="/moderator/:id/home"
          element={
            <ModeratorRoute>
              <ModeratorHome />
            </ModeratorRoute>
          }
        />
        <Route
          path="/moderator/profile"
          element={
            <ModeratorRoute>
              <ModeratorProfile />
            </ModeratorRoute>
          }
        />
      </Routes>
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
          <ToastContainer />
        </div>
      </QueryClientProvider>
    </Provider>
  );
}
