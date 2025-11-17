import { cva, type VariantProps } from "class-variance-authority";
import { useState } from "react";

const avatarVariants = cva(
  "inline-flex items-center justify-center font-semibold overflow-hidden flex-shrink-0",
  {
    variants: {
      size: {
        sm: "h-8 w-8 text-xs",
        md: "h-10 w-10 text-sm",
        lg: "h-12 w-12 text-base",
        xl: "h-16 w-16 text-lg",
        "2xl": "h-20 w-20 text-xl",
      },
      shape: {
        circle: "rounded-full",
        square: "rounded-lg",
      },
      variant: {
        default: "bg-theme-purple text-white",
        secondary: "bg-theme-secondary text-theme-heading",
        neutral: "bg-neutral-200 text-neutral-700",
        primary: "bg-blue-500 text-white",
        success: "bg-green-500 text-white",
        warning: "bg-yellow-500 text-white",
        danger: "bg-red-500 text-white",
      },
    },
    defaultVariants: {
      size: "md",
      shape: "circle",
      variant: "default",
    },
  }
);

export interface AvatarProps extends VariantProps<typeof avatarVariants> {
  /** Image URL to display */
  src?: string;
  /** Alt text for the image */
  alt?: string;
  /** Name to generate initials from (e.g., "John Doe" -> "JD") */
  name?: string;
  /** Manual initials to display (overrides name-based initials) */
  initials?: string;
  /** Additional CSS classes */
  className?: string;
  /** Callback when image fails to load */
  onError?: () => void;
}

/**
 * Avatar component that displays either an image or initials
 * @example
 * ```tsx
 * // With image
 * <Avatar src="/path/to/image.jpg" alt="User" />
 *
 * // With initials from name
 * <Avatar name="John Doe" />
 *
 * // With manual initials
 * <Avatar initials="K" />
 *
 * // Different sizes and shapes
 * <Avatar name="Jane Smith" size="lg" shape="square" variant="secondary" />
 * ```
 */
export default function Avatar({
  src,
  alt,
  name,
  initials,
  size,
  shape,
  variant,
  className,
  onError,
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);

  // Generate initials from name
  const getInitials = (): string => {
    if (initials) return initials.toUpperCase().slice(0, 1);
    if (name) {
      const parts = name.trim().split(/\s+/);
      return parts[0][0].toUpperCase();
    }
    return "?";
  };

  const handleImageError = () => {
    setImageError(true);
    onError?.();
  };

  const showImage = src && !imageError;
  const displayInitials = getInitials();

  return (
    <div className={avatarVariants({ size, shape, variant, className })}>
      {showImage ? (
        <img
          src={src}
          alt={alt || name || "Avatar"}
          className="h-full w-full object-cover"
          onError={handleImageError}
        />
      ) : (
        <span>{displayInitials}</span>
      )}
    </div>
  );
}
