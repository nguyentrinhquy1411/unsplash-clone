# React Query Infinite Loading - Complete Guide

## 2.1 useInfiniteQuery Implementation

```typescript
// src/hooks/useInfinitePhotos.ts
import { useInfiniteQuery } from "@tanstack/react-query";
import { photosApi } from "../services/api";
import { queryKeys } from "../utils/queryKeys";
import { cacheConfig } from "../config/queryConfig";

interface InfinitePhotoParams {
  query: string;
  perPage?: number;
  enabled?: boolean;
  topic?: string;
}

export const useInfinitePhotos = ({
  query,
  perPage = 12,
  enabled = true,
  topic,
}: InfinitePhotoParams) => {
  return useInfiniteQuery({
    queryKey: topic
      ? queryKeys.photos.topic(topic, 1, perPage)
      : queryKeys.photos.infinite(query, perPage),

    // QueryFn receives pageParam từ getNextPageParam
    queryFn: async ({ pageParam = 1 }) => {
      console.log(
        `🔄 Fetching page ${pageParam} for ${
          topic ? "topic: " + topic : "query: " + query
        }`
      );

      const startTime = performance.now();

      let response;
      if (topic) {
        response = await photosApi.getPhotosByTopic(topic, pageParam, perPage);
      } else {
        response = await photosApi.searchPhotos(query, pageParam, perPage);
      }

      const endTime = performance.now();
      console.log(
        `⚡ Page ${pageParam} loaded in ${(endTime - startTime).toFixed(2)}ms`
      );

      // Thêm metadata để debugging
      return {
        ...response,
        pageNumber: pageParam,
        loadTime: endTime - startTime,
        timestamp: Date.now(),
        hasMore: pageParam < response.total_pages,
      };
    },

    // Page đầu tiên
    initialPageParam: 1,

    // Logic xác định page tiếp theo
    getNextPageParam: (lastPage, allPages) => {
      const currentPage = allPages.length;
      const totalPages = lastPage.total_pages;

      console.log(`📄 Pages loaded: ${currentPage}/${totalPages}`);

      // Không có page tiếp theo
      if (currentPage >= totalPages) {
        console.log("🏁 No more pages to load");
        return undefined;
      }

      // Giới hạn số pages để tránh memory issues
      if (currentPage >= cacheConfig.infinite.maxPages) {
        console.log("🚫 Max pages limit reached");
        return undefined;
      }

      return currentPage + 1;
    },

    // Logic để xác định page trước (cho bidirectional scrolling)
    getPreviousPageParam: (firstPage, allPages) => {
      const firstPageNum = firstPage.pageNumber;
      return firstPageNum > 1 ? firstPageNum - 1 : undefined;
    },

    // Configuration
    enabled: enabled && (!!query?.trim() || !!topic),
    ...cacheConfig.infinite,

    // Select để transform data
    select: (data) => ({
      pages: data.pages,
      pageParams: data.pageParams,
      // Flatten tất cả photos từ các pages
      allPhotos: data.pages.flatMap((page) => page.results),
      // Metadata
      totalPhotos: data.pages[0]?.total || 0,
      totalPages: data.pages[0]?.total_pages || 0,
      loadedPages: data.pages.length,
      hasNextPage: data.pages[data.pages.length - 1]?.hasMore ?? false,
    }),
  });
};
```

## 2.2 Intersection Observer Implementation

```typescript
// src/hooks/useIntersectionObserver.ts
import { useCallback, useRef, useEffect } from "react";

interface UseIntersectionObserverProps {
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  rootMargin?: string;
  threshold?: number;
}

export const useIntersectionObserver = ({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  rootMargin = "100px",
  threshold = 0.1,
}: UseIntersectionObserverProps) => {
  const observer = useRef<IntersectionObserver>();

  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      // Không observe khi đang fetch
      if (isFetchingNextPage) return;

      // Disconnect observer cũ
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;

          if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
            console.log("👁️ Intersection detected - Loading more...");
            fetchNextPage();
          }
        },
        {
          rootMargin,
          threshold,
        }
      );

      // Bắt đầu observe element mới
      if (node) observer.current.observe(node);
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage, rootMargin, threshold]
  );

  // Cleanup khi unmount
  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  return { lastElementRef };
};
```

## 2.3 Advanced Infinite Grid Component

```typescript
// src/components/InfinitePhotoGrid.tsx
import React, { useState, useMemo } from "react";
import { useInfinitePhotos } from "../hooks/useInfinitePhotos";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import { OptimizedImage } from "./OptimizedImage";
import { PhotoModal } from "./PhotoModal";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { ErrorBoundary } from "./ErrorBoundary";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";

interface InfinitePhotoGridProps {
  searchQuery?: string;
  topic?: string;
  perPage?: number;
  columns?: number;
}

export const InfinitePhotoGrid: React.FC<InfinitePhotoGridProps> = ({
  searchQuery = "",
  topic,
  perPage = 12,
  columns = 4,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<UnsplashPhoto | null>(
    null
  );
  const [loadingStrategy, setLoadingStrategy] = useState<"auto" | "manual">(
    "auto"
  );

  // Infinite query hook
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfinitePhotos({
    query: searchQuery,
    topic,
    perPage,
    enabled: !!(searchQuery || topic),
  });

  // Intersection observer for auto-loading
  const { lastElementRef } = useIntersectionObserver({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage: loadingStrategy === "auto" ? fetchNextPage : () => {},
  });

  // Memoized photos list
  const allPhotos = useMemo(() => {
    return data?.allPhotos || [];
  }, [data?.allPhotos]);

  // Grid columns calculation
  const gridStyle = {
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="grid gap-4" style={gridStyle}>
        {Array.from({ length: perPage }).map((_, index) => (
          <LoadingSkeleton key={index} className="aspect-[3/4]" />
        ))}
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading photos: {error?.message}
          <Button onClick={() => refetch()} className="ml-2" size="sm">
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // No results
  if (!allPhotos.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No photos found for "{searchQuery || topic}"
        </p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-8">
        {/* Stats */}
        <div className="flex items-center gap-4">
          <Badge variant="secondary">
            {data?.totalPhotos.toLocaleString()} total photos
          </Badge>
          <Badge variant="outline">
            {allPhotos.length} loaded • Page {data?.loadedPages}/
            {data?.totalPages}
          </Badge>

          {/* Loading Strategy Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              setLoadingStrategy((prev) =>
                prev === "auto" ? "manual" : "auto"
              )
            }
          >
            {loadingStrategy === "auto" ? "🔄 Auto Load" : "👆 Manual Load"}
          </Button>
        </div>

        {/* Photo Grid */}
        <div className="grid gap-4" style={gridStyle}>
          {allPhotos.map((photo, index) => {
            const isLast = index === allPhotos.length - 1;

            return (
              <div
                key={`${photo.id}-${index}`}
                ref={isLast ? lastElementRef : null}
                className="group cursor-pointer rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200"
                onClick={() => setSelectedPhoto(photo)}
              >
                <OptimizedImage
                  src={photo.urls.small}
                  alt={photo.alt_description || photo.description || "Photo"}
                  className="w-full aspect-[3/4] object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  priority={index < 4} // Prioritize first 4 images
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="font-semibold text-sm truncate">
                      {photo.user.name}
                    </p>
                    <p className="text-xs opacity-75">@{photo.user.username}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        ❤️ {photo.likes}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        📥 {photo.downloads}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Loading more indicator */}
        {isFetchingNextPage && (
          <div className="grid gap-4" style={gridStyle}>
            {Array.from({ length: Math.min(perPage, 8) }).map((_, index) => (
              <LoadingSkeleton key={index} className="aspect-[3/4]" />
            ))}
          </div>
        )}

        {/* Manual load more button */}
        {loadingStrategy === "manual" && hasNextPage && !isFetchingNextPage && (
          <div className="text-center">
            <Button
              onClick={() => fetchNextPage()}
              size="lg"
              className="min-w-[200px]"
            >
              Load More Photos
            </Button>
          </div>
        )}

        {/* End of results */}
        {!hasNextPage && allPhotos.length > 0 && (
          <div className="text-center py-8 border-t">
            <p className="text-muted-foreground">
              🎉 You've seen all {allPhotos.length} photos!
            </p>
            <Button
              variant="outline"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="mt-4"
            >
              Back to Top
            </Button>
          </div>
        )}
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
        />
      )}
    </ErrorBoundary>
  );
};
```

## 2.4 Data Structure Deep Dive

```typescript
// useInfiniteQuery data structure
interface InfiniteQueryData {
  pages: Array<{
    results: UnsplashPhoto[];
    total: number;
    total_pages: number;
    pageNumber: number;
    loadTime: number;
    timestamp: number;
    hasMore: boolean;
  }>;
  pageParams: Array<number>; // [1, 2, 3, ...]
}

// Example data flow:
/*
Initial load:
pages: [
  { results: [photo1, photo2, ...], pageNumber: 1, total: 1000, total_pages: 100 }
]
pageParams: [1]

After scrolling (page 2):
pages: [
  { results: [photo1, photo2, ...], pageNumber: 1, total: 1000, total_pages: 100 },
  { results: [photo13, photo14, ...], pageNumber: 2, total: 1000, total_pages: 100 }
]
pageParams: [1, 2]

Flattened photos: [photo1, photo2, ..., photo13, photo14, ...]
*/

// Transform function
const transformInfiniteData = (data: InfiniteQueryData) => {
  const allPhotos = data.pages.flatMap((page) => page.results);
  const metadata = {
    totalPhotos: data.pages[0]?.total || 0,
    totalPages: data.pages[0]?.total_pages || 0,
    loadedPages: data.pages.length,
    loadTimes: data.pages.map((page) => page.loadTime),
    averageLoadTime:
      data.pages.reduce((acc, page) => acc + page.loadTime, 0) /
      data.pages.length,
  };

  return { allPhotos, metadata };
};
```

## 2.5 Performance Monitoring

```typescript
// src/hooks/useInfinitePerformance.ts
import { useEffect, useRef } from "react";

export const useInfinitePerformance = (data: any, query: string) => {
  const startTime = useRef<number>(Date.now());
  const metricsRef = useRef<PerformanceMetrics>({
    totalPages: 0,
    totalPhotos: 0,
    averageLoadTime: 0,
    cacheHitRate: 0,
    errors: [],
  });

  useEffect(() => {
    if (data?.pages) {
      const metrics = {
        totalPages: data.pages.length,
        totalPhotos: data.allPhotos?.length || 0,
        averageLoadTime:
          data.pages.reduce(
            (acc: number, page: any) => acc + (page.loadTime || 0),
            0
          ) / data.pages.length,
        sessionDuration: Date.now() - startTime.current,
      };

      // Send metrics to analytics
      console.log(`📊 Infinite Scroll Metrics for "${query}":`, metrics);

      // Performance warnings
      if (metrics.averageLoadTime > 2000) {
        console.warn(
          "⚠️ Slow loading detected:",
          metrics.averageLoadTime + "ms"
        );
      }

      if (metrics.totalPhotos > 500) {
        console.warn(
          "⚠️ High memory usage:",
          metrics.totalPhotos + " photos loaded"
        );
      }

      metricsRef.current = metrics;
    }
  }, [data, query]);

  return metricsRef.current;
};
```

---

## 3. Advanced Caching Strategies

### 3.1 Multi-Level Caching

```typescript
// src/utils/cacheStrategies.ts
export const cacheStrategies = {
  // Level 1: React Query Cache (Memory)
  memory: {
    photos: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
    },
    search: {
      staleTime: 2 * 60 * 1000, // 2 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },

  // Level 2: Browser Cache (IndexedDB/localStorage)
  persistent: {
    enabled: true,
    version: 1,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    maxSize: 50 * 1024 * 1024, // 50MB
  },

  // Level 3: Service Worker Cache
  serviceWorker: {
    strategy: "stale-while-revalidate",
    maxEntries: 100,
    maxAgeSeconds: 60 * 60 * 24, // 24 hours
  },
};

// Persistent cache implementation
class PersistentCache {
  private dbName = "unsplash-cache";
  private version = 1;
  private db: IDBDatabase | null = null;

  async init() {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Photos store
        if (!db.objectStoreNames.contains("photos")) {
          const photoStore = db.createObjectStore("photos", { keyPath: "id" });
          photoStore.createIndex("timestamp", "timestamp");
          photoStore.createIndex("query", "query");
        }

        // Search results store
        if (!db.objectStoreNames.contains("searches")) {
          const searchStore = db.createObjectStore("searches", {
            keyPath: "key",
          });
          searchStore.createIndex("timestamp", "timestamp");
        }
      };
    });
  }

  async setPhoto(photo: UnsplashPhoto, query?: string) {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction(["photos"], "readwrite");
    const store = transaction.objectStore("photos");

    await store.put({
      ...photo,
      timestamp: Date.now(),
      query: query || "random",
    });
  }

  async getPhoto(id: string): Promise<UnsplashPhoto | null> {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction(["photos"], "readonly");
    const store = transaction.objectStore("photos");
    const result = await store.get(id);

    // Check if expired
    if (
      result &&
      Date.now() - result.timestamp > cacheStrategies.persistent.maxAge
    ) {
      await this.deletePhoto(id);
      return null;
    }

    return result || null;
  }

  async setSearchResults(key: string, results: any) {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction(["searches"], "readwrite");
    const store = transaction.objectStore("searches");

    await store.put({
      key,
      results,
      timestamp: Date.now(),
    });
  }

  async getSearchResults(key: string) {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction(["searches"], "readonly");
    const store = transaction.objectStore("searches");
    const result = await store.get(key);

    if (
      result &&
      Date.now() - result.timestamp > cacheStrategies.persistent.maxAge
    ) {
      await this.deleteSearchResults(key);
      return null;
    }

    return result?.results || null;
  }

  async cleanup() {
    if (!this.db) return;

    const cutoff = Date.now() - cacheStrategies.persistent.maxAge;

    // Cleanup photos
    const photoTransaction = this.db.transaction(["photos"], "readwrite");
    const photoStore = photoTransaction.objectStore("photos");
    const photoIndex = photoStore.index("timestamp");
    const photoCursor = await photoIndex.openCursor(
      IDBKeyRange.upperBound(cutoff)
    );

    while (photoCursor) {
      await photoCursor.delete();
      photoCursor.continue();
    }

    // Cleanup searches
    const searchTransaction = this.db.transaction(["searches"], "readwrite");
    const searchStore = searchTransaction.objectStore("searches");
    const searchIndex = searchStore.index("timestamp");
    const searchCursor = await searchIndex.openCursor(
      IDBKeyRange.upperBound(cutoff)
    );

    while (searchCursor) {
      await searchCursor.delete();
      searchCursor.continue();
    }
  }
}

export const persistentCache = new PersistentCache();
```

### 3.2 Smart Prefetching

```typescript
// src/hooks/usePrefetch.ts
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../utils/queryKeys";
import { photosApi } from "../services/api";

export const usePrefetch = () => {
  const queryClient = useQueryClient();

  // Prefetch next page của infinite query
  const prefetchNextPage = async (
    query: string,
    currentPage: number,
    perPage: number
  ) => {
    const nextPage = currentPage + 1;

    await queryClient.prefetchQuery({
      queryKey: queryKeys.photos.search(query, nextPage, perPage),
      queryFn: () => photosApi.searchPhotos(query, nextPage, perPage),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });

    console.log(`🔮 Prefetched page ${nextPage} for query: ${query}`);
  };

  // Prefetch popular searches
  const prefetchPopularSearches = async () => {
    const popularQueries = [
      "nature",
      "portrait",
      "landscape",
      "architecture",
      "street",
    ];

    const promises = popularQueries.map((query) =>
      queryClient.prefetchQuery({
        queryKey: queryKeys.photos.search(query, 1, 12),
        queryFn: () => photosApi.searchPhotos(query, 1, 12),
        staleTime: 10 * 60 * 1000, // 10 minutes
      })
    );

    await Promise.all(promises);
    console.log("🔮 Prefetched popular searches");
  };

  // Prefetch photo details on hover
  const prefetchPhotoDetails = async (photoId: string) => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.photos.detail(photoId),
      queryFn: () => photosApi.getPhotoById(photoId),
      staleTime: 15 * 60 * 1000, // 15 minutes
    });

    console.log(`🔮 Prefetched photo details: ${photoId}`);
  };

  // Smart prefetching based on user behavior
  const smartPrefetch = async (context: {
    currentQuery: string;
    currentPage: number;
    scrollPosition: number;
    viewportHeight: number;
  }) => {
    const { currentQuery, currentPage, scrollPosition, viewportHeight } =
      context;

    // Prefetch next page when user is 80% through current content
    const threshold = 0.8;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollPercentage = (scrollPosition + viewportHeight) / documentHeight;

    if (scrollPercentage > threshold) {
      await prefetchNextPage(currentQuery, currentPage, 12);
    }
  };

  return {
    prefetchNextPage,
    prefetchPopularSearches,
    prefetchPhotoDetails,
    smartPrefetch,
  };
};
```

---

## 4. Performance & Optimization

### 4.1 Virtual Scrolling Implementation

```typescript
// src/components/VirtualInfiniteGrid.tsx
import React, { useMemo } from "react";
import { FixedSizeGrid as Grid } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import { useInfinitePhotos } from "../hooks/useInfinitePhotos";

interface VirtualInfiniteGridProps {
  query: string;
  itemWidth: number;
  itemHeight: number;
  columnsCount: number;
}

export const VirtualInfiniteGrid: React.FC<VirtualInfiniteGridProps> = ({
  query,
  itemWidth = 250,
  itemHeight = 350,
  columnsCount = 4,
}) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfinitePhotos({ query, perPage: 20 });

  const allPhotos = useMemo(() => data?.allPhotos || [], [data]);
  const itemCount = hasNextPage ? allPhotos.length + 1 : allPhotos.length;
  const rowCount = Math.ceil(itemCount / columnsCount);

  // Check if item is loaded
  const isItemLoaded = (index: number) => !!allPhotos[index];

  // Load more items
  const loadMoreItems = isFetchingNextPage ? () => {} : fetchNextPage;

  // Grid cell renderer
  const Cell = ({ columnIndex, rowIndex, style }: any) => {
    const index = rowIndex * columnsCount + columnIndex;
    const photo = allPhotos[index];

    if (!photo) {
      return (
        <div style={style} className="p-2">
          <div className="w-full h-full bg-gray-200 animate-pulse rounded" />
        </div>
      );
    }

    return (
      <div style={style} className="p-2">
        <div className="w-full h-full rounded overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
          <img
            src={photo.urls.small}
            alt={photo.alt_description || ""}
            className="w-full h-4/5 object-cover"
            loading="lazy"
          />
          <div className="p-2 h-1/5">
            <p className="text-xs font-semibold truncate">{photo.user.name}</p>
            <p className="text-xs text-gray-600 truncate">
              @{photo.user.username}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-[600px]">
      <InfiniteLoader
        isItemLoaded={isItemLoaded}
        itemCount={itemCount}
        loadMoreItems={loadMoreItems}
      >
        {({ onItemsRendered, ref }) => (
          <Grid
            ref={ref}
            columnCount={columnsCount}
            columnWidth={itemWidth}
            height={600}
            rowCount={rowCount}
            rowHeight={itemHeight}
            width={columnsCount * itemWidth}
            onItemsRendered={({
              visibleRowStartIndex,
              visibleRowStopIndex,
              visibleColumnStartIndex,
              visibleColumnStopIndex,
            }) => {
              onItemsRendered({
                overscanStartIndex:
                  visibleRowStartIndex * columnsCount + visibleColumnStartIndex,
                overscanStopIndex:
                  visibleRowStopIndex * columnsCount + visibleColumnStopIndex,
                visibleStartIndex:
                  visibleRowStartIndex * columnsCount + visibleColumnStartIndex,
                visibleStopIndex:
                  visibleRowStopIndex * columnsCount + visibleColumnStopIndex,
              });
            }}
          >
            {Cell}
          </Grid>
        )}
      </InfiniteLoader>
    </div>
  );
};
```

### 4.2 Image Optimization

```typescript
// src/components/OptimizedImage.tsx
import React, { useState, useEffect, useRef } from "react";
import { Skeleton } from "./ui/skeleton";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = "",
  sizes = "100vw",
  priority = false,
  placeholder = "empty",
  blurDataURL,
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver>();

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      {
        rootMargin: "50px", // Start loading 50px before image comes into view
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [priority, isInView]);

  // Generate optimized image URLs
  const generateSrcSet = (originalSrc: string) => {
    // Unsplash URL parameters for optimization
    const baseUrl = originalSrc.split("?")[0];
    const widths = [400, 800, 1200, 1600];

    return widths
      .map((width) => `${baseUrl}?w=${width}&q=80&fm=webp 1x`)
      .join(", ");
  };

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setError(true);
    onError?.();
  };

  if (error) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
      >
        <span className="text-gray-500 text-sm">Failed to load image</span>
      </div>
    );
  }

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {/* Loading placeholder */}
      {!isLoaded && (
        <>
          {placeholder === "blur" && blurDataURL ? (
            <img
              src={blurDataURL}
              alt=""
              className="absolute inset-0 w-full h-full object-cover filter blur-md scale-110"
            />
          ) : (
            <Skeleton className="absolute inset-0 w-full h-full" />
          )}
        </>
      )}

      {/* Actual image */}
      {isInView && (
        <img
          src={src}
          srcSet={generateSrcSet(src)}
          sizes={sizes}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          } ${className}`}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
        />
      )}
    </div>
  );
};
```

### 4.3 Memory Management

```typescript
// src/hooks/useMemoryManagement.ts
import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

export const useMemoryManagement = () => {
  const queryClient = useQueryClient();
  const memoryThreshold = 100 * 1024 * 1024; // 100MB

  const checkMemoryUsage = () => {
    if ("memory" in performance) {
      const memInfo = (performance as any).memory;
      const usedMemory = memInfo.usedJSHeapSize;

      console.log(
        `💾 Memory usage: ${(usedMemory / 1024 / 1024).toFixed(2)}MB`
      );

      if (usedMemory > memoryThreshold) {
        console.warn("⚠️ High memory usage detected, cleaning up cache");
        cleanupCache();
      }
    }
  };

  const cleanupCache = () => {
    // Remove old infinite query pages
    const cache = queryClient.getQueryCache();
    const queries = cache.getAll();

    queries.forEach((query) => {
      if (
        query.queryKey[0] === "photos" &&
        query.queryKey.includes("infinite")
      ) {
        const data = query.state.data as any;
        if (data?.pages && data.pages.length > 5) {
          // Keep only last 3 pages
          const newData = {
            ...data,
            pages: data.pages.slice(-3),
            pageParams: data.pageParams.slice(-3),
          };
          queryClient.setQueryData(query.queryKey, newData);
        }
      }
    });

    // Force garbage collection if available
    if ("gc" in window) {
      (window as any).gc();
    }
  };

  useEffect(() => {
    const interval = setInterval(checkMemoryUsage, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  return { checkMemoryUsage, cleanupCache };
};
```

---

## 5. Error Handling & Retry Logic

### 5.1 Advanced Error Handling

```typescript
// src/utils/errorHandling.ts
export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public retryable: boolean = true
  ) {
    super(message);
    this.name = "APIError";
  }
}

export const errorClassifier = (error: any): APIError => {
  if (error.response) {
    const { status, data } = error.response;

    switch (status) {
      case 400:
        return new APIError("Bad Request", status, "BAD_REQUEST", false);
      case 401:
        return new APIError("Unauthorized", status, "UNAUTHORIZED", false);
      case 403:
        return new APIError("Rate limit exceeded", status, "RATE_LIMIT", true);
      case 404:
        return new APIError("Not found", status, "NOT_FOUND", false);
      case 500:
        return new APIError("Server error", status, "SERVER_ERROR", true);
      case 503:
        return new APIError(
          "Service unavailable",
          status,
          "SERVICE_UNAVAILABLE",
          true
        );
      default:
        return new APIError(
          data?.message || "Unknown error",
          status,
          "UNKNOWN",
          true
        );
    }
  }

  if (error.code === "NETWORK_ERROR") {
    return new APIError("Network error", 0, "NETWORK_ERROR", true);
  }

  return new APIError(error.message || "Unknown error", 0, "UNKNOWN", true);
};

// Retry configuration
export const retryConfig = {
  retries: 3,
  retryDelay: (attemptIndex: number, error: APIError) => {
    // Exponential backoff with jitter
    const baseDelay = Math.min(1000 * Math.pow(2, attemptIndex), 30000);
    const jitter = Math.random() * 1000;

    // Longer delay for rate limit errors
    if (error.code === "RATE_LIMIT") {
      return baseDelay * 2 + jitter;
    }

    return baseDelay + jitter;
  },
  retryCondition: (error: APIError) => {
    return error.retryable && error.status !== 401 && error.status !== 404;
  },
};
```

### 5.2 Error Boundary with Recovery

```typescript
// src/components/ErrorBoundary.tsx
import React, { Component, ReactNode } from "react";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { RefreshCw, AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: any) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
  retryCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("🚨 Error Boundary caught an error:", error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    this.props.onError?.(error, errorInfo);

    // Send to error reporting service
    this.reportError(error, errorInfo);
  }

  reportError = (error: Error, errorInfo: any) => {
    // Send to analytics/error reporting
    console.log("📊 Reporting error to analytics:", {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    });
  };

  handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState((prevState) => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1,
      }));
    } else {
      // Max retries reached, offer page reload
      window.location.reload();
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="max-w-md w-full">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="mt-2">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Something went wrong</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {this.state.error?.message ||
                        "An unexpected error occurred"}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {this.state.retryCount < this.maxRetries ? (
                      <Button
                        onClick={this.handleRetry}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <RefreshCw className="h-3 w-3" />
                        Try Again ({this.maxRetries -
                          this.state.retryCount} left)
                      </Button>
                    ) : (
                      <Button
                        onClick={this.handleReload}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <RefreshCw className="h-3 w-3" />
                        Reload Page
                      </Button>
                    )}
                  </div>

                  {process.env.NODE_ENV === "development" && (
                    <details className="mt-4">
                      <summary className="cursor-pointer text-xs">
                        Debug Info
                      </summary>
                      <pre className="text-xs mt-2 p-2 bg-gray-100 rounded overflow-auto">
                        {this.state.error?.stack}
                      </pre>
                    </details>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

## 6. Project Architecture Patterns

### 6.1 Service Layer Pattern

```typescript
// src/services/photoService.ts
import { photosApi } from "./api";
import { persistentCache } from "../utils/cacheStrategies";
import { errorClassifier } from "../utils/errorHandling";

export class PhotoService {
  private static instance: PhotoService;

  static getInstance(): PhotoService {
    if (!PhotoService.instance) {
      PhotoService.instance = new PhotoService();
    }
    return PhotoService.instance;
  }

  async getRandomPhotos(
    count: number,
    query?: string,
    useCache = true
  ): Promise<UnsplashPhoto[]> {
    const cacheKey = `random-${count}-${query || "all"}`;

    // Try cache first
    if (useCache) {
      const cached = await persistentCache.getSearchResults(cacheKey);
      if (cached) {
        console.log("📦 Cache hit for random photos");
        return cached;
      }
    }

    try {
      const photos = await photosApi.getRandomPhotos(count, query);

      // Cache results
      await persistentCache.setSearchResults(cacheKey, photos);

      // Cache individual photos
      await Promise.all(
        photos.map((photo) => persistentCache.setPhoto(photo, query))
      );

      return photos;
    } catch (error) {
      const apiError = errorClassifier(error);
      console.error("❌ Error fetching random photos:", apiError);
      throw apiError;
    }
  }

  async searchPhotos(
    query: string,
    page: number,
    perPage: number,
    useCache = true
  ): Promise<PhotosSearchResponse> {
    const cacheKey = `search-${query}-${page}-${perPage}`;

    if (useCache) {
      const cached = await persistentCache.getSearchResults(cacheKey);
      if (cached) {
        console.log("📦 Cache hit for search:", query);
        return cached;
      }
    }

    try {
      const response = await photosApi.searchPhotos(query, page, perPage);

      // Cache results
      await persistentCache.setSearchResults(cacheKey, response);

      // Cache individual photos
      await Promise.all(
        response.results.map((photo) => persistentCache.setPhoto(photo, query))
      );

      return response;
    } catch (error) {
      const apiError = errorClassifier(error);
      console.error("❌ Error searching photos:", apiError);
      throw apiError;
    }
  }

  async getPhotoById(id: string, useCache = true): Promise<UnsplashPhoto> {
    if (useCache) {
      const cached = await persistentCache.getPhoto(id);
      if (cached) {
        console.log("📦 Cache hit for photo:", id);
        return cached;
      }
    }

    try {
      const photo = await photosApi.getPhotoById(id);
      await persistentCache.setPhoto(photo);
      return photo;
    } catch (error) {
      const apiError = errorClassifier(error);
      console.error("❌ Error fetching photo:", apiError);
      throw apiError;
    }
  }

  // Batch operations
  async preloadPhotos(photos: UnsplashPhoto[]) {
    const promises = photos.map((photo) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = photo.urls.small;
      });
    });

    try {
      await Promise.allSettled(promises);
      console.log("🖼️ Preloaded photos");
    } catch (error) {
      console.warn("⚠️ Some photos failed to preload");
    }
  }
}

export const photoService = PhotoService.getInstance();
```

### 6.2 State Management Pattern

```typescript
// src/store/useAppStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AppState {
  // UI State
  theme: "light" | "dark";
  sidebarOpen: boolean;
  gridColumns: number;

  // User Preferences
  preferences: {
    imageQuality: "low" | "medium" | "high";
    autoLoadMore: boolean;
    showImageInfo: boolean;
    defaultPageSize: number;
  };

  // Recent Activity
  recentSearches: string[];
  recentPhotos: string[];
  favorites: string[];

  // Actions
  setTheme: (theme: "light" | "dark") => void;
  toggleSidebar: () => void;
  setGridColumns: (columns: number) => void;
  updatePreferences: (preferences: Partial<AppState["preferences"]>) => void;
  addRecentSearch: (query: string) => void;
  addRecentPhoto: (photoId: string) => void;
  toggleFavorite: (photoId: string) => void;
  clearRecentSearches: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      theme: "light",
      sidebarOpen: false,
      gridColumns: 4,
      preferences: {
        imageQuality: "medium",
        autoLoadMore: true,
        showImageInfo: true,
        defaultPageSize: 12,
      },
      recentSearches: [],
      recentPhotos: [],
      favorites: [],

      // Actions
      setTheme: (theme) => set({ theme }),

      toggleSidebar: () =>
        set((state) => ({
          sidebarOpen: !state.sidebarOpen,
        })),

      setGridColumns: (columns) => set({ gridColumns: columns }),

      updatePreferences: (newPreferences) =>
        set((state) => ({
          preferences: { ...state.preferences, ...newPreferences },
        })),

      addRecentSearch: (query) =>
        set((state) => {
          const filtered = state.recentSearches.filter((s) => s !== query);
          return {
            recentSearches: [query, ...filtered].slice(0, 10), // Keep last 10
          };
        }),

      addRecentPhoto: (photoId) =>
        set((state) => {
          const filtered = state.recentPhotos.filter((id) => id !== photoId);
          return {
            recentPhotos: [photoId, ...filtered].slice(0, 50), // Keep last 50
          };
        }),

      toggleFavorite: (photoId) =>
        set((state) => {
          const isFavorite = state.favorites.includes(photoId);
          return {
            favorites: isFavorite
              ? state.favorites.filter((id) => id !== photoId)
              : [...state.favorites, photoId],
          };
        }),

      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    {
      name: "unsplash-app-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        preferences: state.preferences,
        recentSearches: state.recentSearches,
        recentPhotos: state.recentPhotos,
        favorites: state.favorites,
      }),
    }
  )
);
```

---

## 7. Best Practices

### 7.1 Performance Best Practices

```typescript
// ✅ DO: Use proper query keys
const queryKey = ['photos', 'search', { query, page, filters }];

// ❌ DON'T: Use primitive values that change frequently
const queryKey = ['photos', Date.now()];

// ✅ DO: Implement proper error boundaries
<ErrorBoundary fallback={<ErrorFallback />}>
  <InfinitePhotoGrid />
</ErrorBoundary>

// ❌ DON'T: Let errors crash the entire app

// ✅ DO: Use proper cache configuration
staleTime: 5 * 60 * 1000, // 5 minutes for dynamic content
gcTime: 30 * 60 * 1000,   // 30 minutes garbage collection

// ❌ DON'T: Use default cache settings for everything

// ✅ DO: Implement proper loading states
{isLoading && <LoadingSkeleton />}
{isFetchingNextPage && <LoadingMore />}

// ❌ DON'T: Show empty states while loading
```

### 7.2 UX Best Practices

```typescript
// ✅ DO: Show meaningful loading states
const LoadingSkeleton = () => (
  <div className="grid grid-cols-4 gap-4">
    {Array.from({ length: 12 }).map((_, i) => (
      <Skeleton key={i} className="aspect-[3/4]" />
    ))}
  </div>
);

// ✅ DO: Implement proper error recovery
const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <Alert>
    <AlertDescription>
      Failed to load photos.
      <Button onClick={onRetry}>Try Again</Button>
    </AlertDescription>
  </Alert>
);

// ✅ DO: Provide visual feedback for user actions
const [isAdding, setIsAdding] = useState(false);
const handleAddToFavorites = async () => {
  setIsAdding(true);
  await addToFavorites(photoId);
  setIsAdding(false);
  toast.success("Added to favorites!");
};
```

### 7.3 Code Organization

```
src/
├── components/
│   ├── ui/              # Shadcn UI components
│   ├── layout/          # Layout components
│   ├── features/        # Feature-specific components
│   └── common/          # Reusable components
├── hooks/
│   ├── usePhotos.ts     # Photo-related hooks
│   ├── useInfinite.ts   # Infinite scroll hooks
│   └── useApp.ts        # App-wide hooks
├── services/
│   ├── api.ts           # API layer
│   ├── photoService.ts  # Business logic
│   └── cacheService.ts  # Cache management
├── utils/
│   ├── queryKeys.ts     # Query key factory
│   ├── constants.ts     # App constants
│   └── helpers.ts       # Utility functions
├── types/
│   ├── api.ts           # API types
│   ├── app.ts           # App types
│   └── index.ts         # Type exports
└── config/
    ├── queryClient.ts   # React Query config
    └── constants.ts     # Configuration constants
```

---

## 🎯 Kết luận

React Query với Infinite Loading trong project Unsplash Clone mang lại:

- **🚀 Performance tốt**: Caching thông minh, lazy loading, virtual scrolling
- **💪 Reliability cao**: Error handling, retry logic, offline support
- **🎨 UX mượt mà**: Loading states, optimistic updates, smooth scrolling
- **🔧 Maintainable**: Clean architecture, reusable hooks, proper separation
- **📊 Observable**: Performance monitoring, analytics, debugging tools

Những concepts này tạo nên một ứng dụng modern, scalable và user-friendly! 🌟
