import { useParams, useNavigate, Link } from "react-router-dom";
import {
  useSearchClubDetails,
  useSearchClubMembers,
  useDeleteClubRole,
} from "../../../entities/clubs";
import {
  Image,
  Button,
  BackButton,
  Badge,
  Modal,
  showSuccess,
  showError,
} from "../../../components/ui";
import { Mail, User, Trash2, Plus } from "lucide-react";
import { useState } from "react";

export default function MemberManagement() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const clubId = parseInt(id || "0", 10);

  const {
    data: clubDetailsResponse,
    isLoading: isLoadingDetails,
    error: detailsError,
  } = useSearchClubDetails(clubId);

  const {
    data: clubMembersResponse,
    isLoading: isLoadingMembers,
    error: membersError,
    refetch: refetchMembers,
  } = useSearchClubMembers(clubId);

  const [deletingMemberId, setDeletingMemberId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const deleteMemberMutation = useDeleteClubRole(String(clubId), {
    onSuccess: () => {
      setShowDeleteConfirm(false);
      setDeletingMemberId(null);
      showSuccess("Member removed successfully!");
      refetchMembers();
    },
    onError: (error) => {
      showError(
        error instanceof Error
          ? error.message
          : "Failed to remove member. Please try again."
      );
    },
  });

  const clubDetails = clubDetailsResponse?.data;
  const clubMembers = clubMembersResponse?.data || [];
  const totalMembers = clubMembersResponse?.total_members || 0;

  // Helper function to get role name from number
  const getRoleName = (role: number | string): string => {
    const roleNum = typeof role === "string" ? parseInt(role) : role;
    if (roleNum === 3) return "ADMIN";
    if (roleNum === 2) return "MODERATOR";
    return "MEMBER";
  };

  // Helper function to get role badge variant
  const getRoleBadgeVariant = (
    role: number | string
  ): "yellow" | "purple" | "blue" => {
    const roleNum = typeof role === "string" ? parseInt(role) : role;
    if (roleNum === 3) return "yellow";
    if (roleNum === 2) return "purple";
    return "blue";
  };

  const isLoading = isLoadingDetails || isLoadingMembers;
  const hasError = detailsError || membersError;

  if (!clubId || isNaN(clubId)) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-red-600">
            Invalid Club ID
          </h2>
          <Button onClick={() => navigate("/search-clubs")} className="mt-4">
            Back to Search
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-theme-purple border-t-transparent rounded-full animate-spin" />
          <p className="mt-2 text-neutral-600">Loading club details...</p>
        </div>
      </div>
    );
  }

  if (hasError || !clubDetails) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-red-600">
            Error loading club details
          </h2>
          <p className="text-neutral-600 mt-2">
            The club you're looking for doesn't exist or there was an error
            loading it.
          </p>
          <Button onClick={() => navigate("/search-clubs")} className="mt-4">
            Back to Search
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-screen-lg pb-24">
      {/* Back Button and Add Member */}
      <div className="mb-4 px-2 flex items-center justify-between">
        <BackButton />
        <Link
          to={`/moderator/${clubId}/member-management/add-member`}
          className="inline-flex items-center gap-1 px-4 py-2 rounded-3xl bg-theme-purple text-white hover:bg-theme-purple-dark transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Member / Moderator
        </Link>
      </div>

      {/* Club Header */}
      <div className="bg-white overflow-hidden">
        <div className="relative h-48 bg-gradient-to-br from-theme-purple to-purple-600">
          <Image
            src={clubDetails.image_path}
            alt={clubDetails.name}
            fill
            objectFit="cover"
            className="absolute inset-0"
          />
        </div>

        <div className="py-6 px-3">
          <h1 className="text-2xl font-bold text-black mb-2">
            {clubDetails.name}
          </h1>
          <p className="text-theme-description text-sm mb-4">
            {clubDetails.description}
          </p>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-theme-purple"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <span className="text-black font-medium">
                {totalMembers} {totalMembers === 1 ? "Member" : "Members"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Members Section */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold text-black mb-4">Members</h2>

        {isLoadingMembers ? (
          <div className="text-center py-8">
            <div className="inline-block w-6 h-6 border-4 border-theme-purple border-t-transparent rounded-full animate-spin" />
          </div>
        ) : clubMembers.length > 0 ? (
          <div className="space-y-3">
            {clubMembers.map((member) => (
              <div
                key={member.user_id}
                className="bg-white rounded-xl border border-theme-primary-border p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-theme-purple to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {member.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Member Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="h-4 w-4 text-theme-purple flex-shrink-0" />
                      <h3 className="font-semibold text-black text-base truncate">
                        {member.name}
                      </h3>
                      <Badge
                        variant={getRoleBadgeVariant(member.role)}
                        className="text-xs font-semibold ml-2"
                      >
                        {getRoleName(member.role)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-theme-description flex-shrink-0" />
                      <p className="text-sm text-theme-description truncate">
                        {member.email}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 flex-shrink-0">
                    {/* Delete Button */}
                    <button
                      className={`p-2 rounded-lg transition-colors border ${
                        Number(member.role) === 2 || Number(member.role) === 3
                          ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                          : "hover:bg-red-50 text-red-600 border-red-200"
                      }`}
                      onClick={() => {
                        const roleNum = Number(member.role);
                        if (roleNum !== 2 && roleNum !== 3) {
                          setDeletingMemberId(member.user_id);
                          setShowDeleteConfirm(true);
                        }
                      }}
                      disabled={
                        Number(member.role) === 2 || Number(member.role) === 3
                      }
                      aria-label="Delete member"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-theme-description">
            <p>No members found in this club.</p>
          </div>
        )}
      </div>

      {/* Confirm Delete Popup */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDeletingMemberId(null);
        }}
        title="Remove Member"
        icon={<Trash2 className="w-6 h-6" />}
        titleColor="text-red-600"
      >
        <p className="mb-6 text-slate-600">
          Are you sure you want to remove this member from the club? This action
          cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              setShowDeleteConfirm(false);
              setDeletingMemberId(null);
            }}
            className="px-4 py-2 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (deletingMemberId) {
                deleteMemberMutation.mutate({
                  userId: String(deletingMemberId),
                });
              }
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center gap-2"
            disabled={deleteMemberMutation.isPending}
          >
            {deleteMemberMutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Removing...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Remove
              </>
            )}
          </button>
        </div>
      </Modal>
    </div>
  );
}
