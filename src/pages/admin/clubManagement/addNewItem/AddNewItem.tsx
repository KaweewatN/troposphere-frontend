import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAddItemToClub } from "../../../../entities/clubs";
import { BackButton, Button } from "../../../../components/ui";
import { showSuccess, showError } from "../../../../components/ui/toast";
import type { AddItemToClubRequest } from "../../../../entities/clubs/types";

export default function AddNewItem() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const clubId = parseInt(id || "0", 10);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AddItemToClubRequest>({
    defaultValues: {
      name: "",
      description: "",
      is_high_risk: false,
      status: "AVAILABLE",
      qr_code: "",
    },
  });

  const { mutate: addItem, isPending } = useAddItemToClub(clubId);

  const onSubmit = (data: AddItemToClubRequest) => {
    addItem(data, {
      onSuccess: (response: { name: string; id: number }) => {
        showSuccess(`Item "${response.name}" added successfully!`);
        reset();
        setTimeout(() => {
          navigate(`/admin/${clubId}/club-management`);
          window.location.reload();
        }, 500);
      },
      onError: (error: Error | { detail: Array<{ msg: string }> }) => {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "detail" in error
            ? error.detail[0]?.msg || "Failed to add item"
            : "Failed to add item";
        showError(`Error: ${errorMessage}`);
      },
    });
  };

  if (!clubId || isNaN(clubId)) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-red-600">
            Invalid Club ID
          </h2>
          <Button onClick={() => navigate("/admin/myclubs")} className="mt-4">
            Back to My Clubs
          </Button>
        </div>
      </div>
    );
  }

  const isLoading = isPending || isSubmitting;

  return (
    <div className="container mx-auto py-6 px-4 max-w-screen-lg pb-24">
      {/* Back Button */}
      <div className="mb-4">
        <BackButton />
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black mb-2">Add New Item</h1>
        <p className="text-theme-description text-sm">
          Fill in the details to add a new item to your club
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Item Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Item Name <span className="text-red-600">*</span>
          </label>
          <input
            id="name"
            type="text"
            {...register("name", {
              required: "Item name is required",
              minLength: {
                value: 3,
                message: "Item name must be at least 3 characters",
              },
              maxLength: {
                value: 100,
                message: "Item name must not exceed 100 characters",
              },
            })}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-theme-purple placeholder:text-neutral-400 ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter item name"
            disabled={isLoading}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            {...register("description", {
              maxLength: {
                value: 500,
                message: "Description must not exceed 500 characters",
              },
            })}
            rows={4}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-theme-purple resize-none placeholder:text-neutral-400 ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter item description (optional)"
            disabled={isLoading}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* QR Code */}
        <div>
          <label
            htmlFor="qr_code"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            QR Code <span className="text-red-600">*</span>
          </label>
          <input
            id="qr_code"
            type="text"
            {...register("qr_code", {
              required: "QR code is required",
              minLength: {
                value: 3,
                message: "QR code must be at least 3 characters",
              },
            })}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-theme-purple placeholder:text-neutral-400 ${
              errors.qr_code ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter QR code"
            disabled={isLoading}
          />
          {errors.qr_code && (
            <p className="mt-1 text-sm text-red-600">
              {errors.qr_code.message}
            </p>
          )}
        </div>

        {/* Status */}
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Status <span className="text-red-600">*</span>
          </label>
          <select
            id="status"
            {...register("status", {
              required: "Status is required",
            })}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-theme-purple ${
              errors.status ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isLoading}
          >
            <option value="AVAILABLE">Available</option>
            <option value="UNAVAILABLE">Unavailable</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
          )}
        </div>

        {/* High Risk Checkbox */}
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="is_high_risk"
              type="checkbox"
              {...register("is_high_risk")}
              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-theme-purple text-theme-purple"
              disabled={isLoading}
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="is_high_risk" className="font-medium text-gray-700">
              High Risk Item
            </label>
            <p className="text-gray-500">
              Mark this item as high risk if it requires special handling or
              permissions
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate(`/admin/${clubId}/club-management`)}
            disabled={isLoading}
            className="flex-1 px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Cancel
          </button>
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-6 py-3 rounded-lg font-medium flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Adding Item...
              </>
            ) : (
              "Add Item"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
