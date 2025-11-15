import { Avatar, Badge } from "./index";
import { Shield } from "lucide-react";

interface WelcomeHeaderProps {
  name: string;
  picture?: string | null;
  subtitle?: string;
  role?: string;
  showRoleBadge?: boolean;
}

export function WelcomeHeader({
  name,
  picture,
  subtitle = "Here's what's happening with your club today",
  role = "Moderator",
  showRoleBadge = true,
}: WelcomeHeaderProps) {
  return (
    <div className="mb-6 md:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3 md:gap-4">
          <Avatar
            src={picture || undefined}
            name={name}
            size="lg"
            className="flex-shrink-0"
          />
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 truncate">
              Welcome back, {name.split(" ")[0]}!
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-1">
              {subtitle}
            </p>
          </div>
        </div>
        {showRoleBadge && (
          <Badge
            variant="purple"
            className="flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold self-start sm:self-auto flex-shrink-0"
          >
            <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
            {role}
          </Badge>
        )}
      </div>
    </div>
  );
}
