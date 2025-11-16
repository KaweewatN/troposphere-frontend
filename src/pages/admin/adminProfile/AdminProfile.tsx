import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearUserProfile } from "../../../shared/store/slices/userSlice";
import { signOut } from "../../../entities/users/api/user.authentication";
import { useUserProfile } from "../../../hooks/useUserProfile";
import { Avatar, Badge } from "../../../components/ui";
import {
  LogOut,
  Mail,
  User,
  Users,
  Calendar,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import AdminNavigation from "../../../components/navigation/AdminNavigation";

export function AdminProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { name, email, picture, memberships, created_at, isLoading } =
    useUserProfile();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    dispatch(clearUserProfile());
    signOut();
  };

  return (
    <div className="bg-gradient-to-br">
      <div className="max-w-2xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Background */}
          <div className="h-32 bg-gradient-to-r from-yellow-200 via-70% to-orange-300"></div>

          {/* Profile Content */}
          <div className="px-8 pb-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center -mt-16">
              <div className="relative">
                <Avatar
                  src={picture || undefined}
                  name={name}
                  size={"2xl"}
                  className="ring-4 ring-white"
                />
                <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full ring-4 ring-white"></div>
              </div>

              {/* Name and Title */}
              <h1 className="mt-4 text-2xl font-bold text-slate-900">
                {name ?? "Unknown User"}
              </h1>
            </div>

            {/* Information Cards */}
            <div className="mt-8 space-y-4">
              {/* Email Card */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 transition-all hover:shadow-md hover:border-slate-300">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-theme-description uppercase tracking-wide">
                    Email Address
                  </p>
                  <p className="mt-1 text-slate-900 font-medium truncate text-sm">
                    {email ?? "No email provided"}
                  </p>
                </div>
              </div>

              {/* Account Created Card */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 transition-all hover:shadow-md hover:border-slate-300">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-theme-description uppercase tracking-wide">
                    Member Since
                  </p>
                  <p className="mt-1 text-slate-900 font-medium text-sm">
                    {new Date(created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Account Status Card */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 transition-all hover:shadow-md hover:border-slate-300">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-theme-description uppercase tracking-wide">
                    Status
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-slate-900 font-medium">Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Memberships Section */}
            {memberships.length > 0 && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 mt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-5 h-5 text-indigo-600" />
                  <p className="text-xs font-semibold text-theme-description uppercase tracking-wide">
                    Club Memberships ({memberships.length})
                  </p>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {memberships.map((membership) => {
                    // Show arrow link for all roles to switch between clubs
                    let switchButton = null;
                    if (membership.role === "MEMBER") {
                      switchButton = (
                        <button
                          onClick={() => navigate("/profile")}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Go to Member Profile"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      );
                    } else if (membership.role === "MODERATOR") {
                      switchButton = (
                        <button
                          onClick={() => navigate("/moderator/profile")}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                          title="Go to Moderator Profile"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      );
                    } else if (membership.role === "ADMIN") {
                      switchButton = (
                        <button
                          onClick={() =>
                            navigate(`/admin/${membership.club_id}/home`)
                          }
                          className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors cursor-pointer"
                          title="Switch to this Admin Club"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      );
                    }

                    return (
                      <div
                        key={membership.club_id}
                        className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-900">
                            {membership.club_name
                              ? membership.club_name
                              : `Club ID: ${membership.club_id}`}
                          </p>
                          <p className="text-xs text-slate-500">
                            Joined:{" "}
                            {new Date(
                              membership.joined_at
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              membership.role === "ADMIN"
                                ? "yellow"
                                : membership.role === "MODERATOR"
                                ? "purple"
                                : "blue"
                            }
                            className="font-semibold"
                          >
                            {membership.role}
                          </Badge>
                          {switchButton}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 space-y-3">
              {/* Switch to Moderator Profile if user has any moderator role */}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    navigate(`/`);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-xl font-semibold transition-all hover:bg-blue-50 shadow-sm hover:shadow-md cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Members
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-red-600 text-red-600 rounded-xl font-semibold transition-all hover:bg-red-600 hover:text-white shadow-sm hover:shadow-md cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Footer */}
        <div className="mt-6 text-center pb-20">
          <p className="text-sm text-theme-description">
            Need help?{" "}
            <a
              href="#"
              className="text-theme-purple hover:text-theme-purple-dark font-semibold"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>

      {/* Always show AdminNavigation */}
      <AdminNavigation />
    </div>
  );
}
