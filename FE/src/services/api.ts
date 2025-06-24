import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export interface UnsplashPhoto {
  id: string;
  created_at: string;
  updated_at: string;
  width: number;
  height: number;
  color: string;
  description: string | null;
  alt_description: string | null;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  links: {
    html: string;
    download: string;
  };
  user: {
    id: string;
    username: string;
    name: string;
    total_photos: number;
    total_likes: number;
    profile_image: {
      small: string;
      medium: string;
      large: string;
    };
  };
  likes: number;
  downloads: number;
  views?: number;
  tags?: Array<{
    title: string;
  }>;
}

export interface PhotosSearchResponse {
  results: UnsplashPhoto[];
  total: number;
  total_pages: number;
}

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making API request to: ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API response received from: ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const photosApi = {
  // Get random photos
  getRandomPhotos: async (
    count: number = 10,
    query?: string
  ): Promise<UnsplashPhoto[]> => {
    const params: any = { count };
    if (query) {
      params.query = query;
    }

    const response = await api.get("/photos/random", { params });
    return response.data;
  },

  // Search photos
  searchPhotos: async (
    query: string,
    page: number = 1,
    perPage: number = 10
  ): Promise<PhotosSearchResponse> => {
    const response = await api.get("/photos/search", {
      params: { query, page, perPage },
    });
    return response.data;
  },

  // Get photos by topic
  getPhotosByTopic: async (
    topic: string,
    page: number = 1,
    perPage: number = 10
  ): Promise<PhotosSearchResponse> => {
    const response = await api.get(`/photos/topic/${topic}`, {
      params: { page, perPage },
    });
    return response.data;
  },

  // Get photo by ID
  getPhotoById: async (id: string): Promise<UnsplashPhoto> => {
    const response = await api.get(`/photos/detail/${id}`);
    return response.data;
  },
};

export default api;

// Export individual functions for convenience
export const fetchPhotoById = photosApi.getPhotoById;
export const fetchRandomPhotos = photosApi.getRandomPhotos;
export const searchPhotos = photosApi.searchPhotos;
export const fetchPhotosByTopic = photosApi.getPhotosByTopic;
