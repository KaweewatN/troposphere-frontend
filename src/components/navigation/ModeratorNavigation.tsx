import {
  House,
  Users2,
  CheckCircle2,
  CircleUserRound,
  University,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cva } from "class-variance-authority";
import { useEffect, useState } from "react";

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
}

function NavItem({ to, icon, label }: NavItemProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  // Check if current path matches the nav item's path
  const isActive = to.includes(":id")
    ? currentPath.startsWith(to.split("/:id")[0])
    : currentPath === to;

  return (
    <li>
      <NavLink to={to} className={navItemVariants({ active: isActive })}>
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </NavLink>
    </li>
  );
}

export default function ModeratorNavigation() {
  const [clubId, setClubId] = useState<string | null>(null);

  useEffect(() => {
    // Replace this with your actual API call
    async function fetchClubId() {
      // Example: const response = await fetch("/api/club");
      // const data = await response.json();
      // setClubId(data.clubId);
      setClubId("1");
    }
    fetchClubId();
  }, []);

  if (!clubId) return null; // or a loading spinner

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white text-neutral-400 shadow-lg max-w-screen-sm mx-auto">
      <ul className="flex justify-around items-center py-3 px-4">
        <NavItem
          to={`/moderator/${clubId}/home`}
          icon={<House />}
          label="Home"
        />
        <NavItem
          to={`/moderator/${clubId}/club-management`}
          icon={<University />}
          label="My Club"
        />
        <NavItem
          to={`/moderator/${clubId}/member-management`}
          icon={<Users2 />}
          label="Members"
        />
        <NavItem
          to={`/moderator/${clubId}/approve-item`}
          icon={<CheckCircle2 />}
          label="Approve"
        />
        <NavItem to="/profile" icon={<CircleUserRound />} label="Profile" />
      </ul>
    </nav>
  );
}
