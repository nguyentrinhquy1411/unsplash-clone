import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { PhotosService } from './photos.service';
import {
  GetPhotosDto,
  GetPhotosByTopicDto,
  SearchPhotosDto,
  DownloadPhotoDto,
} from './dto/photos.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Photos')
@Controller('photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Get('random')
  @ApiOperation({ summary: 'Get random photos from Unsplash' })
  @ApiResponse({
    status: 200,
    description: 'Random photos retrieved successfully',
  })
  async getRandomPhotos(@Query() getPhotosDto: GetPhotosDto) {
    return this.photosService.getRandomPhotos(
      getPhotosDto.count,
      getPhotosDto.query,
    );
  }

  @Get('search')
  @ApiOperation({ summary: 'Search photos on Unsplash' })
  @ApiResponse({
    status: 200,
    description: 'Search results retrieved successfully',
  })
  async searchPhotos(@Query() searchPhotosDto: SearchPhotosDto) {
    return this.photosService.searchPhotos(
      searchPhotosDto.query,
      searchPhotosDto.page,
      searchPhotosDto.perPage,
    );
  }

  @Get('topic/:topic')
  @ApiOperation({ summary: 'Get photos by topic' })
  @ApiParam({ name: 'topic', description: 'Topic to search for' })
  @ApiResponse({
    status: 200,
    description: 'Topic photos retrieved successfully',
  })
  async getPhotosByTopic(
    @Param('topic') topic: string,
    @Query() getPhotosByTopicDto: GetPhotosByTopicDto,
  ) {
    return this.photosService.getPhotosByTopic(
      topic,
      getPhotosByTopicDto.page,
      getPhotosByTopicDto.perPage,
    );
  }

  @Get('detail/:id')
  @ApiOperation({ summary: 'Get photo details by ID' })
  @ApiParam({ name: 'id', description: 'Unsplash photo ID' })
  @ApiResponse({
    status: 200,
    description: 'Photo details retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Photo not found' })
  async getPhotoById(@Param('id') id: string) {
    return this.photosService.getPhotoById(id);
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle like on a photo' })
  @ApiParam({ name: 'id', description: 'Photo ID' })
  @ApiResponse({ status: 200, description: 'Like toggled successfully' })
  async likePhoto(@Param('id') photoId: string, @Request() req) {
    return this.photosService.likePhoto(req.user.id, photoId);
  }

  @Post(':id/download')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Download a photo' })
  @ApiParam({ name: 'id', description: 'Photo ID' })
  @ApiResponse({ status: 200, description: 'Download processed successfully' })
  async downloadPhoto(
    @Param('id') photoId: string,
    @Body() downloadPhotoDto: DownloadPhotoDto,
    @Request() req,
  ) {
    return this.photosService.downloadPhoto(
      req.user.id,
      photoId,
      downloadPhotoDto.downloadUrl,
    );
  }

  @Get('user/likes')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user liked photos' })
  @ApiResponse({
    status: 200,
    description: 'User liked photos retrieved successfully',
  })
  async getUserLikedPhotos(@Request() req) {
    return this.photosService.getUserLikedPhotos(req.user.id);
  }

  @Get('user/downloads')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user download history' })
  @ApiResponse({
    status: 200,
    description: 'User downloads retrieved successfully',
  })
  async getUserDownloads(@Request() req) {
    return this.photosService.getUserDownloads(req.user.id);
  }
}
