import React, { useState, useRef, useEffect } from "react";
import type { ImgHTMLAttributes } from "react";
import { clsx } from "clsx";

const DEFAULT_IMAGE_PATH = "/images/static/default-image.png";

export interface ImageProps
  extends Omit<
    ImgHTMLAttributes<HTMLImageElement>,
    "src" | "srcSet" | "loading"
  > {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  loading?: "lazy" | "eager";
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  objectPosition?: string;
  onLoadingComplete?: (img: HTMLImageElement) => void;
  fill?: boolean;
  sizes?: string;
  defaultImage?: string; // Add default image prop
}

/**
 * Optimized Image component with lazy loading and performance features
 *
 * Features:
 * - Lazy loading by default
 * - Blur placeholder support
 * - Automatic aspect ratio preservation
 * - Loading states
 * - Error handling
 * - Intersection Observer for lazy loading
 * - Responsive image support
 * - Default image fallback
 */
export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  width,
  height,
  priority = false,
  loading = "lazy",
  placeholder = "empty",
  blurDataURL,
  objectFit = "contain",
  objectPosition = "center",
  onLoadingComplete,
  fill = false,
  sizes,
  className,
  style,
  defaultImage = DEFAULT_IMAGE_PATH, // Use constant as default
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use default image if no src provided
  const imageSrc = src || defaultImage;

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || loading === "eager") {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "50px",
        threshold: 0.01,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [priority, loading]);

  // Handle image load
  const handleLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoaded(true);
    setIsLoading(false);
    if (onLoadingComplete && imgRef.current) {
      onLoadingComplete(imgRef.current);
    }
    props.onLoad?.(event);
  };

  // Handle image error
  const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    // If the failed image is not already the default, try loading default
    if (imgRef.current && imgRef.current.src !== defaultImage) {
      setHasError(true);
      setIsLoading(false);
    }
    props.onError?.(event);
  };

  // Container styles for aspect ratio and positioning
  const containerStyle: React.CSSProperties = {
    position: fill ? "absolute" : "relative",
    width: fill ? "100%" : width ? `${width}px` : "100%",
    height: fill ? "100%" : height ? `${height}px` : "auto",
    overflow: "hidden",
    ...(width &&
      height &&
      !fill && {
        aspectRatio: `${width} / ${height}`,
      }),
    ...(fill && {
      inset: 0,
    }),
  };

  // Image styles
  const imageStyle: React.CSSProperties = {
    objectFit,
    objectPosition,
    width: fill ? "100%" : "100%",
    height: fill ? "100%" : "100%",
    maxWidth: "100%",
    ...style,
  };

  // Blur placeholder styles
  const blurPlaceholderStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    objectFit,
    objectPosition,
    filter: "blur(20px)",
    transform: "scale(1.2)",
    width: "100%",
    height: "100%",
    opacity: isLoaded ? 0 : 1,
    transition: "opacity 0.3s ease-out",
  };

  return (
    <div
      ref={containerRef}
      style={containerStyle}
      className={clsx("image-container", className)}
      data-loaded={isLoaded}
      data-loading={isLoading}
    >
      {/* Blur placeholder */}
      {placeholder === "blur" && blurDataURL && !isLoaded && (
        <img
          src={blurDataURL}
          alt=""
          aria-hidden="true"
          style={blurPlaceholderStyle}
          className="blur-placeholder"
        />
      )}

      {/* Loading skeleton */}
      {!isLoaded && !hasError && placeholder === "empty" && (
        <div
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{ backgroundColor: "#e5e7eb" }}
        />
      )}

      {/* Main image */}
      {isInView && (
        <img
          ref={imgRef}
          src={hasError ? defaultImage : imageSrc}
          alt={alt}
          loading={priority ? "eager" : loading}
          decoding="async"
          style={imageStyle}
          className={clsx(
            "transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0",
            fill && "absolute inset-0"
          )}
          onLoad={handleLoad}
          onError={handleError}
          sizes={sizes}
          {...props}
        />
      )}
    </div>
  );
};

export default Image;
