import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// Types
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
  user: {
    id: string;
    username: string;
    name: string;
    profile_image: {
      small: string;
      medium: string;
      large: string;
    };
  };
  likes: number;
  downloads: number;
}

export interface PhotosState {
  photos: UnsplashPhoto[];
  isLoading: boolean;
  error: string | null;
  count: number;
  searchQuery: string;
}

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Async thunks
export const fetchRandomPhotos = createAsyncThunk(
  "photos/fetchRandomPhotos",
  async (
    { count, query }: { count: number; query?: string },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams();
      params.append("count", count.toString());
      if (query) {
        params.append("query", query);
      }

      const response = await api.get(`/photos/random?${params.toString()}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const searchPhotos = createAsyncThunk(
  "photos/searchPhotos",
  async (
    {
      query,
      page = 1,
      perPage = 10,
    }: { query: string; page?: number; perPage?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get("/photos/search", {
        params: { query, page, perPage },
      });
      return response.data.results;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

// Initial state
const initialState: PhotosState = {
  photos: [],
  isLoading: false,
  error: null,
  count: 10,
  searchQuery: "",
};

// Slice
const photosSlice = createSlice({
  name: "photos",
  initialState,
  reducers: {
    setCount: (state, action: PayloadAction<number>) => {
      state.count = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearPhotos: (state) => {
      state.photos = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchRandomPhotos
      .addCase(fetchRandomPhotos.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRandomPhotos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.photos = action.payload;
        state.error = null;
      })
      .addCase(fetchRandomPhotos.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // searchPhotos
      .addCase(searchPhotos.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchPhotos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.photos = action.payload;
        state.error = null;
      })
      .addCase(searchPhotos.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCount, setSearchQuery, clearError, clearPhotos } =
  photosSlice.actions;
export default photosSlice.reducer;
