import React, { useState, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { useSearchPhotos } from '../hooks/usePhotos';
import { UnsplashPhoto } from '../services/api';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import OptimizedImage from './OptimizedImage';

const PhotosInfiniteScroll: React.FC = () => {
  const [query, setQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<UnsplashPhoto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [perPage] = useState(20); // Load 20 photos per page

  // Infinite query for search
  const searchPhotosQuery = useSearchPhotos(searchQuery, perPage);

  // Intersection observer for infinite scroll
  const { ref: loadMoreRef, inView } = useInView({
    rootMargin: '100px', // Start loading 100px before reaching the bottom
    threshold: 0.1,
  });

  // Load more when in view
  React.useEffect(() => {
    if (inView && searchPhotosQuery.hasNextPage && !searchPhotosQuery.isFetchingNextPage) {
      searchPhotosQuery.fetchNextPage();
    }
  }, [inView, searchPhotosQuery.hasNextPage, searchPhotosQuery.isFetchingNextPage]);

  const handleSearch = useCallback(() => {
    if (query.trim()) {
      setSearchQuery(query.trim());
    }
  }, [query]);

  const handleClear = useCallback(() => {
    setQuery('');
    setSearchQuery('');
    setSelectedPhoto(null);
    setIsModalOpen(false);
  }, []);

  const openModal = useCallback((photo: UnsplashPhoto) => {
    setSelectedPhoto(photo);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedPhoto(null);
  }, []);

  // Flatten all pages into a single array
  const photos = searchPhotosQuery.data?.pages.flatMap(page => page.results) ?? [];
  const totalPhotos = searchPhotosQuery.data?.pages[0]?.total ?? 0;

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">Infinite Scroll Photo Gallery</h1>
        <p className="text-muted-foreground text-center">
          Optimized infinite scrolling with React Query caching
        </p>
      </div>

      {/* Search Controls */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Photos</CardTitle>
          <CardDescription>
            Search through millions of photos with infinite scroll
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search-input">Search Query</Label>
              <Input
                id="search-input"
                type="text"
                placeholder="Enter search term (e.g., nature, city, animals)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleSearch} disabled={searchPhotosQuery.isFetching || !query.trim()}>
              {searchPhotosQuery.isFetching ? 'Searching...' : 'Search Photos'}
            </Button>
            <Button variant="outline" onClick={handleClear}>
              Clear
            </Button>
          </div>

          {/* Search Status */}
          {searchQuery && (
            <div className="flex gap-2 text-sm text-muted-foreground">
              <Badge variant="secondary">
                Search: "{searchQuery}"
              </Badge>
              {totalPhotos > 0 && (
                <Badge variant="outline">
                  {photos.length} of {totalPhotos.toLocaleString()} photos loaded
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Search Suggestions */}
      {!searchQuery && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-3">Quick search suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {['nature', 'architecture', 'travel', 'technology', 'food', 'animals', 'abstract', 'portrait'].map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setQuery(suggestion);
                    setSearchQuery(suggestion);
                  }}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Alert */}
      {searchPhotosQuery.error && (
        <Alert className="mb-6 border-red-500 bg-red-50">
          <AlertDescription className="text-red-700">
            {searchPhotosQuery.error.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Photos Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          {photos.map((photo, index) => (
            <Card 
              key={`${photo.id}-${index}`}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => openModal(photo)}
            >
              <CardContent className="p-0">
                <div className="aspect-square overflow-hidden rounded-t-lg">
                  <OptimizedImage
                    src={photo.urls.small}
                    alt={photo.alt_description || photo.description || 'Photo'}
                    width={300}
                    height={300}
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

      {/* Loading More Indicator */}
      {searchPhotosQuery.isFetchingNextPage && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={`skeleton-${index}`}>
              <CardContent className="p-4">
                <Skeleton className="w-full h-48 mb-3" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Load More Trigger */}
      {searchPhotosQuery.hasNextPage && (
        <div ref={loadMoreRef} className="flex justify-center py-8">
          <Button
            onClick={() => searchPhotosQuery.fetchNextPage()}
            disabled={searchPhotosQuery.isFetchingNextPage}
            variant="outline"
          >
            {searchPhotosQuery.isFetchingNextPage ? 'Loading...' : 'Load More Photos'}
          </Button>
        </div>
      )}

      {/* End Message */}
      {searchQuery && !searchPhotosQuery.hasNextPage && photos.length > 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            You've reached the end! Showing all {photos.length} photos for "{searchQuery}"
          </p>
        </div>
      )}

      {/* No Results */}
      {searchQuery && !searchPhotosQuery.isLoading && photos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No photos found for "{searchQuery}". Try a different search term.
          </p>
        </div>
      )}

      {/* Photo Modal */}
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

export default PhotosInfiniteScroll;
