import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { photosApi, PhotosSearchResponse } from "../services/api";

// Query keys for consistent caching
export const photoQueryKeys = {
  all: ["photos"] as const,
  random: (count: number, query?: string) =>
    [...photoQueryKeys.all, "random", count, query] as const,
  search: (query: string, perPage: number) =>
    [...photoQueryKeys.all, "search", query, perPage] as const,
  topic: (topic: string, perPage: number) =>
    [...photoQueryKeys.all, "topic", topic, perPage] as const,
  detail: (id: string) => [...photoQueryKeys.all, "detail", id] as const,
};

// Hook for fetching random photos
export const useRandomPhotos = (count: number = 10, query?: string) => {
  return useQuery({
    queryKey: photoQueryKeys.random(count, query),
    queryFn: () => photosApi.getRandomPhotos(count, query),
    enabled: count > 0, // Only fetch if count is positive
    staleTime: 2 * 60 * 1000, // 2 minutes - fresh data for random photos
    gcTime: 5 * 60 * 1000, // 5 minutes cache
  });
};

// Hook for searching photos with infinite loading
export const useSearchPhotos = (query: string, perPage: number = 10) => {
  return useInfiniteQuery({
    queryKey: photoQueryKeys.search(query, perPage),
    queryFn: ({ pageParam = 1 }) =>
      photosApi.searchPhotos(query, pageParam, perPage),
    initialPageParam: 1,
    getNextPageParam: (lastPage: PhotosSearchResponse, pages) => {
      const nextPage = pages.length + 1;
      return nextPage <= lastPage.total_pages ? nextPage : undefined;
    },
    enabled: query.trim().length > 0, // Only search if query is not empty
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes cache
  });
};

// Hook for simple search photos (single page)
export const useSearchPhotosSimple = (
  query: string,
  page: number = 1,
  perPage: number = 10
) => {
  return useQuery({
    queryKey: [...photoQueryKeys.search(query, perPage), page],
    queryFn: () => photosApi.searchPhotos(query, page, perPage),
    enabled: query.trim().length > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Hook for fetching photos by topic
export const usePhotosByTopic = (topic: string, perPage: number = 10) => {
  return useInfiniteQuery({
    queryKey: photoQueryKeys.topic(topic, perPage),
    queryFn: ({ pageParam = 1 }) =>
      photosApi.getPhotosByTopic(topic, pageParam, perPage),
    initialPageParam: 1,
    getNextPageParam: (lastPage: PhotosSearchResponse, pages) => {
      const nextPage = pages.length + 1;
      return nextPage <= lastPage.total_pages ? nextPage : undefined;
    },
    enabled: topic.trim().length > 0,
    staleTime: 10 * 60 * 1000, // 10 minutes for topic photos
    gcTime: 30 * 60 * 1000, // 30 minutes cache
  });
};

// Hook for fetching single photo details
export const usePhotoDetail = (id: string) => {
  return useQuery({
    queryKey: photoQueryKeys.detail(id),
    queryFn: () => photosApi.getPhotoById(id),
    enabled: !!id,
    staleTime: 15 * 60 * 1000, // 15 minutes - photo details don't change often
    gcTime: 60 * 60 * 1000, // 1 hour cache
  });
};

// Hook for infinite loading of random photos
export const useInfinitePhotos = (
  searchQuery?: string,
  topic?: string,
  perPage: number = 10
) => {
  // If there's a search query, use search photos
  if (searchQuery && typeof searchQuery === "string" && searchQuery.trim()) {
    return useSearchPhotos(searchQuery, perPage);
  }

  // If there's a topic, use topic photos
  if (topic && typeof topic === "string" && topic.trim()) {
    return usePhotosByTopic(topic, perPage);
  }

  // For random photos, we'll use a simple infinite query
  return useInfiniteQuery({
    queryKey: [...photoQueryKeys.all, "infinite", perPage],
    queryFn: () => {
      // For random photos, we ignore pageParam since each call returns different photos
      return photosApi.getRandomPhotos(perPage).then((photos) => ({
        results: photos,
        total: 1000, // Assume large number for random photos
        total_pages: 100, // Allow many pages
      }));
    },
    initialPageParam: 1,
    getNextPageParam: (_lastPage, pages) => {
      const nextPage = pages.length + 1;
      return nextPage <= 100 ? nextPage : undefined; // Allow up to 100 pages
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes cache
  });
};

// Utility hook to prefetch photos
export const usePrefetchPhotos = () => {
  return {
    prefetchRandom: (count: number, query?: string) => {
      return photosApi.getRandomPhotos(count, query);
    },
    prefetchSearch: (query: string, page: number = 1, perPage: number = 10) => {
      return photosApi.searchPhotos(query, page, perPage);
    },
  };
};
