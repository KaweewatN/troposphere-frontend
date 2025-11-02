import { useParams, useNavigate } from "react-router-dom";
import { useSearchItemId } from "../../../entities/items";
import { useSearchClubDetails } from "../../../entities/clubs";
import { Image, Badge, Button } from "../../../components/ui";
import { ArrowLeft, Calendar, Package, Shield, Building2, Heart } from "lucide-react";
import { useState } from "react";

export default function ItemDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const itemId = parseInt(id || "0", 10);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const {
    data: itemData,
    isLoading,
    error,
  } = useSearchItemId(itemId);

  // Fetch club details to get the club name
  const {
    data: clubData,
    isLoading: isLoadingClub,
  } = useSearchClubDetails(itemData?.club_id || 0);

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Extract category from item name (simple heuristic)
  const getCategory = (name: string): string => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("camera")) return "Camera";
    if (lowerName.includes("printer") || lowerName.includes("3d")) return "3D Printer";
    if (lowerName.includes("drone")) return "Drone";
    if (lowerName.includes("laptop") || lowerName.includes("computer")) return "Computer";
    return "Equipment";
  };

  if (!itemId || isNaN(itemId)) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-screen-lg">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-red-600">Invalid Item ID</h2>
          <Button onClick={() => navigate("/search-clubs")} className="mt-4">
            Back to Search
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-screen-lg">
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-theme-purple border-t-transparent rounded-full animate-spin" />
          <p className="mt-2 text-neutral-600">Loading item details...</p>
        </div>
      </div>
    );
  }

  if (error || !itemData) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-screen-lg">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-red-600">
            Error loading item details
          </h2>
          <p className="text-neutral-600 mt-2">
            The item you're looking for doesn't exist or there was an error loading it.
          </p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const category = getCategory(itemData.name);
  const description = itemData.description || "No description available.";
  const shouldTruncate = description.length > 150;
  const displayDescription = showFullDescription || !shouldTruncate
    ? description
    : description.substring(0, 150) + "...";

  return (
    <div className="container mx-auto max-w-screen-lg pb-24">
      {/* Back Button */}
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-theme-purple hover:text-theme-purple-dark transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back
        </button>
      </div>

      {/* Item Image */}
      <div className="relative w-full bg-gray-100 rounded-2xl overflow-hidden mb-6">
        <div className="aspect-video relative">
          {itemData.images && itemData.images.length > 0 ? (
            <Image
              src={itemData.images[0]}
              alt={itemData.name}
              fill
              objectFit="cover"
              className="absolute inset-0"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Package className="h-24 w-24 text-gray-300" />
            </div>
          )}
        </div>
      </div>

      {/* Category Badge */}
      <div className="mb-3">
        <Badge variant="gray" className="text-sm px-3 py-1.5">
          {category}
        </Badge>
      </div>

      {/* Item Title */}
      <h1 className="text-3xl font-bold text-theme-heading mb-6">
        {itemData.name}
      </h1>

      {/* Metadata Section */}
      <div className="bg-white rounded-2xl border border-theme-primary-border divide-y divide-gray-100 mb-6">
        {/* Type Row */}
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
              <Shield className="h-5 w-5 text-red-600" />
            </div>
            <span className="text-sm text-theme-description font-medium">Type</span>
          </div>
          <Badge variant={itemData.is_high_risk ? "red" : "gray"} className="font-semibold">
            {itemData.is_high_risk ? "High risk" : "Standard"}
          </Badge>
        </div>

        {/* Category Row */}
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-sm text-theme-description font-medium">Category</span>
          </div>
          <span className="text-theme-heading font-semibold">{category}</span>
        </div>

        {/* Item Status Row */}
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
              <Package className="h-5 w-5 text-green-600" />
            </div>
            <span className="text-sm text-theme-description font-medium">Item Status</span>
          </div>
          <Badge
            variant={itemData.status === "AVAILABLE" ? "green" : "yellow"}
            className="font-semibold"
          >
            {itemData.status === "AVAILABLE" ? "Available" : itemData.status}
          </Badge>
        </div>

        {/* Club Row */}
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-theme-purple" />
            </div>
            <span className="text-sm text-theme-description font-medium">Club</span>
          </div>
          <span className="text-theme-heading font-semibold">
            {isLoadingClub ? "Loading..." : clubData?.data?.name || "Unknown Club"}
          </span>
        </div>

        {/* Created At Row */}
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-gray-600" />
            </div>
            <span className="text-sm text-theme-description font-medium">Created at</span>
          </div>
          <span className="text-theme-heading font-semibold">
            {formatDate(itemData.created_at)}
          </span>
        </div>
      </div>

      {/* Description Section */}
      <div className="mb-16">
        <h2 className="text-xl font-bold text-theme-heading mb-3">Description</h2>
        <p className="text-theme-description leading-relaxed">
          {displayDescription}
        </p>
        {shouldTruncate && (
          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="text-theme-purple hover:text-theme-purple-dark font-semibold mt-2 text-sm"
          >
            {showFullDescription ? "Show less" : "Read more"}
          </button>
        )}
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-20 left-0 right-0 px-5 max-w-screen-sm mx-auto">
        <div className="flex gap-3 items-center">
          {/* Favorite Button */}
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg cursor-pointer ${isFavorite
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-white text-gray-400 hover:text-red-500 border border-gray-200"
              }`}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={`h-6 w-6 ${isFavorite ? "fill-current" : ""}`}
              strokeWidth={2}
            />
          </button>

          {/* Borrow Button */}
          <Button
            className="flex-1 py-4 text-base font-semibold shadow-lg"
            disabled={itemData.status !== "AVAILABLE"}
          >
            {itemData.status === "AVAILABLE" ? "Borrow this item" : "Item Not Available"}
          </Button>
        </div>
      </div>
    </div>
  );
}
