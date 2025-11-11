import { useParams, useNavigate, Link } from "react-router-dom";
import {
  useSearchClubDetails,
  useSearchClubMembers,
  useDeleteClubRole,
} from "../../../entities/clubs";
import { Image, Button, BackButton } from "../../../components/ui";
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
  const [showConfirm, setShowConfirm] = useState(false);

  const deleteMemberMutation = useDeleteClubRole(String(clubId), {
    onSuccess: () => {
      setShowConfirm(false);
      setDeletingMemberId(null);
      refetchMembers();
    },
  });

  const clubDetails = clubDetailsResponse?.data;
  const clubMembers = clubMembersResponse?.data || [];
  const totalMembers = clubMembersResponse?.total_members || 0;

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
                className="bg-white rounded-xl border border-theme-primary-border p-4 hover:shadow-lg transition-shadow flex items-center"
              >
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-theme-purple to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {member.name.charAt(0).toUpperCase()}
                </div>

                {/* Member Info */}
                <div className="flex-1 min-w-0 ml-4">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="h-4 w-4 text-theme-purple flex-shrink-0" />
                    <h3 className="font-semibold text-black text-base truncate">
                      {member.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-theme-description flex-shrink-0" />
                    <p className="text-sm text-theme-description truncate">
                      {member.email}
                    </p>
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  className="ml-4 p-2 rounded-full hover:bg-red-100 text-red-600 transition-colors"
                  onClick={() => {
                    setDeletingMemberId(member.user_id);
                    setShowConfirm(true);
                  }}
                  aria-label="Delete member"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
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
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-xs w-full">
            <h3 className="text-lg font-semibold mb-2 text-red-600">
              Remove Member
            </h3>
            <p className="mb-4 text-sm">
              Are you sure you want to remove this member from the club?
            </p>
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => {
                  setShowConfirm(false);
                  setDeletingMemberId(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (deletingMemberId) {
                    deleteMemberMutation.mutate({
                      userId: String(deletingMemberId),
                    });
                  }
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
