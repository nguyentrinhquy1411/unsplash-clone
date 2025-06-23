import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';

export interface UnsplashPhoto {
  id: string;
  created_at: string;
  updated_at: string;
  width: number;
  height: number;
  color: string;
  description: string;
  alt_description: string;
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

@Injectable()
export class PhotosService {
  private readonly unsplashBaseUrl = 'https://api.unsplash.com';
  private readonly accessKey: string;
  private readonly isDevelopment: boolean;

  // Simple in-memory cache to reduce API calls
  private cache = new Map<string, { data: any; timestamp: number }>();
  private CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.accessKey =
      this.configService.get<string>('UNSPLASH_ACCESS_KEY') || '';
    this.isDevelopment =
      this.configService.get<string>('NODE_ENV') !== 'production';
  }
  async getRandomPhotos(
    count: number = 10,
    query?: string,
  ): Promise<UnsplashPhoto[]> {
    const cacheKey = `random-${count}-${query || 'no-query'}`;

    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      console.log('Returning cached photos');
      return cached.data;
    }

    // In development mode, use mock data to avoid rate limits
    if (this.isDevelopment) {
      console.log('Development mode: using mock data to avoid rate limits');
      const mockData = this.getMockPhotos(count);
      // Cache mock data too
      this.cache.set(cacheKey, { data: mockData, timestamp: Date.now() });
      return mockData;
    }

    try {
      const url = query
        ? `${this.unsplashBaseUrl}/search/photos`
        : `${this.unsplashBaseUrl}/photos/random`;

      const params = query
        ? { query, per_page: count, client_id: this.accessKey }
        : { count, client_id: this.accessKey };

      console.log('Making API request to:', url);
      const response = await axios.get(url, {
        params,
        timeout: 10000,
        headers: {
          'User-Agent': 'Unsplash-Clone-App/1.0',
        },
      });

      const data = query ? response.data.results : response.data;

      // Cache the result
      this.cache.set(cacheKey, { data, timestamp: Date.now() });

      console.log('Successfully fetched photos from API');
      return data;
    } catch (error) {
      console.error('Error fetching photos from Unsplash:', error);

      // Return mock data as fallback
      const mockData = this.getMockPhotos(count);
      console.log('Returning mock data as fallback');
      return mockData;
    }
  }

  private getMockPhotos(count: number): UnsplashPhoto[] {
    const mockPhotos: UnsplashPhoto[] = [
      {
        id: 'mock-1',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        width: 4000,
        height: 6000,
        color: '#0c4a6e',
        description: 'Beautiful landscape',
        alt_description: 'Mountain landscape at sunset',
        urls: {
          raw: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3',
          full: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&q=85',
          regular:
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&q=80&w=1080',
          small:
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&q=80&w=400',
          thumb:
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&q=80&w=200',
        },
        user: {
          id: 'mock-user-1',
          username: 'naturephotographer',
          name: 'Nature Photographer',
          profile_image: {
            small:
              'https://images.unsplash.com/placeholder-avatars/extra-large.jpg?ixlib=rb-4.0.3&crop=faces&fit=crop&w=32&h=32',
            medium:
              'https://images.unsplash.com/placeholder-avatars/extra-large.jpg?ixlib=rb-4.0.3&crop=faces&fit=crop&w=64&h=64',
            large:
              'https://images.unsplash.com/placeholder-avatars/extra-large.jpg?ixlib=rb-4.0.3&crop=faces&fit=crop&w=128&h=128',
          },
        },
        likes: 1248,
        downloads: 892,
      },
      {
        id: 'mock-2',
        created_at: '2023-01-02T00:00:00Z',
        updated_at: '2023-01-02T00:00:00Z',
        width: 3000,
        height: 4000,
        color: '#f59e0b',
        description: 'Urban architecture',
        alt_description: 'Modern building with glass facade',
        urls: {
          raw: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3',
          full: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&q=85',
          regular:
            'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&q=80&w=1080',
          small:
            'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&q=80&w=400',
          thumb:
            'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&q=80&w=200',
        },
        user: {
          id: 'mock-user-2',
          username: 'architecturist',
          name: 'Architecture Enthusiast',
          profile_image: {
            small:
              'https://images.unsplash.com/placeholder-avatars/extra-large.jpg?ixlib=rb-4.0.3&crop=faces&fit=crop&w=32&h=32',
            medium:
              'https://images.unsplash.com/placeholder-avatars/extra-large.jpg?ixlib=rb-4.0.3&crop=faces&fit=crop&w=64&h=64',
            large:
              'https://images.unsplash.com/placeholder-avatars/extra-large.jpg?ixlib=rb-4.0.3&crop=faces&fit=crop&w=128&h=128',
          },
        },
        likes: 2156,
        downloads: 1423,
      },
      {
        id: 'mock-3',
        created_at: '2023-01-03T00:00:00Z',
        updated_at: '2023-01-03T00:00:00Z',
        width: 5000,
        height: 3000,
        color: '#10b981',
        description: 'Ocean waves',
        alt_description: 'Turquoise ocean with white foam waves',
        urls: {
          raw: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?ixlib=rb-4.0.3',
          full: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?ixlib=rb-4.0.3&q=85',
          regular:
            'https://images.unsplash.com/photo-1505142468610-359e7d316be0?ixlib=rb-4.0.3&q=80&w=1080',
          small:
            'https://images.unsplash.com/photo-1505142468610-359e7d316be0?ixlib=rb-4.0.3&q=80&w=400',
          thumb:
            'https://images.unsplash.com/photo-1505142468610-359e7d316be0?ixlib=rb-4.0.3&q=80&w=200',
        },
        user: {
          id: 'mock-user-3',
          username: 'oceanvibes',
          name: 'Ocean Photographer',
          profile_image: {
            small:
              'https://images.unsplash.com/placeholder-avatars/extra-large.jpg?ixlib=rb-4.0.3&crop=faces&fit=crop&w=32&h=32',
            medium:
              'https://images.unsplash.com/placeholder-avatars/extra-large.jpg?ixlib=rb-4.0.3&crop=faces&fit=crop&w=64&h=64',
            large:
              'https://images.unsplash.com/placeholder-avatars/extra-large.jpg?ixlib=rb-4.0.3&crop=faces&fit=crop&w=128&h=128',
          },
        },
        likes: 892,
        downloads: 654,
      },
    ]; // Return requested number of photos (cycling through if needed)
    const result: UnsplashPhoto[] = [];
    for (let i = 0; i < count; i++) {
      result.push(mockPhotos[i % mockPhotos.length]);
    }
    return result;
  }
  async getPhotosByTopic(
    topic: string,
    page: number = 1,
    perPage: number = 10,
  ): Promise<{
    results: UnsplashPhoto[];
    total: number;
    total_pages: number;
  }> {
    const cacheKey = `topic-${topic}-${page}-${perPage}`;

    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      console.log('Returning cached topic photos');
      return cached.data;
    }

    try {
      const response = await axios.get(
        `${this.unsplashBaseUrl}/search/photos`,
        {
          params: {
            query: topic,
            page,
            per_page: perPage,
            client_id: this.accessKey,
          },
          timeout: 10000,
          headers: {
            'User-Agent': 'Unsplash-Clone-App/1.0',
          },
        },
      );

      const data = {
        results: response.data.results,
        total: response.data.total,
        total_pages: response.data.total_pages,
      };

      // Cache the result
      this.cache.set(cacheKey, { data, timestamp: Date.now() });

      return data;
    } catch (error) {
      console.error(`Error fetching photos for topic ${topic}:`, error);

      // Return mock data as fallback
      const mockResults = this.getMockPhotos(perPage);
      return {
        results: mockResults,
        total: mockResults.length,
        total_pages: 1,
      };
    }
  }

  async getPhotoById(id: string): Promise<UnsplashPhoto> {
    try {
      const response = await axios.get(`${this.unsplashBaseUrl}/photos/${id}`, {
        params: {
          client_id: this.accessKey,
        },
      });

      return response.data;
    } catch (error) {
      console.error(`Error fetching photo ${id}:`, error);
      throw new HttpException('Photo not found', HttpStatus.NOT_FOUND);
    }
  }
  async searchPhotos(
    query: string,
    page: number = 1,
    perPage: number = 10,
  ): Promise<{
    results: UnsplashPhoto[];
    total: number;
    total_pages: number;
  }> {
    const cacheKey = `search-${query}-${page}-${perPage}`;

    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      console.log('Returning cached search results');
      return cached.data;
    }

    try {
      const response = await axios.get(
        `${this.unsplashBaseUrl}/search/photos`,
        {
          params: {
            query,
            page,
            per_page: perPage,
            client_id: this.accessKey,
          },
          timeout: 10000,
          headers: {
            'User-Agent': 'Unsplash-Clone-App/1.0',
          },
        },
      );

      const data = response.data;

      // Cache the result
      this.cache.set(cacheKey, { data, timestamp: Date.now() });

      return data;
    } catch (error) {
      console.error(`Error searching photos with query ${query}:`, error);

      // Return mock data as fallback
      const mockResults = this.getMockPhotos(perPage);
      return {
        results: mockResults,
        total: mockResults.length,
        total_pages: 1,
      };
    }
  }

  async likePhoto(userId: string, photoId: string) {
    try {
      // Check if already liked
      const existingLike = await this.prisma.like.findUnique({
        where: {
          userId_photoId: {
            userId,
            photoId,
          },
        },
      });

      if (existingLike) {
        // Unlike the photo
        await this.prisma.like.delete({
          where: { id: existingLike.id },
        });
        return { liked: false };
      } else {
        // Like the photo
        await this.prisma.like.create({
          data: {
            userId,
            photoId,
          },
        });
        return { liked: true };
      }
    } catch (error) {
      console.error('Error toggling photo like:', error);
      throw new HttpException(
        'Failed to toggle like',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async downloadPhoto(userId: string, photoId: string, downloadUrl: string) {
    try {
      // Record the download
      await this.prisma.download.create({
        data: {
          userId,
          photoId,
        },
      });

      // Trigger download at Unsplash (for analytics)
      await axios.get(`${this.unsplashBaseUrl}/photos/${photoId}/download`, {
        params: {
          client_id: this.accessKey,
        },
      });

      return { downloadUrl };
    } catch (error) {
      console.error('Error recording download:', error);
      throw new HttpException(
        'Failed to process download',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserLikedPhotos(userId: string) {
    return this.prisma.like.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        photoId: true,
        createdAt: true,
      },
    });
  }

  async getUserDownloads(userId: string) {
    return this.prisma.download.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        photoId: true,
        createdAt: true,
      },
    });
  }
}
