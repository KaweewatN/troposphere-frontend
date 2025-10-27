import { useDispatch } from "react-redux";
import { clearUserProfile } from "../../shared/store/slices/userSlice";
import { signOut } from "../../entities/users/api/user.authentication";
import { useUserProfile } from "../../hooks/useUserProfile";
import { Avatar, Badge } from "../../components/ui";
import { LogOut, Mail, User, Shield } from "lucide-react";

export function Profile() {
  const dispatch = useDispatch();
  const { name, email, picture, isLoading } = useUserProfile();

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
          <div className="h-32 bg-gradient-to-r from-indigo-300 via-70% to-purple-300"></div>

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

              {/* Role Card */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 transition-all hover:shadow-md hover:border-slate-300">
                <div className="flex-shrink-0 w-10 h-10 bg-theme-purple-light/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-theme-purple-dark" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-theme-description uppercase tracking-wide">
                    Account Role
                  </p>
                  <div className="mt-1">
                    <Badge variant="blue" className="font-semibold">
                      User
                    </Badge>
                  </div>
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

            {/* Action Buttons */}
            <div className="mt-8 flex gap-3">
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

        {/* Additional Info Footer */}
        <div className="mt-6 text-center">
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
    </div>
  );
}
