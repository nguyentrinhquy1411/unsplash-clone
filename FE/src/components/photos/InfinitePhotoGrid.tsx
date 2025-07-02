import React, { useState, useCallback, useRef, useMemo } from "react";
import { useInfinitePhotos } from "../../hooks/usePhotos";
import { Loader2, Grid3X3, Grid2X2, Grid } from "lucide-react";
import PhotoCard from "../PhotoCard";

interface InfinitePhotoGridProps {
  searchQuery?: string;
  topic?: string;
  perPage?: number;
  className?: string;
}

// Hook for intersection observer
const useIntersectionObserver = (
  hasNextPage: boolean | undefined,
  isFetchingNextPage: boolean,
  fetchNextPage: () => void
) => {
  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        },
        { threshold: 0.1, rootMargin: "500px" }
      );

      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  return lastElementRef;
};

// Loading skeleton component
const PhotoSkeleton: React.FC = () => (
  <div className="mb-6 break-inside-avoid">
    <div className="bg-gray-200 animate-pulse rounded-lg" style={{ aspectRatio: "4/5" }} />
  </div>
);

const InfinitePhotoGrid: React.FC<InfinitePhotoGridProps> = ({ searchQuery, topic, perPage = 20, className }) => {
  const [columns, setColumns] = useState(3);

  // Use the infinite photos hook
  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useInfinitePhotos(searchQuery, topic, perPage);

  // Intersection observer for auto-loading
  const lastElementRef = useIntersectionObserver(hasNextPage, isFetchingNextPage, fetchNextPage);

  // Flatten all photos from all pages
  const allPhotos = useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap((page) => page.results);
  }, [data]);

  // Masonry styles for column layout (like Unsplash)
  const masonryStyle: React.CSSProperties = {
    columnCount: columns,
    columnGap: "20px",
    columnFill: "balance" as const,
  };

  // Responsive columns based on screen size
  const getResponsiveColumns = () => {
    if (typeof window === "undefined") return 3;
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return columns;
  };

  const responsiveStyle: React.CSSProperties = {
    ...masonryStyle,
    columnCount: getResponsiveColumns(),
  };

  // Error state
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="text-6xl">😞</div>
        <h3 className="text-xl font-medium text-gray-900">Something went wrong</h3>
        <p className="text-gray-600 text-center max-w-md">
          {error?.message || "Failed to load photos. Please try again."}
        </p>
        <button
          onClick={() => refetch()}
          className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Column Controls - Mobile Only */}
      <div className="flex justify-between items-center mb-6 sm:hidden">
        <h2 className="text-lg font-medium text-gray-900">
          {searchQuery ? `Search: ${searchQuery}` : topic ? topic.charAt(0).toUpperCase() + topic.slice(1) : "Photos"}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setColumns(1)}
            className={`p-2 rounded-lg ${columns === 1 ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"}`}
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setColumns(2)}
            className={`p-2 rounded-lg ${columns === 2 ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"}`}
          >
            <Grid2X2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Desktop Column Controls */}
      <div className="hidden sm:flex justify-between items-center mb-8">
        <h2 className="text-2xl font-medium text-gray-900">
          {searchQuery ? `Search: ${searchQuery}` : topic ? topic.charAt(0).toUpperCase() + topic.slice(1) : "Photos"}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setColumns(2)}
            className={`p-2 rounded-lg ${columns === 2 ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"}`}
          >
            <Grid2X2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setColumns(3)}
            className={`p-2 rounded-lg ${columns === 3 ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"}`}
          >
            <Grid3X3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setColumns(4)}
            className={`p-2 rounded-lg ${columns === 4 ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"}`}
          >
            <Grid className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Loading state for initial load */}
      {isLoading && (
        <div style={responsiveStyle}>
          {Array.from({ length: perPage }).map((_, index) => (
            <PhotoSkeleton key={index} />
          ))}
        </div>
      )}

      {/* Photos Grid */}
      {!isLoading && allPhotos.length > 0 && (
        <div style={responsiveStyle}>
          {allPhotos.map((photo, index) => {
            const isLast = index === allPhotos.length - 1;
            return <PhotoCard key={photo.id} photo={photo} ref={isLast ? lastElementRef : null} />;
          })}
        </div>
      )}

      {/* Loading more indicator */}
      {isFetchingNextPage && (
        <div className="flex justify-center py-12">
          <div className="flex items-center gap-3 text-gray-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading more photos...</span>
          </div>
        </div>
      )}

      {/* No more photos message */}
      {!hasNextPage && allPhotos.length > 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">You've reached the end! 🎉</p>
        </div>
      )}

      {/* No photos found */}
      {!isLoading && allPhotos.length === 0 && (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto space-y-4">
            <div className="text-6xl">📸</div>
            <h3 className="text-xl font-medium text-gray-900">No photos found</h3>
            <p className="text-gray-600">
              {searchQuery
                ? `No results for "${searchQuery}". Try a different search term.`
                : topic
                ? `No photos found for the topic "${topic}".`
                : "No photos available at the moment."}
            </p>
            <button
              onClick={() => refetch()}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export { InfinitePhotoGrid };
export default InfinitePhotoGrid;
