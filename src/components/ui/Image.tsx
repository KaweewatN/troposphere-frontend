import React, { useState, useRef, useEffect } from "react";
import type { ImgHTMLAttributes } from "react";
import { clsx } from "clsx";

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
  defaultImage, // Default image URL
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
    setHasError(true);
    setIsLoading(false);
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

      {/* Default image while loading */}
      {defaultImage && isLoading && !hasError && (
        <img
          src={defaultImage}
          alt="Loading..."
          aria-hidden="true"
          style={imageStyle}
          className={clsx(
            "transition-opacity duration-300 opacity-100",
            fill && "absolute inset-0"
          )}
        />
      )}

      {/* Loading skeleton */}
      {!isLoaded && !hasError && !defaultImage && placeholder === "empty" && (
        <div
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{ backgroundColor: "#e5e7eb" }}
        />
      )}

      {/* Main image */}
      {isInView && !hasError && (
        <img
          ref={imgRef}
          src={src}
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

      {/* Error state - show default image if available, otherwise show error icon */}
      {hasError && (
        <>
          {defaultImage ? (
            <img
              src={defaultImage}
              alt={alt}
              style={imageStyle}
              className={clsx(
                "transition-opacity duration-300 opacity-100",
                fill && "absolute inset-0"
              )}
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400"
              style={{
                backgroundColor: "#f3f4f6",
                color: "#9ca3af",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Image;
