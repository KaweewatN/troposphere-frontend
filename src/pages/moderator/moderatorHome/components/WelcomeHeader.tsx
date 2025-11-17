import { Avatar, Badge } from "../../../../components/ui";
import { getCurrentDate, getGreeting } from "../../../../shared/utils";
import { useUserProfile } from "../../../../hooks";
import { Calendar, Sparkles, Shield } from "lucide-react";

export default function WelcomeHeader() {
  const { name, picture, isLoading } = useUserProfile();

  // Extract first name from full name
  const firstName = name ? name.split(" ")[0] : "User";

  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-5 w-32 bg-gray-200 rounded-lg animate-pulse mt-3" />
              <div className="h-4 w-40 bg-gray-200 rounded animate-pulse mt-4" />
            </div>
            <div className="h-14 w-14 bg-gray-200 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start gap-4">
          {/* Left Content */}
          <div className="flex-1 min-w-0">
            {/* Badges Row */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {/* Greeting Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full border border-blue-200">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-xs font-semibold text-blue-700">
                  {getGreeting()}
                </span>
              </div>

              {/* Moderator Badge */}
              <Badge
                variant="purple"
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold"
              >
                <Shield className="w-3.5 h-3.5" />
                Moderator
              </Badge>
            </div>

            {/* Welcome Message */}
            <h1 className="text-3xl font-bold text-slate-900 mb-3 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text">
              {firstName}
            </h1>

            {/* Subtitle */}
            <p className="text-shadow-theme-description text-sm font-medium mb-3">
              Ready to explore more clubs and borrow items?
            </p>

            {/* Date Display */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/60 backdrop-blur-sm rounded-lg border border-slate-200">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-xs font-medium text-slate-700">
                {getCurrentDate()}
              </span>
            </div>
          </div>

          {/* Right Content - Avatar */}
          <div className="flex-shrink-0">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <Avatar
                src={picture || undefined}
                name={name}
                size="lg"
                className="relative ring-4 ring-white shadow-lg"
              />
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full ring-2 ring-white"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
