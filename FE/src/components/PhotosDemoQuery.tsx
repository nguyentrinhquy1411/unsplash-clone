import React, { useState, useEffect } from 'react';
import { useRandomPhotos, useSearchPhotosSimple } from '../hooks/usePhotos';
import { UnsplashPhoto } from '../services/api';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import OptimizedImage from './OptimizedImage';

const PhotosDemoQuery: React.FC = () => {
  const [count, setCount] = useState(10);
  const [query, setQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<UnsplashPhoto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<'random' | 'search'>('random');

  // React Query hooks
  const randomPhotosQuery = useRandomPhotos(count, undefined);
  const searchPhotosQuery = useSearchPhotosSimple(searchQuery, 1, count);

  // Determine which data to use
  const currentQuery = mode === 'search' ? searchPhotosQuery : randomPhotosQuery;
  const photos = mode === 'search' 
    ? searchPhotosQuery.data?.results || []
    : randomPhotosQuery.data || [];

  const handleGetRandomPhotos = () => {
    setMode('random');
    setSearchQuery('');
    randomPhotosQuery.refetch();
  };

  const handleSearchPhotos = () => {
    if (query.trim()) {
      setMode('search');
      setSearchQuery(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
    setSearchQuery('');
    setSelectedPhoto(null);
    setIsModalOpen(false);
    setMode('random');
  };

  const openModal = (photo: UnsplashPhoto) => {
    setSelectedPhoto(photo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPhoto(null);
  };

  // Auto-fetch random photos on mount
  useEffect(() => {
    if (!randomPhotosQuery.data && !randomPhotosQuery.isFetching) {
      randomPhotosQuery.refetch();
    }
  }, []);

  const isLoading = currentQuery.isFetching || currentQuery.isLoading;
  const error = currentQuery.error?.message;

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">Unsplash Clone</h1>
        <p className="text-muted-foreground text-center">
          Browse beautiful photos with React Query caching
        </p>
      </div>

      {/* Controls Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Photo Controls</CardTitle>
          <CardDescription>
            Get random photos or search for specific images (with optimized caching)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search-input">Search Photos</Label>
              <Input
                id="search-input"
                type="text"
                placeholder="Enter search term..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearchPhotos()}
              />
            </div>
            <div className="w-full sm:w-32">
              <Label htmlFor="count-select">Count</Label>
              <Select value={count.toString()} onValueChange={(value) => setCount(parseInt(value))}>
                <SelectTrigger id="count-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="15">15</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleGetRandomPhotos} disabled={isLoading}>
              {isLoading && mode === 'random' ? 'Loading...' : 'Get Random Photos'}
            </Button>
            <Button onClick={handleSearchPhotos} disabled={isLoading || !query.trim()}>
              {isLoading && mode === 'search' ? 'Searching...' : 'Search Photos'}
            </Button>
            <Button variant="outline" onClick={handleClear}>
              Clear
            </Button>
          </div>

          {/* Query Status */}
          <div className="flex gap-2 text-sm text-muted-foreground">
            {mode === 'random' && (
              <Badge variant="secondary">
                Random Photos {randomPhotosQuery.isFetched && '(Cached)'}
              </Badge>
            )}
            {mode === 'search' && searchQuery && (
              <Badge variant="secondary">
                Search: "{searchQuery}" {searchPhotosQuery.isFetched && '(Cached)'}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert className="mb-6 border-red-500 bg-red-50">
          <AlertDescription className="text-red-700">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Success Alert */}
      {!isLoading && !error && photos.length > 0 && (
        <Alert className="mb-6 border-green-500 bg-green-50">
          <AlertDescription className="text-green-700">
            Successfully loaded {photos.length} photo{photos.length !== 1 ? 's' : ''}
            {mode === 'search' && ` for "${searchQuery}"`}
          </AlertDescription>
        </Alert>
      )}

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: count }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <Skeleton className="w-full h-48 mb-3" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Photos Grid */}
      {!isLoading && photos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <Card 
              key={photo.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => openModal(photo)}
            >
              <CardContent className="p-0">
                <div className="aspect-square overflow-hidden rounded-t-lg">
                  <OptimizedImage
                    src={photo.urls.regular}
                    alt={photo.alt_description || photo.description || 'Photo'}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                    onClick={() => openModal(photo)}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-1 line-clamp-1">
                    {photo.alt_description || photo.description || 'Untitled'}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    by {photo.user.name || photo.user.username}
                  </p>
                  <div className="flex gap-1">
                    <Badge variant="secondary" className="text-xs">
                      {photo.width}×{photo.height}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {photo.likes} ❤️
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No Results */}
      {!isLoading && !error && photos.length === 0 && searchQuery && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No photos found for "{searchQuery}". Try a different search term.
          </p>
        </div>
      )}

      {/* Photo Modal using Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          {selectedPhoto && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {selectedPhoto.alt_description || selectedPhoto.description || 'Untitled'}
                </DialogTitle>
                <DialogDescription>
                  Photo by {selectedPhoto.user.name || selectedPhoto.user.username}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="flex justify-center">
                  <OptimizedImage
                    src={selectedPhoto.urls.regular}
                    alt={selectedPhoto.alt_description || selectedPhoto.description || 'Photo'}
                    width={600}
                    height={400}
                    className="max-w-full max-h-96 object-contain rounded-lg"
                    loading="eager"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Author</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedPhoto.user.name || selectedPhoto.user.username}
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Dimensions</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedPhoto.width} × {selectedPhoto.height} pixels
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Likes</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedPhoto.likes} ❤️
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Downloads</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedPhoto.downloads}
                    </p>
                  </div>
                  
                  {selectedPhoto.description && (
                    <div className="md:col-span-2">
                      <Label className="text-sm font-medium">Description</Label>
                      <p className="text-sm text-muted-foreground">
                        {selectedPhoto.description}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button asChild>
                    <a 
                      href={selectedPhoto.urls.full} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      download
                    >
                      Download Photo
                    </a>
                  </Button>
                  <Button variant="outline" onClick={closeModal}>
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PhotosDemoQuery;
