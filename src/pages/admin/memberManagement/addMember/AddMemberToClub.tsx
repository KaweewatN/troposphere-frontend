import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useGetUserByStudentId } from "../../../../entities/users";
import { useAddMemberToClub } from "../../../../entities/clubs/api/clubs.update.mutation";
import {
  Button,
  BackButton,
  Avatar,
  showSuccess,
  showError,
} from "../../../../components/ui";
import { Search, UserPlus, Users, Shield } from "lucide-react";

const searchSchema = z.object({
  studentId: z
    .string()
    .length(10, "Student ID must be exactly 10 characters")
    .regex(/^\d+$/, "Student ID must contain only numbers"),
});

type SearchFormData = z.infer<typeof searchSchema>;

export default function AddMemberToClub() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const clubId = parseInt(id || "0", 10);

  const [searchedStudentId, setSearchedStudentId] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<number>(1); // Default role (Member = 1)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
  });

  const {
    data: userResponse,
    isLoading: isLoadingUser,
    error: userError,
  } = useGetUserByStudentId(searchedStudentId);

  const addMemberMutation = useAddMemberToClub(
    clubId,
    userResponse?.id?.toString() || ""
  );

  const onSearch = (data: SearchFormData) => {
    setSearchedStudentId(data.studentId);
  };

  const handleCancel = () => {
    setSearchedStudentId("");
    setSelectedRole(1);
  };

  const handleAddMember = () => {
    if (userResponse?.id) {
      const roleName = selectedRole === 2 ? "Moderator" : "Member";
      addMemberMutation.mutate(
        { role: selectedRole },
        {
          onSuccess: () => {
            showSuccess(
              `${userResponse.name} has been added as ${roleName} successfully!`
            );
            setTimeout(() => {
              navigate(`/admin/${clubId}/member-management`);
              window.location.reload();
            }, 500);
          },
          onError: (error) => {
            showError(
              error instanceof Error
                ? error.message
                : "Failed to add member. Please try again."
            );
          },
        }
      );
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-screen-lg">
      {/* Back Button */}
      <div className="mb-4">
        <BackButton />
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black mb-2">
          Add Member / Moderator
        </h1>
        <p className="text-theme-description">
          Search for a user by their Student ID to add them to the club.
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSubmit(onSearch)} className="mb-6">
        <div className="flex gap-2">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                {...register("studentId")}
                type="text"
                placeholder="Enter Student ID (10 digits)"
                maxLength={10}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none placeholder-gray-500 focus:ring-2 focus:ring-theme-purple ${
                  errors.studentId ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>
            {errors.studentId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.studentId.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            disabled={isLoadingUser}
            className="w-20 h-12 rounded-2xl"
          >
            {isLoadingUser ? "Searching..." : "Search"}
          </Button>
        </div>
      </form>

      {/* User Info Card */}
      {searchedStudentId && (
        <div className="bg-white rounded-lg border border-theme-primary-border p-6">
          {isLoadingUser ? (
            <div className="text-center py-8">
              <div className="inline-block w-6 h-6 border-4 border-theme-purple border-t-transparent rounded-full animate-spin" />
              <p className="mt-2 text-theme-description">Loading user...</p>
            </div>
          ) : userError ? (
            <div className="text-center py-8">
              <p className="text-red-600 font-semibold mb-2">User not found</p>
              <p className="text-theme-description text-sm">
                No user found with Student ID: {searchedStudentId}
              </p>
            </div>
          ) : userResponse ? (
            <div>
              {/* User Details */}
              <div className="flex items-start gap-4 mb-6">
                <Avatar
                  src={userResponse.picture ?? undefined}
                  alt={userResponse.name}
                  name={userResponse.name}
                  size="lg"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-black">
                    {userResponse.name}
                  </h3>
                  <p className="text-theme-description text-sm">
                    {userResponse.email}
                  </p>
                </div>
              </div>

              {/* Role Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-black mb-3">
                  Select Role for {userResponse.name}
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {/* Member Option */}
                  <button
                    type="button"
                    onClick={() => setSelectedRole(1)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedRole === 1
                        ? "border-theme-purple bg-purple-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Users
                        className={`h-8 w-8 ${
                          selectedRole === 1
                            ? "text-theme-purple"
                            : "text-gray-400"
                        }`}
                      />
                      <div className="text-center">
                        <p
                          className={`font-semibold ${
                            selectedRole === 1
                              ? "text-theme-purple"
                              : "text-gray-700"
                          }`}
                        >
                          Member
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Can borrow items
                        </p>
                      </div>
                      {selectedRole === 1 && (
                        <div className="w-full h-1 bg-theme-purple rounded-full mt-2" />
                      )}
                    </div>
                  </button>

                  {/* Moderator Option */}
                  <button
                    type="button"
                    onClick={() => setSelectedRole(2)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedRole === 2
                        ? "border-theme-purple bg-purple-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Shield
                        className={`h-8 w-8 ${
                          selectedRole === 2
                            ? "text-theme-purple"
                            : "text-gray-400"
                        }`}
                      />
                      <div className="text-center">
                        <p
                          className={`font-semibold ${
                            selectedRole === 2
                              ? "text-theme-purple"
                              : "text-gray-700"
                          }`}
                        >
                          Moderator
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Can manage items & members
                        </p>
                      </div>
                      {selectedRole === 2 && (
                        <div className="w-full h-1 bg-theme-purple rounded-full mt-2" />
                      )}
                    </div>
                  </button>
                </div>
              </div>

              {/* Action Summary */}
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">{userResponse.name}</span>{" "}
                  will be added as a{" "}
                  <span className="font-semibold">
                    {selectedRole === 2 ? "Moderator" : "Member"}
                  </span>
                </p>
              </div>

              {/* Add Button */}
              <div className="flex gap-3">
                <Button
                  onClick={handleAddMember}
                  disabled={addMemberMutation.isPending}
                  className="flex-1 flex items-center justify-center min-w-0"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  {addMemberMutation.isPending
                    ? "Adding..."
                    : `Add as ${selectedRole === 2 ? "Moderator" : "Member"}`}
                </Button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 border-2 border-gray-300 bg-white rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium whitespace-nowrap"
                >
                  Cancel
                </button>
              </div>

              {/* Error Message */}
              {addMemberMutation.isError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">
                    {(addMemberMutation.error as Error)?.message ||
                      "Failed to add member. Please try again."}
                  </p>
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
