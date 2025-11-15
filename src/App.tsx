import { Routes, Route } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { queryClient as defaultQueryClient } from "./shared/lib/react-query";
import { store } from "./shared/store";
import { useAuthCallback } from "./hooks";
import { ProtectedRoute, ModeratorRoute, AdminRoute } from "./components/auth";
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
  ApproveItem,
  ModeratorHome,
  MemberManagement,
  AddMemberToClub,
  MyClubs,
  ModeratorProfile,
} from "./pages/moderator";
import {
  AdminProfile,
  AdminHome,
  AdminMemberManagement,
  AdminAddMemberToClub,
  AdminApproveItem,
  AdminMyClubs,
  AdminClubManagement,
  AdminAddItem,
} from "./pages/admin";
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
        {/* Admin Routes */}
        <Route
          path="/admin/myclubs"
          element={
            <AdminRoute>
              <AdminMyClubs />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/:id/club-management"
          element={
            <AdminRoute>
              <AdminClubManagement />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/:id/club-management/add-item"
          element={
            <AdminRoute>
              <AdminAddItem />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/:id/approve-item"
          element={
            <AdminRoute>
              <AdminApproveItem />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/:id/member-management"
          element={
            <AdminRoute>
              <AdminMemberManagement />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/:id/member-management/add-member"
          element={
            <AdminRoute>
              <AdminAddMemberToClub />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/:id/home"
          element={
            <AdminRoute>
              <AdminHome />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <AdminRoute>
              <AdminProfile />
            </AdminRoute>
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
