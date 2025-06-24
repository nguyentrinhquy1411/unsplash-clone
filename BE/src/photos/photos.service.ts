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

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.accessKey =
      this.configService.get<string>('UNSPLASH_ACCESS_KEY') || '';
  }
  async getRandomPhotos(
    count: number = 10,
    query?: string,
  ): Promise<UnsplashPhoto[]> {
    const url = query
      ? `${this.unsplashBaseUrl}/search/photos`
      : `${this.unsplashBaseUrl}/photos/random`;

    const params = query
      ? { query, per_page: count, client_id: this.accessKey }
      : { count, client_id: this.accessKey };

    try {
      const response = await axios.get(url, {
        params,
        timeout: 10000,
        headers: {
          'User-Agent': 'Unsplash-Clone-App/1.0',
        },
      });

      return query ? response.data.results : response.data;
    } catch (error) {
      console.error('Error fetching photos from Unsplash:', error);
      throw new HttpException(
        'Failed to fetch photos',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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

      return {
        results: response.data.results,
        total: response.data.total,
        total_pages: response.data.total_pages,
      };
    } catch (error) {
      console.error(`Error fetching photos for topic ${topic}:`, error);
      throw new HttpException(
        `Failed to fetch photos for topic: ${topic}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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

      return response.data;
    } catch (error) {
      console.error(`Error searching photos with query ${query}:`, error);
      throw new HttpException(
        `Failed to search photos with query: ${query}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
