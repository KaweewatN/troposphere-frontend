import { useParams, useNavigate, Link } from "react-router-dom";
import {
  useSearchClubDetails,
  useSearchClubMembers,
} from "../../../entities/clubs";
import { Image, Button } from "../../../components/ui";
import { Mail, User } from "lucide-react";

export default function ClubsMembers() {
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
  } = useSearchClubMembers(clubId);

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
      {/* Back Button */}
      <div className="mb-4 px-2">
        <Link
          to={`/clubs/${clubId}`}
          className="inline-flex items-center text-theme-purple hover:text-theme-purple-dark"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Club
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
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-theme-description flex-shrink-0" />
                      <p className="text-sm text-theme-description truncate">
                        {member.email}
                      </p>
                    </div>
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
    </div>
  );
}
