import { House, Search, History, CircleUserRound } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cva, type VariantProps } from "class-variance-authority";
import { memo } from "react";

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

interface NavItemProps extends VariantProps<typeof navItemVariants> {
  to: string;
  icon: React.ReactNode;
  label: string;
  currentPath: string;
}

const NavItem = memo(({ to, icon, label, currentPath }: NavItemProps) => {
  // Check if current path matches the nav item's path
  // For search, match both /search and /search-clubs (with or without query params)
  const isActive =
    to === "/search" ? currentPath.startsWith("/search") : currentPath === to;

  return (
    <li>
      <Link to={to} className={navItemVariants({ active: isActive })}>
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </Link>
    </li>
  );
});

NavItem.displayName = "NavItem";

export default function Navigation() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white text-neutral-400 shadow-lg max-w-screen-sm mx-auto">
      <ul className="flex justify-around items-center py-3 px-4">
        <NavItem
          to="/"
          icon={<House />}
          label="Home"
          currentPath={currentPath}
        />
        <NavItem
          to="/search-clubs"
          icon={<Search />}
          label="Search"
          currentPath={currentPath}
        />
        <NavItem
          to="/history"
          icon={<History />}
          label="History"
          currentPath={currentPath}
        />
        <NavItem
          to="/profile"
          icon={<CircleUserRound />}
          label="Profile"
          currentPath={currentPath}
        />
      </ul>
    </nav>
  );
}
