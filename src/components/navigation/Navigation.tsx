import { House, Search, History, CircleUserRound } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cva } from "class-variance-authority";

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
  // For search-clubs, match /search-clubs and /clubs/:id
  const isActive =
    to === "/search-clubs"
      ? currentPath.startsWith("/search-clubs") ||
        currentPath.startsWith("/clubs")
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

export default function Navigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white text-neutral-400 shadow-lg max-w-screen-sm mx-auto">
      <ul className="flex justify-around items-center py-3 px-4">
        <NavItem to="/" icon={<House />} label="Home" />
        <NavItem to="/search-clubs" icon={<Search />} label="Search" />
        <NavItem to="/history" icon={<History />} label="History" />
        <NavItem to="/profile" icon={<CircleUserRound />} label="Profile" />
      </ul>
    </nav>
  );
}
