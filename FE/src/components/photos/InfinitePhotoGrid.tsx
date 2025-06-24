import React, { useState, useCallback, useRef } from 'react';
import { useInfinitePhotos } from '../../hooks/usePhotos';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { RefreshCw, Grid3X3, Grid2X2, Grid, Loader2, AlertCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import PhotoCard from '../PhotoCard';
import { cn } from '../../lib/utils';

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
        { threshold: 0.1, rootMargin: '100px' }
      );

      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  return lastElementRef;
};

// Loading skeleton component
const PhotoSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <Card className={cn("overflow-hidden", className)}>
    <CardContent className="p-0">
      <Skeleton className="w-full aspect-[3/4]" />
      <div className="p-3 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-4 flex-1" />
        </div>
        <Skeleton className="h-3 w-2/3" />
      </div>
    </CardContent>
  </Card>
);

export const InfinitePhotoGrid: React.FC<InfinitePhotoGridProps> = ({
  searchQuery,
  topic,
  perPage = 20,
  className,
}) => {
  const [columns, setColumns] = useState(3);
  const [autoLoad, setAutoLoad] = useState(true);

  // Use the infinite photos hook
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfinitePhotos(searchQuery, topic, perPage);

  // Intersection observer for auto-loading
  const lastElementRef = useIntersectionObserver(
    hasNextPage,
    isFetchingNextPage,
    () => {
      if (autoLoad) {
        fetchNextPage();
      }
    }
  );

  // Flatten all photos from all pages
  const allPhotos = data?.pages.flatMap(page => page.results) || [];
  const totalPhotos = allPhotos.length;
  const totalPages = data?.pages[0]?.total_pages || 0;
  const currentPage = data?.pages.length || 0;

  // Handle manual load more
  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };  // Masonry styles for column layout (like Unsplash)
  const masonryStyle: React.CSSProperties = {
    columnCount: columns,
    columnGap: '1.5rem',
    columnFill: 'balance' as const,
  };

  // Error state
  if (isError) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load photos: {error?.message || 'Unknown error'}
          </AlertDescription>
        </Alert>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Stats */}
        <div className="flex items-center gap-4">
          {totalPhotos > 0 && (
            <Badge variant="secondary" className="text-sm">
              {totalPhotos.toLocaleString()} photos loaded
            </Badge>
          )}
          {totalPages > 0 && (
            <Badge variant="outline" className="text-sm">
              Page {currentPage} of {totalPages}
            </Badge>
          )}
        </div>

        {/* Grid Controls */}
        <div className="flex items-center gap-2">
          {/* Column selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Grid className="h-4 w-4 mr-2" />
                {columns} columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setColumns(2)}>
                <Grid2X2 className="h-4 w-4 mr-2" />
                2 columns
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setColumns(3)}>
                <Grid3X3 className="h-4 w-4 mr-2" />
                3 columns
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setColumns(4)}>
                <Grid className="h-4 w-4 mr-2" />
                4 columns
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Auto-load toggle */}
          <Button
            variant={autoLoad ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoLoad(!autoLoad)}
          >
            Auto-load {autoLoad ? "On" : "Off"}
          </Button>

          {/* Refresh button */}
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>      {/* Loading state for initial load */}
      {isLoading && (
        <div style={masonryStyle}>
          {Array.from({ length: perPage }).map((_, index) => (
            <PhotoSkeleton key={index} />
          ))}
        </div>
      )}      {/* Photos Grid */}
      {!isLoading && allPhotos.length > 0 && (
        <div style={masonryStyle}>
          {allPhotos.map((photo, index) => {
            const isLast = index === allPhotos.length - 1;
            return (
              <PhotoCard 
                key={`${photo.id}-${index}`}
                photo={photo}
                ref={isLast ? lastElementRef : null}
              />
            );
          })}
        </div>
      )}

      {/* Loading more indicator */}
      {isFetchingNextPage && (
        <div className="flex justify-center py-8">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading more photos...</span>
          </div>
        </div>
      )}

      {/* Manual load more button */}
      {!autoLoad && hasNextPage && !isFetchingNextPage && (
        <div className="flex justify-center py-8">
          <Button onClick={handleLoadMore} variant="outline" size="lg">
            Load More Photos
          </Button>
        </div>
      )}

      {/* No more photos message */}
      {!hasNextPage && allPhotos.length > 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            You've reached the end! 🎉
          </p>
        </div>
      )}

      {/* No photos found */}
      {!isLoading && allPhotos.length === 0 && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto space-y-4">
            <div className="text-6xl">📸</div>
            <h3 className="text-xl font-medium">No photos found</h3>
            <p className="text-muted-foreground">
              {searchQuery 
                ? `No results for "${searchQuery}". Try a different search term.`
                : topic
                ? `No photos found for the topic "${topic}".`
                : "No photos available at the moment."
              }
            </p>
            <Button onClick={() => refetch()} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfinitePhotoGrid;
