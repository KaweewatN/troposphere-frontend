import { useNavigate } from "react-router-dom";
import { useUserProfile } from "../../../hooks/useUserProfile";
import WelcomeHeader from "./components/WelcomeHeader";
import {
  Package,
  Users,
  Building2,
  UserPlus,
  PackagePlus,
  Settings,
  Clock,
  TrendingUp,
} from "lucide-react";
import { useSearchClubMembers } from "../../../entities/clubs";
import {
  useSearchItemsInClub,
  useSearchItemInClubApproval,
} from "../../../entities/items";
import { useMemo } from "react";

export default function AdminHome() {
  const navigate = useNavigate();
  const { memberships, isLoading } = useUserProfile();

  // Get all admin clubs and use the one with highest club_id (or you can change logic)
  const adminClubs = memberships.filter((m) => m.role === "ADMIN");
  const adminClub =
    adminClubs.length > 0 ? adminClubs[adminClubs.length - 1] : undefined;
  const clubId = adminClub?.club_id;
  const clubName = adminClub?.club_name;

  // Fetch club statistics
  const { data: membersData } = useSearchClubMembers(clubId || 0);
  const { data: itemsData } = useSearchItemsInClub(clubId || 0, 0, 100);
  const { data: approvalsData } = useSearchItemInClubApproval(
    clubId || 0,
    0,
    100
  );

  // Calculate statistics
  const totalMembers = membersData?.total_members || 0;
  const activeItems = useMemo(() => {
    if (!itemsData?.data) return 0;
    return itemsData.data.filter(
      (item: { status: string }) => item.status.toLowerCase() === "available"
    ).length;
  }, [itemsData]);
  const pendingApprovals = approvalsData?.length || 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // If no admin club, show message
  if (!adminClub || !clubId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            No Club Assigned
          </h2>
          <p className="text-slate-600 mb-6">
            You don't have any club assigned as an admin yet. Please contact an
            administrator.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const quickActions = [
    {
      title: "Add Item",
      description: "Add new items to your club",
      icon: PackagePlus,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      hoverBg: "hover:bg-blue-100",
      onClick: () => navigate(`/admin/${clubId}/club-management/add-item`),
    },
    {
      title: "Manage Members",
      description: "Add or remove club members",
      icon: UserPlus,
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      hoverBg: "hover:bg-purple-100",
      onClick: () => navigate(`/admin/${clubId}/member-management`),
    },
    {
      title: "Manage Club",
      description: "View and manage club details",
      icon: Settings,
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
      hoverBg: "hover:bg-orange-100",
      onClick: () => navigate(`/admin/${clubId}/club-management`),
    },
  ];

  const stats = [
    {
      title: "Active Items",
      value: activeItems.toString(),
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Members",
      value: totalMembers.toString(),
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Pending Approvals",
      value: pendingApprovals.toString(),
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 mb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <WelcomeHeader />

        {/* Club Info Banner */}
        <div className="mb-6 md:mb-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl md:rounded-2xl p-6 md:p-8 text-white shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 md:gap-3 mb-3">
                <Building2 className="w-6 h-6 md:w-8 md:h-8 flex-shrink-0" />
                <h2 className="text-xl md:text-2xl font-bold">
                  {clubName ? clubName : `Club ID: ${clubId}`}
                </h2>
              </div>
              <p className="text-indigo-100 text-xs md:text-sm">
                Joined:{" "}
                {new Date(adminClub.joined_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            {/* <button
              onClick={() => navigate(`/admin/${clubId}/club-management`)}
              className="bg-white text-indigo-600 px-4 py-2.5 md:px-6 md:py-3 rounded-lg md:rounded-xl font-semibold hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2 text-sm md:text-base flex-shrink-0"
            >
              <Settings className="w-4 h-4" />
              Manage Club
            </button> */}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-xl`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Quick Actions</h2>
            <TrendingUp className="w-5 h-5 text-slate-400" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className={`bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-xl hover:scale-105 transition-all duration-200 text-left group ${action.hoverBg}`}
              >
                <div
                  className={`${action.bgColor} w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <action.icon className={`w-7 h-7 ${action.textColor}`} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {action.title}
                </h3>
                <p className="text-sm text-slate-600">{action.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
