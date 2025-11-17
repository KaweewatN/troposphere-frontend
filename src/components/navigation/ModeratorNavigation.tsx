import {
  House,
  Users2,
  CheckCircle2,
  CircleUserRound,
  University,
} from "lucide-react";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { cva } from "class-variance-authority";
import { useUserProfile } from "../../hooks/useUserProfile";

const navItemVariants = cva(
  "flex flex-col items-center gap-1 cursor-pointer transition-colors",
  {
    variants: {
      active: {
        true: "text-theme-purple",
        false: "text-neutral-400 hover:text-theme-purple",
      },
    },
    defaultVariants: {
      active: false,
    },
  }
);

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  state?: Record<string, unknown>;
}

function NavItem({ to, icon, label, state }: NavItemProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  // Check if current path matches the nav item's path
  const isActive = to.includes(":id")
    ? currentPath.startsWith(to.split("/:id")[0])
    : currentPath === to;

  return (
    <li>
      <NavLink
        to={to}
        state={state}
        className={navItemVariants({ active: isActive })}
      >
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </NavLink>
    </li>
  );
}

export default function ModeratorNavigation() {
  const { id: clubId } = useParams<{ id: string }>();
  const location = useLocation();
  const { memberships } = useUserProfile();

  // Get clubId from URL params, location state, or moderator membership
  const currentClubId =
    clubId ||
    (location.state as { clubId?: string })?.clubId ||
    memberships.find((m) => m.role === "MODERATOR")?.club_id?.toString();

  if (!currentClubId) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white text-neutral-400 shadow-lg max-w-screen-sm mx-auto">
      <ul className="flex justify-around items-center py-3 px-4">
        <NavItem
          to={`/moderator/${currentClubId}/home`}
          icon={<House />}
          label="Home"
        />
        <NavItem
          to={`/moderator/${currentClubId}/club-management`}
          icon={<University />}
          label="My Club"
        />
        <NavItem
          to={`/moderator/${currentClubId}/member-management`}
          icon={<Users2 />}
          label="Members"
        />
        <NavItem
          to={`/moderator/${currentClubId}/approve-item`}
          icon={<CheckCircle2 />}
          label="Approve"
        />
        <NavItem
          to="/moderator/profile"
          icon={<CircleUserRound />}
          label="Profile"
        />
      </ul>
    </nav>
  );
}
